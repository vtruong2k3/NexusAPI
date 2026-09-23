import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import type { HomeCatalogItem } from '../homeCatalog'
import HomeRoutingStage from '../HomeRoutingStage.vue'

const { mountRoutingStage } = vi.hoisted(() => ({
  mountRoutingStage: vi.fn(),
}))

vi.mock('../routingStage', () => ({
  mountRoutingStage,
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

function item(name: string): HomeCatalogItem {
  return {
    key: name,
    name,
    platform: 'openai',
    kind: 'token',
    inputPerToken: 0.000001,
    outputPerToken: 0.000002,
    unitPrice: null,
  }
}

describe('HomeRoutingStage', () => {
  beforeEach(() => {
    mountRoutingStage.mockReset()
    mountRoutingStage.mockResolvedValue({
      setSelected: vi.fn(),
      setDark: vi.fn(),
      dispose: vi.fn(),
    })
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList)
  })

  it('cycles the selected model until the visitor hovers or the stage unmounts', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    const wrapper = mount(HomeRoutingStage, {
      props: {
        models: [item('first'), item('second')],
        selectedKey: 'first',
        dark: false,
      },
    })
    await flushPromises()

    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['second'])

    await wrapper.trigger('pointerenter')
    vi.advanceTimersByTime(5000)
    expect(wrapper.emitted('update:selectedKey')).toHaveLength(1)

    await wrapper.trigger('pointerleave')
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    wrapper.unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
    vi.advanceTimersByTime(15000)
    vi.useRealTimers()
  })

  it('hides the price line when a model carries no prices', async () => {
    const wrapper = mount(HomeRoutingStage, {
      props: {
        models: [
          { ...item('priced') },
          { ...item('bare'), inputPerToken: null, outputPerToken: null },
        ],
        selectedKey: 'priced',
        dark: false,
      },
    })
    await flushPromises()

    const chips = wrapper.findAll('.chip')
    expect(chips).toHaveLength(2)
    expect(chips[0].find('.chip-price').exists()).toBe(true)
    expect(chips[1].find('.chip-price').exists()).toBe(false)
    expect(chips[1].text()).toContain('bare')
  })

  it('drops the canvas when WebGL setup fails and keeps the model list', async () => {
    mountRoutingStage.mockRejectedValue(new Error('no webgl'))
    const wrapper = mount(HomeRoutingStage, {
      props: {
        models: [item('only')],
        selectedKey: 'only',
        dark: false,
      },
    })
    await flushPromises()

    expect(wrapper.find('canvas').exists()).toBe(false)
    expect(wrapper.get('[data-testid="stage-static"]').text()).toContain('only')
  })

  it('disposes the scene on unmount', async () => {
    const dispose = vi.fn()
    mountRoutingStage.mockResolvedValue({
      setSelected: vi.fn(),
      setDark: vi.fn(),
      dispose,
    })
    const wrapper = mount(HomeRoutingStage, {
      props: {
        models: [item('only')],
        selectedKey: 'only',
        dark: false,
      },
    })
    await flushPromises()
    wrapper.unmount()
    expect(dispose).toHaveBeenCalledOnce()
  })
})
