import type { UserPricingInterval, UserSupportedModelPricing } from '@/api/channels'
import type { ModelPlazaGroup, ModelPlazaResponse, PlazaModel } from '@/api/modelPlaza'
import {
  BILLING_MODE_IMAGE,
  BILLING_MODE_PER_REQUEST,
  BILLING_MODE_TOKEN,
  BILLING_MODE_VIDEO,
  type BillingMode,
} from '@/constants/channel'
import { formatScaled, resolveIntervalPrices } from '@/utils/pricing'

export type HomeCatalogKind = 'token' | 'image' | 'request' | 'video'

export interface HomeCatalogItem {
  key: string
  name: string
  platform: string
  kind: HomeCatalogKind
  /** Per-token USD already multiplied by the group rate. Null when that side has no price. */
  inputPerToken: number | null
  outputPerToken: number | null
  /** Per-image or per-request USD already multiplied by the rate that applies. */
  unitPrice: number | null
}

export interface HomeCatalog {
  stage: HomeCatalogItem[]
  shelf: HomeCatalogItem[]
}

const STAGE_LIMIT = 5
const SHELF_LIMIT = 8

const KIND_ORDER: Record<HomeCatalogKind, number> = {
  token: 0,
  image: 1,
  request: 2,
  video: 3,
}

export function formatHomeTokenPrice(value: number | null): string {
  return formatScaled(value, 1_000_000, 2)
}

export function formatHomeUnitPrice(value: number | null): string {
  return formatScaled(value, 1, 2)
}

/**
 * Public homepage prices. Exclusive groups stay off this page.
 * The rate matches the model plaza standard column: group rate, or the
 * visitor's own rate when the payload includes one. Peak hours and reasoning
 * multipliers are left to the full catalog.
 */
export function selectHomeCatalog(response: ModelPlazaResponse | null | undefined): HomeCatalog {
  const items = dedupe(response?.groups ?? [])
  return {
    stage: pickStage(items),
    shelf: pickShelf(items),
  }
}

export function homeApiBase(sanitized: string, origin: string): string {
  return (sanitized || origin).replace(/\/+$/, '')
}

export function homeCurlExample(base: string): string {
  return [
    `curl -X POST ${base}/v1/messages \\`,
    '  -H "Authorization: Bearer sk-••••" \\',
    '  -H "Content-Type: application/json"',
  ].join('\n')
}

function dedupe(groups: ModelPlazaGroup[]): HomeCatalogItem[] {
  const byKey = new Map<string, HomeCatalogItem>()
  for (const group of groups) {
    if (group.is_exclusive) continue
    for (const model of group.models ?? []) {
      const item = toItem(group, model)
      if (!item) continue
      const existing = byKey.get(item.key)
      if (!existing || (!hasTokenPair(existing) && hasTokenPair(item))) {
        byKey.set(item.key, item)
      }
    }
  }
  return [...byKey.values()]
}

/**
 * Decorative stage tiles for when the public catalog is unavailable
 * (model plaza off or auth-gated). Prices stay null so chips and the
 * caption render names only — no "$" anywhere on the page.
 */
export const DECORATIVE_STAGE_ITEMS: HomeCatalogItem[] = (
  [
    ['openai', 'OpenAI'],
    ['anthropic', 'Anthropic'],
    ['gemini', 'Gemini'],
    ['deepseek', 'DeepSeek'],
    ['qwen', 'Qwen'],
  ] as const
).map(([platform, name]) => ({
  key: `deco-${platform}`,
  name,
  platform,
  kind: 'token' as const,
  inputPerToken: null,
  outputPerToken: null,
  unitPrice: null,
}))

function hasTokenPair(item: HomeCatalogItem): boolean {
  return item.kind === 'token' && item.inputPerToken != null && item.outputPerToken != null
}

function toItem(group: ModelPlazaGroup, model: PlazaModel): HomeCatalogItem | null {
  const pricing = model.pricing
  if (!pricing) return null
  const kind = kindOf(pricing.billing_mode)
  const rate = appliedRate(group, kind)
  const token = tokenPrices(pricing)
  const item: HomeCatalogItem = {
    key: `${model.platform}\u001f${model.name}`,
    name: model.name,
    platform: model.platform,
    kind,
    inputPerToken: scale(token.input, rate),
    outputPerToken: scale(token.output, rate),
    unitPrice: scale(unitRaw(pricing, kind), rate),
  }
  if (kind === 'token') {
    if (item.inputPerToken == null && item.outputPerToken == null) return null
  } else if (item.unitPrice == null) {
    return null
  }
  return item
}

function appliedRate(group: ModelPlazaGroup, kind: HomeCatalogKind): number {
  const raw = kind === 'image' && group.image_rate_independent
    ? group.image_rate_multiplier
    : (group.user_rate_multiplier ?? group.rate_multiplier)
  return Number.isFinite(raw) ? raw : 1
}

function kindOf(mode: BillingMode | string | null | undefined): HomeCatalogKind {
  if (mode === BILLING_MODE_IMAGE) return 'image'
  if (mode === BILLING_MODE_PER_REQUEST) return 'request'
  if (mode === BILLING_MODE_VIDEO) return 'video'
  if (mode === BILLING_MODE_TOKEN || mode == null || mode === '') return 'token'
  return 'token'
}

function scale(value: number | null, rate: number): number | null {
  if (value == null || !Number.isFinite(value)) return null
  return value * rate
}

function tokenPrices(pricing: UserSupportedModelPricing): { input: number | null; output: number | null } {
  if (pricing.input_price != null || pricing.output_price != null) {
    return { input: pricing.input_price, output: pricing.output_price }
  }
  const first = lowestInterval(pricing)
  if (!first) return { input: null, output: null }
  const resolved = resolveIntervalPrices(first, pricing)
  return { input: resolved.input_price, output: resolved.output_price }
}

function unitRaw(pricing: UserSupportedModelPricing, kind: HomeCatalogKind): number | null {
  if (kind === 'token') return null
  if (pricing.per_request_price != null) return pricing.per_request_price
  const interval = (pricing.intervals ?? []).find((row) => row.per_request_price != null)
  return interval?.per_request_price ?? null
}

function lowestInterval(pricing: UserSupportedModelPricing): UserPricingInterval | null {
  const intervals = pricing.intervals ?? []
  if (!intervals.length) return null
  return [...intervals].sort((a, b) => a.min_tokens - b.min_tokens)[0] ?? null
}

function pickStage(items: HomeCatalogItem[]): HomeCatalogItem[] {
  const ready = items
    .filter(hasTokenPair)
    .sort((a, b) => a.name.localeCompare(b.name) || a.platform.localeCompare(b.platform))
  const byPlatform = new Map<string, HomeCatalogItem[]>()
  for (const item of ready) {
    const list = byPlatform.get(item.platform) ?? []
    list.push(item)
    byPlatform.set(item.platform, list)
  }
  const platforms = [...byPlatform.keys()].sort()
  const picked: HomeCatalogItem[] = []
  let round = 0
  while (picked.length < STAGE_LIMIT) {
    let added = false
    for (const platform of platforms) {
      const item = byPlatform.get(platform)?.[round]
      if (!item) continue
      picked.push(item)
      added = true
      if (picked.length === STAGE_LIMIT) break
    }
    if (!added) break
    round += 1
  }
  return picked
}

function pickShelf(items: HomeCatalogItem[]): HomeCatalogItem[] {
  return [...items]
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.name.localeCompare(b.name) || a.platform.localeCompare(b.platform))
    .slice(0, SHELF_LIMIT)
}
