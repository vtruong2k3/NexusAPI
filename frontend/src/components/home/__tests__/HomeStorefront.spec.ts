import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import type { ModelPlazaResponse } from '@/api/modelPlaza'
import { formatScaled } from '@/utils/pricing'
import HomeStorefront from '../HomeStorefront.vue'

const { appStore, authStore, getModelPlaza } = vi.hoisted(() => ({
  appStore: {
    cachedPublicSettings: {} as Record<string, unknown>,
    siteName: 'Fallback site',
    siteLogo: '',
    docUrl: '',
    publicSettingsLoaded: true,
    fetchPublicSettings: vi.fn(),
  },
  authStore: {
    isAuthenticated: false,
    isAdmin: false,
    user: null as { email?: string } | null,
  },
  getModelPlaza: vi.fn(),
}))

vi.mock('@/stores', () => ({
  useAppStore: () => appStore,
  useAuthStore: () => authStore,
}))

vi.mock('@/api/modelPlaza', () => ({
  getModelPlaza: (...args: unknown[]) => getModelPlaza(...args),
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('../HomeRoutingStage.vue', () => ({
  default: {
    name: 'HomeRoutingStage',
    props: ['models', 'selectedKey', 'dark'],
    template: '<div data-testid="routing-stage" />',
  },
}))

function mountStore(settings: Record<string, unknown> = {}) {
  appStore.cachedPublicSettings = {
    site_name: 'Test site',
    site_subtitle: 'Test subtitle',
    ...settings,
  }
  return mount(HomeStorefront, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        LocaleSwitcher: { template: '<div data-testid="locale-switcher" />' },
        Icon: { template: '<span data-testid="icon" />' },
      },
    },
  })
}

function routeOf(wrapper: ReturnType<typeof mountStore>, testId: string) {
  return wrapper
    .findAllComponents(RouterLinkStub)
    .find((link) => link.attributes('data-testid') === testId)
    ?.props('to')
}

function tokenPlaza(): ModelPlazaResponse {
  return {
    description: '',
    groups: [
      {
        id: 1,
        name: 'public',
        description: '',
        platform: 'anthropic',
        subscription_type: 'standard',
        rate_multiplier: 1,
        peak_rate_enabled: false,
        peak_start: '',
        peak_end: '',
        peak_rate_multiplier: 1,
        is_exclusive: false,
        image_rate_independent: false,
        image_rate_multiplier: 1,
        long_context_pricing_enabled: false,
        models: [
          {
            name: 'claude',
            platform: 'anthropic',
            official_pricing: null,
            pricing: {
              billing_mode: 'token',
              input_price: 0.000003,
              output_price: 0.000015,
              cache_write_price: null,
              cache_read_price: null,
              image_input_price: null,
              image_output_price: null,
              per_request_price: null,
              intervals: [],
            },
          },
        ],
      },
    ],
  }
}

