<script setup lang="ts">
import AppIcon from '../components/AppIcon.vue'
import LazyImg from '../components/LazyImg.vue'
import type { LightboxItem } from '../components/MediaLightbox.vue'
import { links } from '../data/links.ts'
import { gatewayProjects, type GatewayProject } from '../data/projects.ts'

const emit = defineEmits<{
  openMedia: [payload: { items: LightboxItem[]; startIndex: number; trigger: HTMLElement | null }]
}>()

function inspectProject(project: GatewayProject, event: MouseEvent, startIndex = 0) {
  const items: LightboxItem[] = [
    {
      kind: 'image',
      src: project.primaryImage,
      title: project.title,
      caption: project.keyProof,
      provenance: project.provenance,
      alt: project.primaryAlt,
    },
  ]
  if (project.appPreviews && project.appPreviews.length > 0) {
    for (const preview of project.appPreviews) {
      items.push({
        kind: 'image',
        src: preview.src,
        title: `${project.title} · App ${preview.label}`,
        caption: preview.alt,
        provenance: preview.provenance,
        alt: preview.alt,
      })
    }
  } else if (project.secondaryImage) {
    items.push({
      kind: 'image',
      src: project.secondaryImage,
      title: `${project.title} · 补充实拍视图`,
      caption: project.metricsOrDecision[0],
      provenance: project.provenance,
      alt: project.secondaryAlt || project.primaryAlt,
    })
  }
  emit('openMedia', {
    items,
    startIndex: startIndex >= 0 && startIndex < items.length ? startIndex : 0,
    trigger: event.currentTarget as HTMLElement | null,
  })
}

const courier = gatewayProjects[0]
const analytics = gatewayProjects[1]
const lowcode = gatewayProjects[2]
const liveshop = gatewayProjects[3]

function cardSrc(thumb: string | undefined, image: string | undefined) {
  return thumb || image || ''
}
</script>

