<template>
  <div data-testid="home-storefront" class="home-storefront">
    <header class="home-nav">
      <nav class="home-wrap nav-row" :aria-label="siteName">
        <a class="brand" href="#top">
          <img :src="siteLogo || '/logo.svg'" alt="" class="brand-mark" />
          <span class="brand-name">{{ siteName }}</span>
        </a>
        <div class="nav-links">
          <a href="#models" @click="scrollToSection('models', $event)">{{ t('home.storefront.nav.models') }}</a>
          <a href="#offers" @click="scrollToSection('offers', $event)">{{ t('home.storefront.nav.offers') }}</a>
          <a href="#connect" @click="scrollToSection('connect', $event)">{{ t('home.storefront.nav.connect') }}</a>
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">{{ t('home.docs') }}</a>
        </div>
        <div class="nav-tools">
          <LocaleSwitcher />
          <button type="button" class="icon-button" :title="isDark ? t('home.switchToLight') : t('home.switchToDark')" @click="toggleTheme">
            <Icon v-if="isDark" name="sun" size="md" />
            <Icon v-else name="moon" size="md" />
          </button>
          <router-link data-testid="primary-cta" class="button button-brand" :to="primaryTo">
            {{ primaryLabel }}
          </router-link>
        </div>
      </nav>
    </header>

    <main id="top">
      <section class="home-wrap hero">
        <div class="hero-copy">
          <h1>{{ t('home.storefront.headline') }}</h1>
          <p class="lede">{{ lede }}</p>
          <div class="hero-actions">
            <router-link class="button button-brand" :to="primaryTo">{{ primaryLabel }}</router-link>
            <a class="button button-quiet" href="#models" @click="scrollToSection('models', $event)">
              {{ t('home.storefront.viewPrices') }}
            </a>
          </div>
        </div>
        <div class="hero-stage">
          <HomeRoutingStage
            v-model:selected-key="selectedKey"
            :models="stageDisplayItems"
            :dark="isDark"
          />
          <p v-if="selected" class="stage-caption" data-testid="stage-caption">
            <span>{{ selected.name }}</span>
            <template v-if="showTokenCaption">
              <span>{{ t('home.storefront.stage.input') }} {{ formatHomeTokenPrice(selected.inputPerToken) }}</span>
              <span>{{ t('home.storefront.stage.output') }} {{ formatHomeTokenPrice(selected.outputPerToken) }}</span>
            </template>
            <template v-else-if="showUnitCaption">
              <span>{{ formatHomeUnitPrice(selected.unitPrice) }} {{ unitSuffix(selected) }}</span>
            </template>
          </p>
          <p v-if="stageIsDecorative" class="stage-hint" data-testid="stage-hint">
            {{ t('home.storefront.stage.decorativeHint') }}
          </p>
        </div>
      </section>

      <ul class="home-wrap trust">
        <li>{{ t('home.storefront.trust.openai') }}</li>
        <li>{{ t('home.storefront.trust.anthropic') }}</li>
        <li>{{ t('home.storefront.trust.billing') }}</li>
        <li>{{ t('home.storefront.trust.logs') }}</li>
      </ul>

      <section id="offers" class="home-wrap section">
        <h2>{{ t('home.storefront.offers.title') }}</h2>
        <div class="offer-grid">
          <article
            v-if="showWallet"
            data-testid="offer-wallet"
            class="offer-card"
            @pointermove="tiltCard"
            @pointerleave="resetTilt"
          >
            <p class="eyebrow">{{ t('home.storefront.offers.walletEyebrow') }}</p>
            <h3>{{ t('home.storefront.offers.walletTitle') }}</h3>
            <p>{{ t('home.storefront.offers.walletBody') }}</p>
            <router-link class="text-link" to="/purchase">{{ t('home.storefront.offers.walletCta') }}</router-link>
          </article>
          <article
            v-if="showSubscription"
            data-testid="offer-subscription"
            class="offer-card"
            @pointermove="tiltCard"
            @pointerleave="resetTilt"
          >
            <p class="eyebrow">{{ t('home.storefront.offers.subscriptionEyebrow') }}</p>
            <h3>{{ t('home.storefront.offers.subscriptionTitle') }}</h3>
            <p>{{ t('home.storefront.offers.subscriptionBody') }}</p>
            <router-link class="text-link" to="/purchase">{{ t('home.storefront.offers.subscriptionCta') }}</router-link>
          </article>
          <article
            data-testid="offer-redeem"
            class="offer-card"
            @pointermove="tiltCard"
            @pointerleave="resetTilt"
          >
            <p class="eyebrow">{{ t('home.storefront.offers.redeemEyebrow') }}</p>
            <h3>{{ t('home.storefront.offers.redeemTitle') }}</h3>
            <p>{{ t('home.storefront.offers.redeemBody') }}</p>
            <router-link class="text-link" to="/redeem">{{ t('home.storefront.offers.redeemCta') }}</router-link>
          </article>
        </div>
      </section>

      <section id="models" class="home-wrap section">
        <div class="section-head">
          <div>
            <h2>{{ t('home.storefront.shelf.title') }}</h2>
            <p class="section-note">{{ t('home.storefront.shelf.description') }}</p>
          </div>
          <router-link v-if="showPlazaLink" class="text-link" to="/model-plaza">
            {{ t('home.storefront.shelf.viewAll') }}
          </router-link>
        </div>
        <p v-if="catalogState === 'unavailable'" data-testid="prices-unavailable">
          {{ t('home.storefront.shelf.pricesUnavailable') }}
        </p>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ t('home.storefront.shelf.model') }}</th>
                <th>{{ t('home.storefront.shelf.platform') }}</th>
                <th>{{ t('home.storefront.shelf.input') }}</th>
                <th>{{ t('home.storefront.shelf.output') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in shelfItems" :key="item.key" data-testid="shelf-row">
                <td>{{ item.name }}</td>
                <td>{{ item.platform }}</td>
                <template v-if="item.kind === 'token'">
                  <td data-testid="shelf-price">{{ formatHomeTokenPrice(item.inputPerToken) }}</td>
                  <td data-testid="shelf-price">{{ formatHomeTokenPrice(item.outputPerToken) }}</td>
                </template>
                <td v-else colspan="2" data-testid="shelf-price">
                  {{ formatHomeUnitPrice(item.unitPrice) }} {{ unitSuffix(item) }}
                </td>
              </tr>
            </tbody>
          </table>
          <p class="unit-note">{{ t('home.storefront.shelf.perMillion') }}</p>
        </div>
      </section>

      <section id="connect" class="home-wrap section">
        <h2>{{ t('home.storefront.connect.title') }}</h2>
        <ol class="steps">
          <li>
            <h3>{{ t('home.storefront.connect.step1Title') }}</h3>
            <p>{{ t('home.storefront.connect.step1Body') }}</p>
          </li>
          <li>
            <h3>{{ t('home.storefront.connect.step2Title') }}</h3>
            <p>{{ t('home.storefront.connect.step2Body') }}</p>
          </li>
          <li>
            <h3>{{ t('home.storefront.connect.step3Title') }}</h3>
            <p>{{ t('home.storefront.connect.step3Body') }}</p>
          </li>
          <li>
            <h3>{{ t('home.storefront.connect.step4Title') }}</h3>
            <p>{{ t('home.storefront.connect.step4Body') }}</p>
          </li>
        </ol>
        <div class="snippet">
          <div class="snippet-bar">
            <span>{{ t('home.storefront.connect.snippetLabel') }}</span>
            <button type="button" data-testid="copy-snippet" @click="copySnippet">
              {{ copied ? t('home.storefront.connect.copied') : t('home.storefront.connect.copy') }}
            </button>
          </div>
          <pre data-testid="snippet">{{ snippet }}</pre>
        </div>
      </section>

      <section class="home-wrap section">
        <h2>{{ t('home.storefront.assurance.title') }}</h2>
        <div class="assurance-grid">
          <article>
            <h3>{{ t('home.storefront.assurance.priceTitle') }}</h3>
            <p>{{ t('home.storefront.assurance.priceBody') }}</p>
          </article>
          <article>
            <h3>{{ t('home.storefront.assurance.usageTitle') }}</h3>
            <p>{{ t('home.storefront.assurance.usageBody') }}</p>
          </article>
          <article>
            <h3>{{ t('home.storefront.assurance.limitsTitle') }}</h3>
            <p>{{ t('home.storefront.assurance.limitsBody') }}</p>
          </article>
          <article>
            <h3>{{ t('home.storefront.assurance.failoverTitle') }}</h3>
            <p>{{ t('home.storefront.assurance.failoverBody') }}</p>
            <router-link v-if="showMonitor" data-testid="monitor-link" class="text-link" to="/monitor">
              {{ t('home.storefront.assurance.monitor') }}
            </router-link>
          </article>
        </div>
      </section>

      <section class="home-wrap section">
        <h2>{{ t('home.storefront.compare.title') }}</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ t('home.storefront.compare.feature') }}</th>
                <th>{{ t('home.storefront.compare.value') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{{ t('home.storefront.compare.priceFeature') }}</th>
                <td>{{ t('home.storefront.compare.priceValue') }}</td>
              </tr>
              <tr>
                <th scope="row">{{ t('home.storefront.compare.modelsFeature') }}</th>
                <td>{{ t('home.storefront.compare.modelsValue') }}</td>
              </tr>
              <tr>
                <th scope="row">{{ t('home.storefront.compare.dashboardFeature') }}</th>
                <td>{{ t('home.storefront.compare.dashboardValue') }}</td>
              </tr>
              <tr>
                <th scope="row">{{ t('home.storefront.compare.limitsFeature') }}</th>
                <td>{{ t('home.storefront.compare.limitsValue') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="home-wrap section">
        <h2>{{ t('home.storefront.faq.title') }}</h2>
        <div class="faq">
          <details>
            <summary>{{ t('home.storefront.faq.billingQ') }}</summary>
            <p>{{ t('home.storefront.faq.billingA') }}</p>
          </details>
          <details>
            <summary>{{ t('home.storefront.faq.expiryQ') }}</summary>
            <p>{{ t('home.storefront.faq.expiryA') }}</p>
          </details>
          <details>
            <summary>{{ t('home.storefront.faq.clientsQ') }}</summary>
            <p>{{ t('home.storefront.faq.clientsA') }}</p>
          </details>
          <details>
            <summary>{{ t('home.storefront.faq.logsQ') }}</summary>
            <p>{{ t('home.storefront.faq.logsA') }}</p>
          </details>
          <details>
            <summary>{{ t('home.storefront.faq.contactQ') }}</summary>
            <p>{{ t('home.storefront.faq.contactA') }}</p>
            <p v-if="contactInfo" data-testid="contact-info">{{ contactInfo }}</p>
          </details>
        </div>
      </section>
    </main>

    <footer class="home-footer">
      <div class="home-wrap footer-row">
        <p>&copy; {{ currentYear }} {{ siteName }}. {{ t('home.footer.allRightsReserved') }}</p>
        <div class="footer-links">
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">{{ t('home.docs') }}</a>
          <router-link v-if="showPlazaLink" to="/model-plaza">{{ t('home.storefront.footer.models') }}</router-link>
          <router-link to="/login">{{ t('home.storefront.footer.login') }}</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/latin-500.css'
import '@fontsource/be-vietnam-pro/latin-600.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-500.css'
import '@fontsource/be-vietnam-pro/vietnamese-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/ibm-plex-mono/latin-400.css'

import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getModelPlaza } from '@/api/modelPlaza'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'
import { useAppStore, useAuthStore } from '@/stores'
import { FeatureFlags, resolveFeatureFlag } from '@/utils/featureFlags'
import { sanitizeUrl } from '@/utils/url'
import HomeRoutingStage from './HomeRoutingStage.vue'
import {
  DECORATIVE_STAGE_ITEMS,
  formatHomeTokenPrice,
  formatHomeUnitPrice,
  homeApiBase,
  homeCurlExample,
  selectHomeCatalog,
  type HomeCatalog,
  type HomeCatalogItem,
} from './homeCatalog'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()

const isDark = ref(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
const catalog = ref<HomeCatalog>({ stage: [], shelf: [] })
const catalogState = ref<'loading' | 'ready' | 'unavailable'>('unavailable')
const selectedKey = ref('')
const copied = ref(false)
const allowTilt = ref(false)
let loadController: AbortController | null = null
let copyTimer = 0
let loadGeneration = 0

const settings = computed(() => appStore.cachedPublicSettings)
const siteName = computed(() => settings.value?.site_name || appStore.siteName || 'Sub2API')
const siteLogo = computed(() => sanitizeUrl(settings.value?.site_logo || appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => (settings.value?.site_subtitle || '').trim())
const lede = computed(() => siteSubtitle.value || t('home.storefront.subhead'))
const docUrl = computed(() => sanitizeUrl(settings.value?.doc_url || appStore.docUrl || ''))
const contactInfo = computed(() => (settings.value?.contact_info || '').trim())
const currentYear = computed(() => new Date().getFullYear())

const registrationEnabled = computed(() => settings.value?.registration_enabled === true)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => (authStore.isAdmin ? '/admin/dashboard' : '/dashboard'))
const primaryTo = computed(() => {
  if (isAuthenticated.value) return dashboardPath.value
  return registrationEnabled.value ? '/register' : '/login'
})
const primaryLabel = computed(() => {
  if (isAuthenticated.value) return t('home.goToDashboard')
  return registrationEnabled.value ? t('home.storefront.register') : t('home.login')
})

const paymentOn = computed(() => resolveFeatureFlag(settings.value, FeatureFlags.payment))
const showWallet = computed(() => paymentOn.value && settings.value?.payment_balance_disabled !== true)
const showSubscription = computed(() => paymentOn.value && resolveFeatureFlag(settings.value, FeatureFlags.subscription))
const showMonitor = computed(() => resolveFeatureFlag(settings.value, FeatureFlags.channelMonitor))
const plazaOn = computed(() => resolveFeatureFlag(settings.value, FeatureFlags.modelPlaza))
const showPlazaLink = computed(() => plazaOn.value && (isAuthenticated.value || settings.value?.model_plaza_require_auth !== true))

const stageItems = computed(() => catalog.value.stage)
const shelfItems = computed(() => catalog.value.shelf)
// Keep the 3D stage alive when no public catalog exists: fall back to
// decorative platform tiles that carry no prices.
const stageDisplayItems = computed(() => (stageItems.value.length ? stageItems.value : DECORATIVE_STAGE_ITEMS))
const stageIsDecorative = computed(() => stageItems.value.length === 0)
const selected = computed(() => stageDisplayItems.value.find((item) => item.key === selectedKey.value) ?? null)
const showTokenCaption = computed(() => {
  const item = selected.value
  return !!item && item.kind === 'token' && (item.inputPerToken != null || item.outputPerToken != null)
})
const showUnitCaption = computed(() => {
  const item = selected.value
  return !!item && item.kind !== 'token' && item.unitPrice != null
})
const apiBase = computed(() => homeApiBase(
  sanitizeUrl(settings.value?.api_base_url || ''),
  typeof window === 'undefined' ? '' : window.location.origin,
))
const snippet = computed(() => homeCurlExample(apiBase.value))

watch(stageDisplayItems, (items) => {
  if (!items.some((item) => item.key === selectedKey.value)) {
    selectedKey.value = items[0]?.key ?? ''
  }
}, { immediate: true })

watch(showPlazaLink, (open) => {
  void loadCatalog(open)
}, { immediate: true })

if (typeof window.matchMedia === 'function') {
  const media = window.matchMedia('(hover: hover) and (pointer: fine)')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const syncTilt = () => {
    allowTilt.value = media.matches && !motion.matches
  }
  syncTilt()
  media.addEventListener?.('change', syncTilt)
  motion.addEventListener?.('change', syncTilt)
  onUnmounted(() => {
    media.removeEventListener?.('change', syncTilt)
    motion.removeEventListener?.('change', syncTilt)
  })
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function scrollToSection(id: string, event: MouseEvent) {
  const target = document.getElementById(id)
  if (!target) return
  event.preventDefault()
  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function unitSuffix(item: HomeCatalogItem): string {
  return item.kind === 'image' ? t('modelPlaza.table.perUnitImage') : t('modelPlaza.table.perUnitRequest')
}

async function loadCatalog(open: boolean) {
  loadController?.abort()
  loadController = null
  const generation = ++loadGeneration
  if (!open) {
    catalog.value = { stage: [], shelf: [] }
    catalogState.value = 'unavailable'
    return
  }
  catalogState.value = 'loading'
  const controller = new AbortController()
  loadController = controller
  try {
    const response = await getModelPlaza({ signal: controller.signal })
    if (generation !== loadGeneration) return
    const next = selectHomeCatalog(response)
    catalog.value = next
    catalogState.value = next.shelf.length ? 'ready' : 'unavailable'
  } catch {
    if (controller.signal.aborted || generation !== loadGeneration) return
    catalog.value = { stage: [], shelf: [] }
    catalogState.value = 'unavailable'
  }
}

async function copySnippet() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}

function tiltCard(event: PointerEvent) {
  if (!allowTilt.value) return
  const card = event.currentTarget
  if (!(card instanceof HTMLElement)) return
  const rect = card.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`
}

function resetTilt(event: PointerEvent) {
  const card = event.currentTarget
  if (card instanceof HTMLElement) card.style.transform = ''
}

onUnmounted(() => {
  loadController?.abort()
  window.clearTimeout(copyTimer)
})
</script>

<style scoped>
.home-storefront {
  min-height: 100vh;
  background: #f9fafb;
  color: #0f172a;
  font-family: 'Be Vietnam Pro', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif;
}

html.dark .home-storefront {
  background: #020617;
  color: #f8fafc;
}

.home-wrap {
  width: min(1120px, calc(100% - 32px));
  margin-inline: auto;
}

.home-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid #e5e7eb;
  background: rgb(249 250 251 / 90%);
  backdrop-filter: blur(12px);
}

html.dark .home-nav {
  border-bottom-color: #334155;
  background: rgb(2 6 23 / 90%);
}

.nav-row,
.footer-row,
.nav-tools,
.nav-links,
.hero-actions,
.footer-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
}

.nav-row {
  justify-content: space-between;
  min-height: 72px;
  padding: 12px 0;
}

.brand {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
  color: inherit;
  font-weight: 600;
  text-decoration: none;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: contain;
}

.brand-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-links a,
.footer-links a,
.text-link {
  color: #0d9488;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

html.dark .nav-links a,
html.dark .footer-links a,
html.dark .text-link {
  color: #2dd4bf;
}

.nav-links a:hover,
.footer-links a:hover,
.text-link:hover {
  color: #14b8a6;
}

html.dark .nav-links a:hover,
html.dark .footer-links a:hover,
html.dark .text-link:hover {
  color: #5eead4;
}

.icon-button,
.snippet button,
.button {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.icon-button {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: transparent;
  color: #334155;
}

html.dark .icon-button {
  color: #cbd5e1;
}

.button {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 16px;
  text-decoration: none;
}

.button-brand {
  background: #0d9488;
  color: #fff;
  box-shadow: 0 0 20px rgb(20 184 166 / 25%);
}

.button-brand:hover {
  background: #0f766e;
}

.button-quiet {
  background: transparent;
  color: #0f172a;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

html.dark .button-quiet {
  color: #f8fafc;
  box-shadow: inset 0 0 0 1px #1e293b;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  gap: 40px;
  align-items: center;
  padding: 64px 0 28px;
}

.hero h1,
.section h2 {
  margin: 0;
  letter-spacing: -0.03em;
}

.hero h1 {
  max-width: 22ch;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 0.98;
  font-weight: 600;
}

.lede,
.section-note,
.offer-card p,
.steps p,
.assurance-grid p,
.faq p {
  color: #475569;
  line-height: 1.6;
}

html.dark .lede,
html.dark .section-note,
html.dark .offer-card p,
html.dark .steps p,
html.dark .assurance-grid p,
html.dark .faq p {
  color: #cbd5e1;
}

.lede {
  max-width: 46ch;
  margin: 18px 0 0;
  font-size: 18px;
}

.hero-actions {
  margin-top: 28px;
}

.hero-stage {
  justify-self: end;
  width: min(100%, 520px);
}

.stage-hint {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 12px;
}

html.dark .stage-hint {
  color: #94a3b8;
}

.stage-caption {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 8px 0 0;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 12px;
}

.trust {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px auto 0;
  padding: 0;
  list-style: none;
}

.trust li {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 13px;
}

html.dark .trust li {
  border-color: #1e293b;
}

.section {
  padding-top: 72px;
}

.section h2 {
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.1;
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.offer-grid,
.assurance-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 22px;
}

.offer-card,
.assurance-grid article,
.faq details {
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #fff;
  padding: 20px;
}

.offer-card,
.assurance-grid article {
  flex: 1 1 240px;
  max-width: 360px;
}

html.dark .offer-card,
html.dark .assurance-grid article,
html.dark .faq details {
  border-color: #1e293b;
  background: #0f172a;
}

.offer-card {
  transform-style: preserve-3d;
  transition: transform 180ms ease;
}

.eyebrow {
  margin: 0 0 8px;
  color: #0d9488;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.offer-card h3,
.steps h3,
.assurance-grid h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.offer-card p,
.assurance-grid p {
  margin: 0 0 16px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.steps li {
  counter-increment: step;
}

.steps li::before {
  content: counter(step);
  display: block;
  margin-bottom: 10px;
  color: #0d9488;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 13px;
}

.snippet {
  margin-top: 22px;
  overflow: hidden;
  border-radius: 18px;
  background: #0f172a;
  color: #f8fafc;
}

.snippet-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  color: #cbd5e1;
  font-size: 13px;
}

.snippet button {
  border-radius: 999px;
  background: #0d9488;
  color: #fff;
  padding: 6px 12px;
}

.snippet pre {
  margin: 0;
  overflow-x: auto;
  padding: 0 16px 16px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.table-wrap {
  margin-top: 18px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #fff;
}

html.dark .table-wrap {
  border-color: #1e293b;
  background: #0f172a;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
}

thead th {
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
}

tbody tr + tr th,
tbody tr + tr td {
  border-top: 1px solid #f3f4f6;
}

html.dark tbody tr + tr th,
html.dark tbody tr + tr td {
  border-top-color: #334155;
}

.unit-note {
  margin: 0;
  padding: 0 14px 12px;
  color: #64748b;
  font-size: 12px;
}

.faq {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.faq summary {
  cursor: pointer;
  font-weight: 600;
}

.faq p {
  margin: 10px 0 0;
}

.home-footer {
  margin-top: 72px;
  border-top: 1px solid #e5e7eb;
  padding: 22px 0 32px;
}

html.dark .home-footer {
  border-top-color: #334155;
}

.footer-row {
  justify-content: space-between;
}

.footer-row p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.home-storefront :focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .hero,
  .steps {
    grid-template-columns: 1fr;
  }

  .offer-card,
  .assurance-grid article {
    max-width: none;
  }

  .hero {
    padding-top: 36px;
  }

  .hero-stage {
    justify-self: stretch;
  }

  .hero h1 {
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .offer-card {
    transition: none;
  }
}
</style>
