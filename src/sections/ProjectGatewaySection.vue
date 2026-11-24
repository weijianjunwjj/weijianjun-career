<script setup lang="ts">
import AppIcon from '../components/AppIcon.vue'
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
const lowcode = gatewayProjects[1]
const analytics = gatewayProjects[2]
const liveshop = gatewayProjects[3]
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
          <h2 class="section-title">真实企业项目证据 · 直达体验中心</h2>
          <p class="section-lead">
            不靠概念卡片堆砌：以下四个真实业务体系均保留脱敏界面、录屏、交互式沙盒或接口覆测证据。主站呈现决策精华，点击任意入口即可进入独立部署的
            <strong class="highlight-domain">work.weijianjun.me</strong> 深度查验。
          </p>
        </div>
        <a :href="links.work" class="btn btn-portal">
          <span>打开完整体验中心</span>
          <AppIcon name="arrow-up-right" :size="15" />
        </a>
      </header>

      <!-- Asymmetric Architectural Bento Grid -->
      <div class="gateway-grid">
        <!-- 01 Core Project: Courier (Full-width Asymmetric Feature) -->
        <article class="glass-panel glass-panel-interactive courier-feature" data-reveal>
          <div class="courier-content">
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
                <span>进入中邮通双端体验</span>
                <AppIcon name="arrow-up-right" :size="14" />
              </a>
              <a
                v-for="sub in courier.subLinks"
                :key="sub.href"
                :href="sub.href"
                class="btn btn-ghost btn-sm"
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
                <span class="optical-bar-label">运营管理后台 · 订单检索 / 账单对账</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                aria-label="放大查看逍遥邮运营后台订单管理截图"
                @click="inspectProject(courier, $event, 0)"
              >
                <img
                  :src="courier.primaryImage"
                  :alt="courier.primaryAlt"
                  loading="lazy"
                  width="1320"
                  height="820"
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
                <img
                  :src="courier.secondaryImage"
                  :alt="courier.secondaryAlt"
                  loading="lazy"
                  width="420"
                  height="910"
                />
              </button>
            </div>

            <p class="visual-caption">{{ courier.keyProof }}</p>
          </div>
        </article>

        <!-- 02 Platform Engineering: Low-Code Engine (Full-width Asymmetric Feature) -->
        <article id="lowcode" class="glass-panel glass-panel-interactive lowcode-feature" data-reveal>
          <div class="courier-content">
            <div class="card-meta-row">
              <span class="badge badge-emerald">{{ lowcode.number }} · {{ lowcode.tier }}</span>
              <span class="mono card-period">{{ lowcode.company }} · {{ lowcode.period }}</span>
            </div>
            <h3 class="card-title">{{ lowcode.title }}</h3>
            <p class="card-summary">{{ lowcode.summary }}</p>

            <ul class="decision-list">
              <li v-for="point in lowcode.metricsOrDecision" :key="point">{{ point }}</li>
            </ul>

            <div class="tag-row">
              <span v-for="tech in lowcode.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>

            <div class="card-actions">
              <a :href="lowcode.workHref" class="btn btn-primary btn-sm">
                <span>进入低代码交互沙盒</span>
                <AppIcon name="arrow-up-right" :size="14" />
              </a>
              <a
                v-for="sub in lowcode.subLinks"
                :key="sub.href"
                :href="sub.href"
                class="btn btn-ghost btn-sm"
              >
                <span>{{ sub.label }}</span>
                <AppIcon name="arrow-up-right" :size="13" />
              </a>
            </div>
          </div>

          <div class="lowcode-visual">
            <div class="optical-frame lowcode-frame">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">低代码引擎交互沙盒 · 配置编译 / O(n) 透视 / 异步轮询</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                aria-label="放大查看企业级低代码平台交互沙盒运行截图"
                @click="inspectProject(lowcode, $event, 0)"
              >
                <img
                  :src="lowcode.primaryImage"
                  :alt="lowcode.primaryAlt"
                  loading="lazy"
                  width="1320"
                  height="920"
                />
                <span class="optical-zoom-hint">
                  <AppIcon name="expand" :size="12" />
                  <span>查看原图</span>
                </span>
              </button>
            </div>
            <p class="visual-caption">{{ lowcode.keyProof }}</p>
          </div>
        </article>

        <!-- 03 Real Enterprise Case: Analytics (Span 7) -->
        <article id="analytics" class="glass-panel glass-panel-interactive case-card case-wide" data-reveal>
          <div class="card-meta-row">
            <span class="badge badge-violet">{{ analytics.number }} · {{ analytics.tier }}</span>
            <span class="mono card-period">{{ analytics.company }} · {{ analytics.period }}</span>
          </div>
          <h3 class="card-title">{{ analytics.title }}</h3>
          <p class="card-summary">{{ analytics.summary }}</p>

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
                <img
                  :src="analytics.primaryImage"
                  :alt="analytics.primaryAlt"
                  loading="lazy"
                  width="1320"
                  height="920"
                />
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
                <img
                  :src="analytics.secondaryImage"
                  :alt="analytics.secondaryAlt"
                  loading="lazy"
                  width="1320"
                  height="880"
                />
              </button>
            </div>
          </div>

          <ul class="decision-list">
            <li v-for="point in analytics.metricsOrDecision" :key="point">{{ point }}</li>
          </ul>

          <div class="card-bottom">
            <div class="tag-row">
              <span v-for="tech in analytics.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>
            <a :href="analytics.workHref" class="btn btn-portal btn-sm">
              <span>查看 EBI 与构建治理详情</span>
              <AppIcon name="arrow-up-right" :size="14" />
            </a>
          </div>
        </article>

        <!-- 03 Supplemental Case: LiveShop (Span 5) -->
        <article class="glass-panel glass-panel-interactive case-card case-narrow" data-reveal>
          <div class="card-meta-row">
            <span class="badge badge-emerald">{{ liveshop.number }} · {{ liveshop.tier }}</span>
            <span class="mono card-period">{{ liveshop.period }}</span>
          </div>
          <h3 class="card-title">{{ liveshop.title }}</h3>
          <p class="card-summary">{{ liveshop.summary }}</p>

          <div class="liveshop-visuals">
            <div class="optical-frame liveshop-frame">
              <div class="optical-frame-bar">
                <span class="optical-dots"><span /><span /><span /></span>
                <span class="optical-bar-label">运营后台 · 订单与权限</span>
              </div>
              <button
                type="button"
                class="optical-media-btn"
                aria-label="放大查看 LiveShop 管理后台商品订单截图"
                @click="inspectProject(liveshop, $event, 0)"
              >
                <img
                  :src="liveshop.primaryImage"
                  :alt="liveshop.primaryAlt"
                  loading="lazy"
                  width="1320"
                  height="920"
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
                aria-label="放大查看 LiveShop App 首页发现流截图"
                @click="inspectProject(liveshop, $event, 1)"
              >
                <img
                  :src="liveshop.secondaryImage"
                  :alt="liveshop.secondaryAlt"
                  loading="lazy"
                  width="390"
                  height="844"
                />
              </button>
            </div>
          </div>

          <div v-if="liveshop.appPreviews && liveshop.appPreviews.length > 1" class="liveshop-app-strip">
            <button
              v-for="(shot, idx) in liveshop.appPreviews.slice(1)"
              :key="shot.label"
              type="button"
              class="liveshop-mini-thumb"
              :aria-label="`放大查看 LiveShop App ${shot.label} 截图`"
              @click="inspectProject(liveshop, $event, idx + 2)"
            >
              <img :src="shot.src" :alt="shot.alt" loading="lazy" width="180" height="390" />
              <span class="liveshop-mini-label">{{ shot.label }}</span>
            </button>
          </div>

          <ul class="decision-list">
            <li v-for="point in liveshop.metricsOrDecision" :key="point">{{ point }}</li>
          </ul>

          <div class="card-bottom">
            <div class="tag-row">
              <span v-for="tech in liveshop.stack" :key="tech" class="tech-chip">{{ tech }}</span>
            </div>
            <a :href="liveshop.workHref" class="btn btn-portal btn-sm">
              <span>查看 LiveShop 7 屏 App 与后台证据</span>
              <AppIcon name="arrow-up-right" :size="14" />
            </a>
          </div>
        </article>
      </div>

      <!-- Full-Width Experience Center Portal Strip -->
      <div class="portal-banner" data-reveal>
        <div class="portal-banner-copy">
          <span class="eyebrow">WORK.WEIJIANJUN.ME · INDEPENDENT WORKBENCH</span>
          <h3 class="portal-banner-title">想直接验看真机支付分录屏、小程序码、异步状态机与完整技术复盘？</h3>
          <p class="portal-banner-desc">
            工程项目体验中心独立部署，收录中邮通双端录屏与 9 张脱敏真机/后台实拍、企业级低代码引擎四层架构与三组交互沙盒、友谊时光 EBI/CRM 3 组功能复现与 LiveShop 7 屏 uni-app H5 演示及 109 路径联调证据。
          </p>
        </div>
        <a :href="links.work" class="btn btn-primary portal-banner-btn">
          <span>进入工程项目体验中心</span>
          <AppIcon name="arrow-up-right" :size="16" />
        </a>
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