<template>
  <section id="projects" class="section-block">
    <div class="container">
      <header class="section-header section-header-split" data-reveal>
        <div class="header-copy">
          <span class="eyebrow">
            <span class="eyebrow-dot" />
            <span>ENTERPRISE PROOF &amp; GATEWAY</span>
          </span>
          <h2 class="section-title">四大真实业务体系 · 结论先行，深度直达</h2>
          <p class="section-lead">
            主站仅提炼核心贡献与最硬证据，完整录屏、交互沙盒与技术决策收口于独立部署的
            <strong class="highlight-domain">work.weijianjun.me</strong>，点击任一案例即可首屏直达验证现场。
          </p>
        </div>
        <a :href="links.work" class="btn btn-portal">
          <span>打开项目体验索引台</span>
          <AppIcon name="arrow-up-right" :size="15" />
        </a>
      </header>

      <div class="gateway-grid">
        <!-- 01 Core Business: Courier (Full-width Feature) -->
        <article id="courier" class="glass-panel glass-panel-interactive feature-row feature-cyan" data-reveal>
          <div class="feature-copy">
            <div class="card-meta-row">
              <span class="badge badge-cyan">{{ courier.number }} · {{ courier.tier }}</span>
              <span class="mono card-period">{{ courier.company }} · {{ courier.period }}</span>
            </div>
            <h3 class="card-title">{{ courier.title }}</h3>
            <p class="card-summary">{{ courier.summary }}</p>

            <ul class="decision-list">
              <li v-for="point in courier.metricsOrDecision" :key="point">{{ point }}</li>
            </ul>

            <div class="tag-row">
              <span v-for="tech in courier.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>

            <div class="card-actions">
              <a :href="courier.workHref" class="btn btn-primary btn-sm">
                <span>{{ courier.ctaLabel }}</span>
                <AppIcon name="arrow-up-right" :size="14" />
              </a>
              <a
                v-for="sub in courier.subLinks"
                :key="sub.href"
                :href="sub.href"
                class="btn btn-link btn-sm"
              >
                <span>{{ sub.label }}</span>
                <AppIcon name="arrow-up-right" :size="13" />
              </a>
            </div>
          </div>

          <div class="courier-visuals">
            <div class="optical-frame courier-admin-frame">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">运营管理后台 · 订单检索 / 双 CSV 对账</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                aria-label="放大查看逍遥邮运营后台订单管理截图"
                @click="inspectProject(courier, $event, 0)"
              >
                <LazyImg
                  :src="cardSrc(courier.primaryThumb, courier.primaryImage)"
                  :alt="courier.primaryAlt"
                  :width="1320"
                  :height="820"
                />
                <span class="optical-zoom-hint">
                  <AppIcon name="expand" :size="12" />
                  <span>查看原图</span>
                </span>
              </button>
            </div>

            <div class="phone-bezel courier-mini-frame">
              <button
                type="button"
                class="phone-bezel-screen"
                aria-label="放大查看逍遥邮微信小程序先享后付成功截图"
                @click="inspectProject(courier, $event, 1)"
              >
                <LazyImg
                  :src="cardSrc(courier.secondaryThumb, courier.secondaryImage)"
                  :alt="courier.secondaryAlt || courier.primaryAlt"
                  :width="420"
                  :height="910"
                />
              </button>
            </div>

            <p class="visual-caption">{{ courier.keyProof }}</p>
          </div>
        </article>

        <!-- 02 Architecture Governance: EBI Analytics (Full-width Feature — Elevated to Core Tier!) -->
        <article id="analytics" class="glass-panel glass-panel-interactive feature-row feature-violet" data-reveal>
          <div class="feature-copy">
            <div class="card-meta-row">
              <span class="badge badge-violet">{{ analytics.number }} · {{ analytics.tier }}</span>
              <span class="mono card-period">{{ analytics.company }} · {{ analytics.period }}</span>
            </div>
            <h3 class="card-title">{{ analytics.title }}</h3>
            <p class="card-summary">{{ analytics.summary }}</p>

            <ul class="decision-list">
              <li v-for="point in analytics.metricsOrDecision" :key="point">{{ point }}</li>
            </ul>

            <div class="tag-row">
              <span v-for="tech in analytics.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>

            <div class="card-actions">
              <a :href="analytics.workHref" class="btn btn-primary btn-sm">
                <span>{{ analytics.ctaLabel }}</span>
                <AppIcon name="arrow-up-right" :size="14" />
              </a>
              <a
                v-for="sub in analytics.subLinks"
                :key="sub.href"
                :href="sub.href"
                class="btn btn-link btn-sm"
              >
                <span>{{ sub.label }}</span>
                <AppIcon name="arrow-right" :size="13" />
              </a>
            </div>
          </div>

          <div class="analytics-visuals">
            <div class="analytics-screens">
              <div class="optical-frame">
                <div class="optical-frame-bar">
                  <span class="optical-dots"><span /><span /><span /></span>
                  <span class="optical-bar-label">SDK 实时异常监控</span>
                </div>
                <button
                  type="button"
                  class="optical-media-btn"
                  aria-label="放大查看友谊时光 SDK 异常监控复现截图"
                  @click="inspectProject(analytics, $event, 0)"
                >
                  <LazyImg
                    :src="cardSrc(analytics.primaryThumb, analytics.primaryImage)"
                    :alt="analytics.primaryAlt"
                    :width="1320"
                    :height="920"
                  />
                  <span class="optical-zoom-hint">
                    <AppIcon name="expand" :size="12" />
                    <span>原图</span>
                  </span>
                </button>
              </div>
              <div class="optical-frame">
                <div class="optical-frame-bar">
                  <span class="optical-dots"><span /><span /><span /></span>
                  <span class="optical-bar-label">单用户 7 模块局部状态</span>
                </div>
                <button
                  type="button"
                  class="optical-media-btn"
                  aria-label="放大查看单用户行为查询 7 模块复现截图"
                  @click="inspectProject(analytics, $event, 1)"
                >
                  <LazyImg
                    :src="cardSrc(analytics.secondaryThumb, analytics.secondaryImage)"
                    :alt="analytics.secondaryAlt || analytics.primaryAlt"
                    :width="1320"
                    :height="880"
                  />
                  <span class="optical-zoom-hint">
                    <AppIcon name="expand" :size="12" />
                    <span>原图</span>
                  </span>
                </button>
              </div>
            </div>
            <p class="visual-caption">{{ analytics.keyProof }}</p>
          </div>
        </article>

        <!-- 03 Platform Engineering: Low-Code Engine (Balanced Span 6) -->
        <article id="lowcode" class="glass-panel glass-panel-interactive case-card case-half" data-reveal>
          <div class="card-meta-row">
            <span class="badge badge-emerald">{{ lowcode.number }} · {{ lowcode.tier }}</span>
            <span class="mono card-period">{{ lowcode.period }}</span>
          </div>
          <h3 class="card-title">{{ lowcode.title }}</h3>
          <p class="card-summary">{{ lowcode.summary }}</p>

          <div class="optical-frame half-visual-frame">
            <div class="optical-frame-bar">
              <span class="optical-dots"><span /><span /><span /></span>
              <span class="optical-bar-label">低代码交互沙盒 · 配置编译 / O(n) 透视 / 轮询</span>
            </div>
            <button
              type="button"
              class="optical-media-btn"
              aria-label="放大查看企业级低代码平台交互沙盒运行截图"
              @click="inspectProject(lowcode, $event, 0)"
            >
              <LazyImg
                :src="cardSrc(lowcode.primaryThumb, lowcode.primaryImage)"
                :alt="lowcode.primaryAlt"
                :width="1320"
                :height="920"
              />
              <span class="optical-zoom-hint">
                <AppIcon name="expand" :size="12" />
                <span>查看原图</span>
              </span>
            </button>
          </div>

          <ul class="decision-list">
            <li v-for="point in lowcode.metricsOrDecision" :key="point">{{ point }}</li>
          </ul>

          <div class="card-bottom">
            <div class="tag-row">
              <span v-for="tech in lowcode.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>
            <div class="card-actions">
              <a :href="lowcode.workHref" class="btn btn-portal btn-sm">
                <span>{{ lowcode.ctaLabel }}</span>
                <AppIcon name="arrow-up-right" :size="14" />
              </a>
              <a
                v-for="sub in lowcode.subLinks"
                :key="sub.href"
                :href="sub.href"
                class="btn btn-link btn-sm"
              >
                <span>{{ sub.label }}</span>
                <AppIcon name="arrow-up-right" :size="13" />
              </a>
            </div>
          </div>
        </article>

        <!-- 04 Cross-End Commerce: LiveShop (Balanced Span 6, compact dual visual — no extra 3-thumb strip) -->
        <article id="liveshop" class="glass-panel glass-panel-interactive case-card case-half" data-reveal>
          <div class="card-meta-row">
            <span class="badge badge-cyan">{{ liveshop.number }} · {{ liveshop.tier }}</span>
            <span class="mono card-period">{{ liveshop.period }}</span>
          </div>
          <h3 class="card-title">{{ liveshop.title }}</h3>
          <p class="card-summary">{{ liveshop.summary }}</p>

          <div class="liveshop-visuals">
            <div class="optical-frame half-visual-frame">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">运营后台 · 订单与 109 API 权限</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                aria-label="放大查看 LiveShop 管理后台商品订单截图"
                @click="inspectProject(liveshop, $event, 0)"
              >
                <LazyImg
                  :src="cardSrc(liveshop.primaryThumb, liveshop.primaryImage)"
                  :alt="liveshop.primaryAlt"
                  :width="1320"
                  :height="920"
                />
                <span class="optical-zoom-hint">
                  <AppIcon name="expand" :size="12" />
                  <span>后台</span>
                </span>
              </button>
            </div>

            <div class="phone-bezel liveshop-phone-frame">
              <button
                type="button"
                class="phone-bezel-screen"
                aria-label="放大查看 LiveShop App 7 屏界面预览"
                @click="inspectProject(liveshop, $event, 1)"
              >
                <LazyImg
                  :src="cardSrc(liveshop.secondaryThumb, liveshop.secondaryImage)"
                  :alt="liveshop.secondaryAlt || liveshop.primaryAlt"
                  :width="390"
                  :height="844"
                />
              </button>
            </div>
          </div>

          <ul class="decision-list">
            <li v-for="point in liveshop.metricsOrDecision" :key="point">{{ point }}</li>
          </ul>

          <div class="card-bottom">
            <div class="tag-row">
              <span v-for="tech in liveshop.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>
            <div class="card-actions">
              <a :href="liveshop.workHref" class="btn btn-portal btn-sm">
                <span>{{ liveshop.ctaLabel }}</span>
                <AppIcon name="arrow-up-right" :size="14" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.header-copy {
  display: grid;
  gap: 10px;
}

