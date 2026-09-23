<template>
  <div
    class="stage-root"
    data-testid="routing-stage"
    @pointerenter="paused = true"
    @pointerleave="paused = false"
    @focusin="paused = true"
    @focusout="onFocusOut"
  >
    <div v-if="!failed" ref="wrap" class="stage-canvas-wrap">
      <canvas ref="canvas" />
    </div>
    <ul
      :class="projected ? 'chips-overlay' : 'chips-stack'"
      :aria-label="t('home.storefront.stage.listLabel')"
      data-testid="stage-static"
    >
      <li v-for="model in models" :key="model.key">
        <button
          type="button"
          class="chip"
          :aria-pressed="model.key === selectedKey"
          :style="chipStyle(model.key)"
          @click="choose(model.key)"
        >
          <span class="chip-name">{{ model.name }}</span>
          <span v-if="priceLine(model)" class="chip-price">{{ priceLine(model) }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  formatHomeTokenPrice,
  formatHomeUnitPrice,
  type HomeCatalogItem,
} from './homeCatalog'
import type { RoutingStageHandle, StageLabelPoint } from './routingStage'

const props = defineProps<{
  models: HomeCatalogItem[]
  selectedKey: string
  dark: boolean
}>()

const emit = defineEmits<{
  'update:selectedKey': [key: string]
}>()

const { t } = useI18n()
const canvas = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)
const paused = ref(false)
const points = ref<Record<string, StageLabelPoint>>({})
const mediaCleanups: Array<() => void> = []
const reduced = useMedia('(prefers-reduced-motion: reduce)')
const narrow = useMedia('(max-width: 767px)')
const fine = useMedia('(hover: hover) and (pointer: fine)')

const projected = computed(() => !failed.value && !reduced.value && !narrow.value && Object.keys(points.value).length > 0)

let handle: RoutingStageHandle | null = null
let alive = true
let timer = 0

function useMedia(query: string) {
  const matches = ref(false)
  const media = typeof window.matchMedia === 'function' ? window.matchMedia(query) : null
  matches.value = media?.matches ?? false
  if (media) {
    const onChange = () => {
      matches.value = media.matches
    }
    media.addEventListener?.('change', onChange)
    mediaCleanups.push(() => media.removeEventListener?.('change', onChange))
  }
  return matches
}

function priceLine(model: HomeCatalogItem): string {
  if (model.kind !== 'token') {
    if (model.unitPrice == null) return ''
    const suffix = model.kind === 'image'
      ? t('modelPlaza.table.perUnitImage')
      : t('modelPlaza.table.perUnitRequest')
    return `${formatHomeUnitPrice(model.unitPrice)} ${suffix}`
  }
  if (model.inputPerToken == null && model.outputPerToken == null) return ''
  return `${t('home.storefront.stage.input')} ${formatHomeTokenPrice(model.inputPerToken)} · ${t('home.storefront.stage.output')} ${formatHomeTokenPrice(model.outputPerToken)}`
}

function chipStyle(key: string): Record<string, string> | undefined {
  if (!projected.value) return undefined
  const point = points.value[key]
  if (!point) return undefined
  return { left: `${point.x}px`, top: `${point.y}px` }
}

function choose(key: string) {
  emit('update:selectedKey', key)
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget
  const current = event.currentTarget
  if (current instanceof HTMLElement && next instanceof Node && current.contains(next)) return
  paused.value = false
}

function stopCycle() {
  if (timer) window.clearInterval(timer)
  timer = 0
}

function startCycle() {
  stopCycle()
  if (reduced.value || paused.value || props.models.length < 2) return
  timer = window.setInterval(() => {
    const index = props.models.findIndex((item) => item.key === props.selectedKey)
    const next = props.models[(index + 1) % props.models.length]
    if (next) emit('update:selectedKey', next.key)
  }, 5000)
}

onMounted(async () => {
  startCycle()
  if (!canvas.value) return
  try {
    const { mountRoutingStage } = await import('./routingStage')
    if (!alive || !canvas.value) return
    handle = await mountRoutingStage(canvas.value, {
      models: props.models,
      selectedKey: props.selectedKey,
      reducedMotion: reduced.value,
      dark: props.dark,
      finePointer: fine.value,
      onLabels(next) {
        const map: Record<string, StageLabelPoint> = {}
        for (const point of next) map[point.key] = point
        points.value = map
      },
      onSelect(key) {
        emit('update:selectedKey', key)
      },
    })
    if (!alive) {
      handle.dispose()
      handle = null
    }
  } catch {
    failed.value = true
  }
})

watch(() => props.selectedKey, (key) => {
  handle?.setSelected(key)
})

watch(() => props.dark, (dark) => {
  handle?.setDark(dark)
})

watch([paused, reduced, () => props.models.map((item) => item.key).join('|')], startCycle)

onUnmounted(() => {
  alive = false
  stopCycle()
  mediaCleanups.forEach((cleanup) => cleanup())
  handle?.dispose()
  handle = null
})
</script>

<style scoped>
.stage-root {
  position: relative;
  width: min(100%, 520px);
}

.stage-canvas-wrap {
  height: 420px;
}

.stage-canvas-wrap canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.chips-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 420px;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
}

.chips-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.chip {
  pointer-events: auto;
  display: flex;
  min-width: 0;
  max-width: 220px;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: rgb(255 255 255 / 92%);
  padding: 8px 10px;
  color: #0f172a;
  text-align: left;
  box-shadow: 0 8px 24px rgb(11 23 48 / 8%);
}

.chips-overlay .chip {
  position: absolute;
  transform: translate(-50%, -50%);
}

.chip[aria-pressed='true'] {
  border-color: #0d9488;
}

.chip-name {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-price {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  color: #475569;
}

html.dark .chip {
  border-color: #1e293b;
  background: rgb(15 23 42 / 92%);
  color: #f8fafc;
}

html.dark .chip-price {
  color: #cbd5e1;
}

@media (max-width: 767px) {
  .stage-canvas-wrap,
  .chips-overlay {
    height: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chip {
    transition: none;
  }
}
</style>