.courier-feature,
.lowcode-feature {
  grid-column: span 12;
  padding: clamp(20px, 2.8vw, 32px);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.05fr);
  gap: clamp(22px, 3vw, 36px);
  align-items: center;
  border-color: rgba(56, 232, 255, 0.24);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(56, 232, 255, 0.08), transparent 65%),
    var(--bg-glass);
}

.lowcode-feature {
  border-color: rgba(34, 211, 168, 0.28);
  background:
    radial-gradient(60% 90% at 100% 0%, rgba(34, 211, 168, 0.09), transparent 65%),
    var(--bg-glass);
}

.lowcode-visual {
  display: grid;
  gap: 10px;
}

.lowcode-frame img {
  aspect-ratio: 1320 / 920;
  object-fit: cover;
  object-position: top left;
}

.courier-content {
  display: grid;
  gap: 14px;
}

.courier-visuals {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 136px;
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

.visual-caption {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 12px;
  color: var(--ink-muted);
}

.case-card {
  padding: clamp(20px, 2.4vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.case-wide {
  grid-column: span 7;
}

.case-narrow {
  grid-column: span 5;
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
  font-size: clamp(19px, 2vw, 23px);
  line-height: 1.28;
  font-weight: 700;
  color: var(--ink-primary);
}

.card-summary {
  margin: 0;
  font-size: 14px;
  color: var(--ink-secondary);
}

.analytics-screens {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.analytics-screens img,
.liveshop-frame img {
  aspect-ratio: 16 / 10.5;
  object-fit: cover;
  object-position: top left;
}

.liveshop-visuals {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  gap: 10px;
  align-items: end;
}

.liveshop-phone-frame img {
  aspect-ratio: 9 / 19;
  object-fit: cover;
  object-position: top;
}

.liveshop-app-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.liveshop-mini-thumb {
  position: relative;
  padding: 0;
  border: 1px solid rgba(56, 232, 255, 0.22);
  border-radius: var(--radius-sm);
  background: rgba(6, 11, 24, 0.85);
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.2s var(--ease-out),
    transform 0.2s var(--ease-out);
}

.liveshop-mini-thumb:hover {
  border-color: var(--cyan);
  transform: translateY(-2px);
}

.liveshop-mini-thumb img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  object-position: top center;
}

.liveshop-mini-label {
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 6px;
  padding: 3px 6px;
  border-radius: 5px;
  background: rgba(4, 7, 17, 0.84);
  border: 1px solid rgba(148, 179, 255, 0.22);
  color: #e6f0ff;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.decision-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 7px;
  font-size: 13.5px;
  color: #cad7ef;
}

.decision-list li::marker {
  color: var(--cyan);
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

.card-bottom {
  margin-top: auto;
  display: grid;
  gap: 14px;
  padding-top: 8px;
}

.portal-banner {
  margin-top: 22px;
  padding: clamp(22px, 3vw, 30px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(56, 232, 255, 0.34);
  background: linear-gradient(
    115deg,
    rgba(13, 25, 52, 0.92) 0%,
    rgba(16, 36, 70, 0.86) 55%,
    rgba(36, 24, 72, 0.82) 100%
  );
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 24px 56px -28px rgba(56, 232, 255, 0.35);
}

.portal-banner-copy {
  display: grid;
  gap: 6px;
  max-width: 68ch;
}

.portal-banner-title {
  margin: 0;
  font-size: clamp(18px, 2vw, 22px);
  color: #ffffff;
}

.portal-banner-desc {
  margin: 0;
  font-size: 13.5px;
  color: #bdd0ef;
}

.portal-banner-btn {
  padding: 13px 24px;
}

@media (max-width: 1024px) {
  .courier-feature,
  .lowcode-feature {
    grid-template-columns: 1fr;
  }

  .case-wide,
  .case-narrow {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .courier-visuals,
  .liveshop-visuals {
    grid-template-columns: minmax(0, 1fr) 94px;
    gap: 8px;
  }

  .analytics-screens {
    grid-template-columns: 1fr;
  }

  .portal-banner-btn {
    width: 100%;
  }
}
</style>