.highlight-domain {
  color: var(--cyan);
  font-family: var(--font-mono);
  font-weight: 600;
}

.gateway-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 20px;
}

.feature-row {
  grid-column: span 12;
  padding: clamp(20px, 2.6vw, 30px);
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 1.08fr);
  gap: clamp(22px, 3vw, 36px);
  align-items: center;
}

.feature-cyan {
  border-color: rgba(56, 232, 255, 0.24);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(56, 232, 255, 0.08), transparent 65%),
    var(--bg-glass);
}

.feature-violet {
  border-color: rgba(139, 92, 246, 0.3);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(139, 92, 246, 0.1), transparent 65%),
    var(--bg-glass);
}

.feature-copy {
  display: grid;
  gap: 13px;
}

.courier-visuals {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 132px;
  gap: 12px;
  align-items: end;
}

.courier-admin-frame img {
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top left;
}

.courier-mini-frame img {
  aspect-ratio: 9 / 19;
  object-fit: cover;
  object-position: top;
}

.analytics-visuals {
  display: grid;
  gap: 10px;
}

.analytics-screens {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.analytics-screens img {
  aspect-ratio: 16 / 11;
  object-fit: cover;
  object-position: top left;
}

.visual-caption {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 12px;
  color: var(--ink-muted);
}

.case-card {
  padding: clamp(20px, 2.4vw, 26px);
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.case-half {
  grid-column: span 6;
}

.card-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-period {
  font-size: 12px;
  color: var(--ink-muted);
}

.card-title {
  margin: 0;
  font-size: clamp(18.5px, 1.9vw, 22px);
  line-height: 1.28;
  font-weight: 700;
  color: var(--ink-primary);
}

.card-summary {
  margin: 0;
  font-size: 13.8px;
  color: var(--ink-secondary);
}

.half-visual-frame img {
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top left;
}

.liveshop-visuals {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 114px;
  gap: 10px;
  align-items: end;
}

.liveshop-phone-frame img {
  aspect-ratio: 9 / 19;
  object-fit: cover;
  object-position: top;
}

.decision-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 13.5px;
  color: #cad7ef;
}

.decision-list li::marker {
  color: var(--cyan);
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  padding-top: 2px;
}

.card-bottom {
  margin-top: auto;
  display: grid;
  gap: 12px;
  padding-top: 6px;
}

@media (max-width: 1024px) {
  .feature-row {
    grid-template-columns: 1fr;
  }

  .case-half {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .courier-visuals,
  .liveshop-visuals {
    grid-template-columns: minmax(0, 1fr) 92px;
    gap: 8px;
  }

  .analytics-screens {
    grid-template-columns: 1fr;
  }
}
</style>
