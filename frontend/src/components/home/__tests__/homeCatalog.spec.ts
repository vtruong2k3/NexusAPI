import { describe, expect, it } from 'vitest'

import type { UserSupportedModelPricing } from '@/api/channels'
import type { ModelPlazaGroup, ModelPlazaResponse, PlazaModel } from '@/api/modelPlaza'
import { formatScaled } from '@/utils/pricing'
import {
  DECORATIVE_STAGE_ITEMS,
  formatHomeTokenPrice,
  formatHomeUnitPrice,
  homeCurlExample,
  selectHomeCatalog,
} from '../homeCatalog'

function pricing(partial: Partial<UserSupportedModelPricing> = {}): UserSupportedModelPricing {
  return {
    billing_mode: 'token',
    input_price: null,
    output_price: null,
    cache_write_price: null,
    cache_read_price: null,
    image_input_price: null,
    image_output_price: null,
    per_request_price: null,
    intervals: [],
    ...partial,
  }
}

function model(partial: Partial<PlazaModel> & Pick<PlazaModel, 'name' | 'platform'>): PlazaModel {
  return {
    pricing: pricing(),
    official_pricing: null,
    ...partial,
  }
}

function group(partial: Partial<ModelPlazaGroup> & Pick<ModelPlazaGroup, 'models'>): ModelPlazaGroup {
  return {
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
    ...partial,
  }
}

function catalog(groups: ModelPlazaGroup[]): ReturnType<typeof selectHomeCatalog> {
  const response: ModelPlazaResponse = { description: '', groups }
  return selectHomeCatalog(response)
}

describe('selectHomeCatalog', () => {
  it('returns empty lists for a missing payload', () => {
    expect(selectHomeCatalog(null)).toEqual({ stage: [], shelf: [] })
    expect(selectHomeCatalog({ description: '', groups: [] })).toEqual({ stage: [], shelf: [] })
  })

  it('drops exclusive groups and models without a price', () => {
    const result = catalog([
      group({
        is_exclusive: true,
        models: [model({ name: 'secret', platform: 'openai', pricing: pricing({ input_price: 1, output_price: 2 }) })],
      }),
      group({
        models: [model({ name: 'blank', platform: 'openai', pricing: null })],
      }),
    ])

    expect(result.stage).toEqual([])
    expect(result.shelf).toEqual([])
  })

  it('keeps the first priced copy and upgrades a partial token price to a full pair', () => {
    const result = catalog([
      group({
        rate_multiplier: 1,
        models: [model({ name: 'claude', platform: 'anthropic', pricing: pricing({ input_price: 0.000001, output_price: null }) })],
      }),
      group({
        id: 2,
        rate_multiplier: 2,
        models: [model({ name: 'claude', platform: 'anthropic', pricing: pricing({ input_price: 0.000003, output_price: 0.000015 }) })],
      }),
      group({
        id: 3,
        rate_multiplier: 9,
        models: [model({ name: 'claude', platform: 'anthropic', pricing: pricing({ input_price: 0.000001, output_price: 0.000001 }) })],
      }),
    ])

    expect(result.shelf).toHaveLength(1)
    expect(result.stage[0]?.inputPerToken).toBe(0.000006)
    expect(result.stage[0]?.outputPerToken).toBe(0.00003)
    expect(formatHomeTokenPrice(result.stage[0]?.inputPerToken ?? null)).toBe(formatScaled(0.000006, 1_000_000, 2))
  })

  it('uses the visitor rate and an image-only rate when the group says so', () => {
    const result = catalog([
      group({
        rate_multiplier: 10,
        user_rate_multiplier: 0.5,
        image_rate_independent: true,
        image_rate_multiplier: 3,
        models: [
          model({ name: 'gpt', platform: 'openai', pricing: pricing({ input_price: 0.000002, output_price: 0.000004 }) }),
          model({
            name: 'image',
            platform: 'openai',
            pricing: pricing({ billing_mode: 'image', per_request_price: 0.02 }),
          }),
        ],
      }),
    ])

    const token = result.shelf.find((item) => item.name === 'gpt')
    const image = result.shelf.find((item) => item.name === 'image')
    expect(token?.inputPerToken).toBe(0.000001)
    expect(image?.unitPrice).toBe(0.06)
    expect(formatHomeUnitPrice(image?.unitPrice ?? null)).toBe('$0.06')
  })

  it('fills the stage with distinct platforms before a second model from the same platform', () => {
    const models = ['a', 'b', 'c', 'd', 'e', 'f'].map((name, index) =>
      model({
        name,
        platform: index < 2 ? 'openai' : name,
        pricing: pricing({ input_price: 0.000001, output_price: 0.000002 }),
      }),
    )
    const result = catalog([group({ models })])
    expect(result.stage).toHaveLength(5)
    expect(new Set(result.stage.map((item) => item.platform)).size).toBe(5)
  })

  it('caps the shelf at eight and lists token models ahead of images', () => {
    const tokens = Array.from({ length: 6 }, (_, index) =>
      model({
        name: `t-${index}`,
        platform: 'openai',
        pricing: pricing({ input_price: 0.000001, output_price: null }),
      }),
    )
    const images = Array.from({ length: 4 }, (_, index) =>
      model({
        name: `i-${index}`,
        platform: 'openai',
        pricing: pricing({ billing_mode: 'image', per_request_price: 0.01 }),
      }),
    )
    const result = catalog([group({ models: [...images, ...tokens] })])
    expect(result.shelf).toHaveLength(8)
    expect(result.shelf.slice(0, 6).every((item) => item.kind === 'token')).toBe(true)
    expect(result.shelf.slice(6).every((item) => item.kind === 'image')).toBe(true)
    expect(result.stage).toHaveLength(0)
  })

  it('uses the lowest context tier when the flat token price is empty', () => {
    const result = catalog([
      group({
        rate_multiplier: 2,
        models: [
          model({
            name: 'tiered',
            platform: 'anthropic',
            pricing: pricing({
              intervals: [
                {
                  min_tokens: 200000,
                  max_tokens: null,
                  input_price: 0.000006,
                  output_price: 0.000022,
                  cache_write_price: null,
                  cache_read_price: null,
                  per_request_price: null,
                },
                {
                  min_tokens: 0,
                  max_tokens: 200000,
                  input_price: 0.000003,
                  output_price: 0.000015,
                  cache_write_price: null,
                  cache_read_price: null,
                  per_request_price: null,
                },
              ],
            }),
          }),
        ],
      }),
    ])

    expect(result.stage[0]?.inputPerToken).toBe(0.000006)
    expect(result.stage[0]?.outputPerToken).toBe(0.00003)
  })
})

describe('homeCurlExample', () => {
  it('builds a sample call against the sanitized base', () => {
    expect(homeCurlExample('https://api.example.com')).toContain('https://api.example.com/v1/messages')
    expect(homeCurlExample('https://api.example.com')).toContain('sk-••••')
  })
})

describe('DECORATIVE_STAGE_ITEMS', () => {
  it('carries platform names without any prices', () => {
    expect(DECORATIVE_STAGE_ITEMS.length).toBeGreaterThan(0)
    for (const item of DECORATIVE_STAGE_ITEMS) {
      expect(item.key.startsWith('deco-')).toBe(true)
      expect(item.inputPerToken).toBeNull()
      expect(item.outputPerToken).toBeNull()
      expect(item.unitPrice).toBeNull()
    }
  })
})
