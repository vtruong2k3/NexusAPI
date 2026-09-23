import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

export interface StageLabelPoint {
  key: string
  x: number
  y: number
}

export interface RoutingStageModel {
  key: string
}

export interface RoutingStageHandle {
  setSelected(key: string): void
  setDark(dark: boolean): void
  dispose(): void
}

export interface MountRoutingStageOptions {
  models: RoutingStageModel[]
  selectedKey: string
  reducedMotion: boolean
  dark: boolean
  finePointer: boolean
  onLabels: (points: StageLabelPoint[]) => void
  onSelect: (key: string) => void
}

interface Plate {
  key: string
  mesh: THREE.Mesh
  edge: THREE.LineSegments
  target: THREE.Vector3
  baseX: number
}

const INK = 0x0f172a
const CYAN = 0x06b6d4
const MINT = 0x2dd4bf
const BLUE = 0x0d9488

export function mountRoutingStage(
  canvas: HTMLCanvasElement,
  options: MountRoutingStageOptions,
): RoutingStageHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 40)
  camera.position.set(0.15, 1.65, 7.2)
  camera.lookAt(0.1, 0.4, 0)

  const root = new THREE.Group()
  scene.add(root)

  const disposables: Array<{ dispose: () => void }> = []
  const track = <T extends { dispose: () => void }>(value: T): T => {
    disposables.push(value)
    return value
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.82))
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
  keyLight.position.set(3.2, 5.2, 4)
  scene.add(keyLight)
  const rimLight = new THREE.DirectionalLight(CYAN, 0.4)
  rimLight.position.set(-4, 1.2, -2)
  scene.add(rimLight)

  const floor = new THREE.GridHelper(9, 18, 0xd1d5db, 0xe5e7eb)
  floor.position.y = -0.85
  root.add(floor)

  const keyMesh = new THREE.Mesh(
    track(new RoundedBoxGeometry(1.9, 1.12, 0.09, 4, 0.08)),
    track(new THREE.MeshStandardMaterial({ color: INK, metalness: 0.35, roughness: 0.42 })),
  )
  keyMesh.position.set(-1.9, 0.22, 1.2)
  keyMesh.rotation.y = 0.2
  root.add(keyMesh)

  const rimTexture = logoEdgeTexture()
  if (rimTexture) disposables.push(rimTexture)
  const rimMesh = new THREE.Mesh(
    track(new RoundedBoxGeometry(1.98, 1.18, 0.04, 4, 0.08)),
    track(new THREE.MeshBasicMaterial({ map: rimTexture ?? null, color: rimTexture ? 0xffffff : CYAN })),
  )
  rimMesh.position.copy(keyMesh.position)
  rimMesh.position.z -= 0.05
  rimMesh.rotation.copy(keyMesh.rotation)
  root.add(rimMesh)

  const plates: Plate[] = options.models.map((model, index) => {
    const count = options.models.length
    const t = count === 1 ? 0.5 : index / (count - 1)
    const x = -0.2 + t * 2.75
    const geometry = track(new RoundedBoxGeometry(1.12, 1.5, 0.055, 3, 0.06))
    const material = track(new THREE.MeshStandardMaterial({
      color: 0xf7fafc,
      metalness: 0.04,
      roughness: 0.38,
      emissive: BLUE,
      emissiveIntensity: 0,
    }))
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, 0.52, -0.35)
    mesh.rotation.y = (t - 0.5) * -0.46
    mesh.userData.key = model.key
    root.add(mesh)
    const edge = new THREE.LineSegments(
      track(new THREE.EdgesGeometry(geometry)),
      track(new THREE.LineBasicMaterial({ color: 0xd5deea })),
    )
    mesh.add(edge)
    return { key: model.key, mesh, edge, target: mesh.position.clone(), baseX: x }
  })

  const filamentPositions = new Float32Array(29 * 3)
  const filamentGeometry = track(new THREE.BufferGeometry())
  filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3))
  const filament = new THREE.Line(
    filamentGeometry,
    track(new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.9 })),
  )
  root.add(filament)
  const spark = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.045, 18, 18)),
    track(new THREE.MeshBasicMaterial({ color: MINT })),
  )
  root.add(spark)

  let selected = options.selectedKey || options.models[0]?.key || ''
  let dark = options.dark
  let running = true
  let raf = 0
  let loopOn = false
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const clock = new THREE.Clock()
  let yaw = 0
  let pitch = 0
  const reduced = options.reducedMotion
  const tilt = options.finePointer && !reduced
  const from = new THREE.Vector3()
  const mid = new THREE.Vector3()
  const to = new THREE.Vector3()

  function lineMaterials(material: THREE.Material | THREE.Material[]): THREE.LineBasicMaterial[] {
    const list = Array.isArray(material) ? material : [material]
    return list.filter((item): item is THREE.LineBasicMaterial => item instanceof THREE.LineBasicMaterial)
  }

  function applyTheme() {
    const [axis, cell] = lineMaterials(floor.material)
    axis?.color.set(dark ? 0x334155 : 0xd1d5db)
    cell?.color.set(dark ? 0x1e293b : 0xe5e7eb)
    for (const plate of plates) {
      const material = plate.mesh.material as THREE.MeshStandardMaterial
      material.color.set(dark ? 0x1e293b : 0xf9fafb)
      ;(plate.edge.material as THREE.LineBasicMaterial).color.set(dark ? 0x475569 : 0xd1d5db)
    }
  }

  function layoutPlates() {
    for (const plate of plates) {
      const active = plate.key === selected
      plate.target.set(plate.baseX, active ? 0.68 : 0.48, active ? 0.62 : -0.42)
      ;(plate.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = active ? 0.2 : 0
    }
  }

  function projectLabels() {
    const width = canvas.clientWidth || 1
    const height = canvas.clientHeight || 1
    options.onLabels(plates.map((plate) => {
      const vector = plate.mesh.getWorldPosition(new THREE.Vector3())
      vector.y += 0.05
      vector.project(camera)
      return {
        key: plate.key,
        x: (vector.x * 0.5 + 0.5) * width,
        y: (-vector.y * 0.5 + 0.5) * height,
      }
    }))
  }

  function updateFilament(travel: number) {
    const plate = plates.find((item) => item.key === selected) ?? plates[0]
    if (!plate) return
    from.set(0.98, 0, 0.06)
    keyMesh.localToWorld(from)
    root.worldToLocal(from)
    to.copy(plate.mesh.position)
    mid.copy(from).lerp(to, 0.5)
    mid.y += 0.55
    const curve = new THREE.CatmullRomCurve3([from, mid, to])
    const points = curve.getPoints(28)
    const attribute = filamentGeometry.getAttribute('position') as THREE.BufferAttribute
    for (let index = 0; index < points.length; index += 1) {
      attribute.setXYZ(index, points[index].x, points[index].y, points[index].z)
    }
    attribute.needsUpdate = true
    filamentGeometry.setDrawRange(0, points.length)
    spark.position.copy(curve.getPoint(reduced ? 1 : travel))
  }

  function resize() {
    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 520
    const height = canvas.clientHeight || canvas.parentElement?.clientHeight || 420
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
  }

  function renderFrame() {
    const travel = (clock.getElapsedTime() % 3.5) / 3.5
    for (const plate of plates) {
      plate.mesh.position.lerp(plate.target, reduced ? 1 : 0.14)
    }
    if (tilt) {
      root.rotation.y += (yaw - root.rotation.y) * 0.08
      root.rotation.x += (pitch - root.rotation.x) * 0.08
    }
    updateFilament(travel)
    renderer.render(scene, camera)
    projectLabels()
  }

  function startLoop() {
    if (loopOn || reduced || !running) return
    loopOn = true
    const tick = () => {
      if (!loopOn) return
      raf = window.requestAnimationFrame(tick)
      renderFrame()
    }
    raf = window.requestAnimationFrame(tick)
  }

  function stopLoop() {
    loopOn = false
    window.cancelAnimationFrame(raf)
  }

  function onPointerMove(event: PointerEvent) {
    if (!tilt) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    yaw = THREE.MathUtils.clamp(px * 0.28, -0.14, 0.14)
    pitch = THREE.MathUtils.clamp(-py * 0.16, -0.07, 0.07)
  }

  function onClick(event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    root.updateWorldMatrix(true, true)
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(plates.map((plate) => plate.mesh))[0]
    const key = hit?.object.userData.key
    if (typeof key === 'string') options.onSelect(key)
  }

  const host = canvas.parentElement ?? canvas
  const resizeObserver = new ResizeObserver(() => {
    resize()
    renderFrame()
  })
  resizeObserver.observe(host)

  let onScreen = true
  const intersection = new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting)
    if (onScreen && document.visibilityState !== 'hidden') startLoop()
    else stopLoop()
  })
  intersection.observe(host)

  const onVisibility = () => {
    if (document.visibilityState === 'hidden' || !onScreen) stopLoop()
    else startLoop()
  }

  document.addEventListener('visibilitychange', onVisibility)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('click', onClick)

  applyTheme()
  layoutPlates()
  resize()
  renderFrame()
  if (!reduced) startLoop()

  return {
    setSelected(key: string) {
      if (!key || key === selected) return
      selected = key
      layoutPlates()
      if (reduced) renderFrame()
    },
    setDark(next: boolean) {
      if (next === dark) return
      dark = next
      applyTheme()
      if (reduced) renderFrame()
    },
    dispose() {
      running = false
      stopLoop()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('click', onClick)
      floor.geometry.dispose()
      lineMaterials(floor.material).forEach((material) => material.dispose())
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

function logoEdgeTexture(): THREE.CanvasTexture | null {
  const paint = document.createElement('canvas')
  paint.width = 128
  paint.height = 8
  const context = paint.getContext('2d')
  if (!context) return null
  const gradient = context.createLinearGradient(0, 0, paint.width, 0)
  gradient.addColorStop(0, '#2DD4BF')
  gradient.addColorStop(0.48, '#14B8A6')
  gradient.addColorStop(1, '#06B6D4')
  context.fillStyle = gradient
  context.fillRect(0, 0, paint.width, paint.height)
  const texture = new THREE.CanvasTexture(paint)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