describe('HomeStorefront', () => {
  beforeEach(() => {
    authStore.isAuthenticated = false
    authStore.isAdmin = false
    authStore.user = null
    getModelPlaza.mockReset()
    getModelPlaza.mockResolvedValue({ description: '', groups: [] })
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('sends anonymous visitors to login until registration is open', () => {
    const wrapper = mountStore()
    expect(routeOf(wrapper, 'primary-cta')).toBe('/login')
    expect(wrapper.get('[data-testid="primary-cta"]').text()).toBe('home.login')
  })

  it('sends anonymous visitors to register when registration is open', () => {
    const wrapper = mountStore({ registration_enabled: true })
    expect(routeOf(wrapper, 'primary-cta')).toBe('/register')
    expect(wrapper.get('[data-testid="primary-cta"]').text()).toBe('home.storefront.register')
  })

  it('sends signed-in people to the right dashboard', () => {
    authStore.isAuthenticated = true
    expect(routeOf(mountStore(), 'primary-cta')).toBe('/dashboard')

    authStore.isAdmin = true
    expect(routeOf(mountStore(), 'primary-cta')).toBe('/admin/dashboard')
  })

  it('hides payment cards that the site has turned off', () => {
    const balanceOff = mountStore({ payment_balance_disabled: true })
    expect(balanceOff.find('[data-testid="offer-wallet"]').exists()).toBe(false)
    expect(balanceOff.find('[data-testid="offer-subscription"]').exists()).toBe(true)

    const subscriptionOff = mountStore({ subscription_enabled: false })
    expect(subscriptionOff.find('[data-testid="offer-subscription"]').exists()).toBe(false)
    expect(subscriptionOff.find('[data-testid="offer-wallet"]').exists()).toBe(true)

    const paymentOff = mountStore({ payment_enabled: false })
    expect(paymentOff.find('[data-testid="offer-wallet"]').exists()).toBe(false)
    expect(paymentOff.find('[data-testid="offer-subscription"]').exists()).toBe(false)
    expect(paymentOff.find('[data-testid="offer-redeem"]').exists()).toBe(true)
  })

  it('keeps prices off the page and keeps the 3D stage when the catalog cannot be read', async () => {
    getModelPlaza.mockRejectedValue(new Error('offline'))
    const wrapper = mountStore({ model_plaza_enabled: true, model_plaza_require_auth: false })
    await flushPromises()

    expect(getModelPlaza).toHaveBeenCalled()
    expect(wrapper.get('[data-testid="prices-unavailable"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('$')
    const stage = wrapper.findComponent({ name: 'HomeRoutingStage' })
    expect(stage.exists()).toBe(true)
    expect((stage.props('models') as Array<{ key: string }>).every((item) => item.key.startsWith('deco-'))).toBe(true)
    expect(wrapper.get('[data-testid="stage-hint"]').exists()).toBe(true)
  })

  it('does not request the catalog when anonymous visitors must sign in first', async () => {
    const wrapper = mountStore({ model_plaza_enabled: true, model_plaza_require_auth: true })
    await flushPromises()

    expect(getModelPlaza).not.toHaveBeenCalled()
    expect(wrapper.findAllComponents(RouterLinkStub).some((link) => link.props('to') === '/model-plaza')).toBe(false)
    expect(wrapper.text()).not.toContain('$')
  })

  it('shows the standard token price from the catalog', async () => {
    getModelPlaza.mockResolvedValue(tokenPlaza())
    const wrapper = mountStore({ model_plaza_enabled: true, model_plaza_require_auth: false })
    await flushPromises()

    expect(wrapper.get('[data-testid="shelf-row"]').text()).toContain('claude')
    expect(wrapper.get('[data-testid="shelf-price"]').text()).toBe(formatScaled(0.000003, 1_000_000, 2))
    expect(wrapper.find('[data-testid="routing-stage"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="stage-fallback"]').exists()).toBe(false)
  })

  it('copies a sample request that uses the public API base', async () => {
    const wrapper = mountStore({ api_base_url: 'https://api.example.com' })
    await wrapper.get('[data-testid="copy-snippet"]').trigger('click')
    await flushPromises()

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('https://api.example.com/v1/messages'))
    expect(wrapper.get('[data-testid="copy-snippet"]').text()).toBe('home.storefront.connect.copied')
  })

  it('shows decorative stage names without prices when the catalog is empty', async () => {
    const wrapper = mountStore({ model_plaza_enabled: false })
    await flushPromises()

    const stage = wrapper.findComponent({ name: 'HomeRoutingStage' })
    expect(stage.exists()).toBe(true)
    const models = stage.props('models') as Array<{ key: string; name: string; inputPerToken: number | null }>
    expect(models.length).toBeGreaterThan(0)
    expect(models.every((item) => item.key.startsWith('deco-') && item.inputPerToken == null)).toBe(true)
    expect(models.map((item) => item.name)).toContain('OpenAI')
    expect(wrapper.text()).not.toContain('$')
  })

  it('hides the channel status link when monitoring is off', () => {
    const wrapper = mountStore({ channel_monitor_enabled: false })
    expect(wrapper.find('[data-testid="monitor-link"]').exists()).toBe(false)
  })
})
