<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import CaseValueStrip from './CaseValueStrip.vue'
import DecisionAccordion from './DecisionAccordion.vue'
import { lowcodeCase } from '../workData.ts'
import {
  AGGREGATE_LABELS,
  COLOR_LABELS,
  DIMENSION_LABELS,
  REPEAT_STRATEGY_LABELS,
  SAMPLE_METRIC_RECORDS,
  WIDGET_PROTOCOL_SAMPLE,
  WORKFLOW_NODE_PRESETS,
  advancePollingTasks,
  buildStatsQuery,
  pivotChartData,
  resolveFieldPermissions,
  type AggregateMode,
  type ChartPanelConfig,
  type ChartType,
  type ColorDimensionKey,
  type DimensionKey,
  type FieldPermissionItem,
  type ImportTaskItem,
  type RepeatStrategy,
} from '../lowcodeEngine.ts'

const activeTab = ref<'chart' | 'permission' | 'crud'>('chart')

// --- 01 图表配置驱动 & 多维透视演练台 ---
const chartConfig = reactive<ChartPanelConfig>({
  chartType: 'bar',
  groupField: 'dept',
  colorField: 'channel',
  aggregate: 'sum',
  enableBucket: false,
  sort: 'desc',
})

const inspectorView = ref<'query' | 'matrix' | 'protocol'>('query')
const hiddenSeries = ref<string[]>([])
const hoveredInfo = ref('悬停或聚焦图表柱块，实时查看对应维度与多维透视数值。')

const SERIES_COLORS = ['#22d3a8', '#38e8ff', '#f5b942', '#8b5cf6']

const compiledQuery = computed(() => buildStatsQuery(chartConfig))
const pivotResult = computed(() => pivotChartData(SAMPLE_METRIC_RECORDS, chartConfig))

const visibleSeries = computed(() =>
  pivotResult.value.series
    .map((item, idx) => ({
      ...item,
      colorIndex: idx % SERIES_COLORS.length,
      color: SERIES_COLORS[idx % SERIES_COLORS.length],
    }))
    .filter((item) => !hiddenSeries.value.includes(item.name)),
)

function toggleSeries(name: string) {
  if (hiddenSeries.value.includes(name)) {
    hiddenSeries.value = hiddenSeries.value.filter((item) => item !== name)
  } else if (visibleSeries.value.length > 1) {
    hiddenSeries.value = [...hiddenSeries.value, name]
  }
}

function setChartType(type: ChartType) {
  chartConfig.chartType = type
  hiddenSeries.value = []
}

const barGeometry = computed(() => {
  const categories = pivotResult.value.categories
  const series = visibleSeries.value
  const totals = categories.map((_, idx) => series.reduce((acc, s) => acc + (s.data[idx] ?? 0), 0))
  const maxVal = Math.max(10, ...totals)
  const ceilMax = Math.ceil(maxVal / 20) * 20
  const chartLeft = 48
  const chartRight = 540
  const chartTop = 20
  const chartBottom = 212
  const plotW = chartRight - chartLeft
  const plotH = chartBottom - chartTop
  const step = categories.length ? plotW / categories.length : plotW
  const barW = Math.min(48, Math.max(22, step * 0.52))

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(ceilMax * ratio),
    y: chartBottom - plotH * ratio,
  }))

  const columns = categories.map((cat, cIdx) => {
    const x = chartLeft + cIdx * step + (step - barW) / 2
    let accVal = 0
    const segments = series.map((s) => {
      const val = s.data[cIdx] ?? 0
      const yBottom = chartBottom - (accVal / ceilMax) * plotH
      accVal += val
      const yTop = chartBottom - (accVal / ceilMax) * plotH
      return {
        seriesName: s.name,
        color: s.color,
        value: val,
        x,
        y: yTop,
        width: barW,
        height: Math.max(0, yBottom - yTop),
      }
    })
    return {
      category: cat,
      total: totals[cIdx] ?? 0,
      centerX: x + barW / 2,
      topY: chartBottom - ((totals[cIdx] ?? 0) / ceilMax) * plotH - 7,
      segments,
    }
  })
  return { ticks, columns, chartLeft, chartRight, chartBottom }
})

const funnelGeometry = computed(() => {
  const categories = pivotResult.value.categories
  const series = visibleSeries.value
  const rows = categories
    .map((cat, idx) => ({
      name: cat,
      value: series.reduce((acc, s) => acc + (s.data[idx] ?? 0), 0),
    }))
    .sort((a, b) => b.value - a.value)
  const maxVal = Math.max(1, rows[0]?.value ?? 1)
  const centerX = 280
  const maxWidth = 420
  const rowH = rows.length ? Math.min(42, 200 / rows.length) : 36
  return rows.map((row, idx) => {
    const topW = Math.max(90, (row.value / maxVal) * maxWidth)
    const nextVal = rows[idx + 1]?.value ?? row.value * 0.72
    const botW = Math.max(68, (nextVal / maxVal) * maxWidth)
    const y1 = 18 + idx * (rowH + 6)
    const y2 = y1 + rowH
    const points = `${centerX - topW / 2},${y1} ${centerX + topW / 2},${y1} ${centerX + botW / 2},${y2} ${centerX - botW / 2},${y2}`
    return {
      ...row,
      points,
      labelY: (y1 + y2) / 2 + 4,
      color: SERIES_COLORS[idx % SERIES_COLORS.length],
    }
  })
})

const radarGeometry = computed(() => {
  const categories = pivotResult.value.categories
  const series = visibleSeries.value
  const values = categories.map((_, idx) => series.reduce((acc, s) => acc + (s.data[idx] ?? 0), 0))
  const maxVal = Math.max(10, ...values)
  const cx = 280
  const cy = 126
  const rMax = 88
  const count = Math.max(3, categories.length)

  const pointAt = (index: number, radius: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius }
  }

  const rings = [0.33, 0.66, 1].map((ratio) =>
    Array.from({ length: count }, (_, idx) => {
      const pt = pointAt(idx, rMax * ratio)
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    }).join(' '),
  )

  const axes = categories.map((label, idx) => {
    const outer = pointAt(idx, rMax)
    const textPt = pointAt(idx, rMax + 18)
    const val = values[idx] ?? 0
    const dataPt = pointAt(idx, (val / maxVal) * rMax)
    return { label, val, outer, textPt, dataPt }
  })

  const polygonPoints = axes.map((a) => `${a.dataPt.x.toFixed(1)},${a.dataPt.y.toFixed(1)}`).join(' ')
  return { cx, cy, rings, axes, polygonPoints }
})

// --- 02 审批流字段级权限透传演练台 ---
const activeNodePreset = ref<'draft' | 'manager' | 'finance'>('manager')
const runtimeMode = ref<'preview' | 'design'>('preview')
const permItems = ref<FieldPermissionItem[]>(
  WORKFLOW_NODE_PRESETS.manager.fields.map((item) => ({ ...item })),
)

function applyNodePreset(key: 'draft' | 'manager' | 'finance') {
  activeNodePreset.value = key
  permItems.value = WORKFLOW_NODE_PRESETS[key].fields.map((item) => ({ ...item }))
}

const resolvedFields = computed(() => resolveFieldPermissions(permItems.value))
const visibleFields = computed(() => resolvedFields.value.filter((item) => item.visible))
const hiddenFields = computed(() => resolvedFields.value.filter((item) => !item.visible))

// --- 03 CRUD 通用导入导出与异步任务轮询演练台 ---
const selectedTemplate = ref<'customer' | 'asset'>('customer')
const repeatStrategy = ref<RepeatStrategy>(0)
const simulateErrorRow = ref(true)
const headerMapping = reactive<Record<string, string>>({
  excel_col_1: 'customer_name',
  excel_col_2: 'contact_code',
  excel_col_3: 'region_name',
})

const taskCounter = ref(2)
const tasks = ref<ImportTaskItem[]>([
  {
    id: 'TASK-001',
    taskType: 'export',
    templateName: '客户档案 · 选中 6 字段导出',
    strategyLabel: '关联字段输出显示文本',
    status: 2,
    percentage: 100,
    createdAt: '10:12:08',
    totalRows: 420,
    errors: [],
  },
])

const isPolling = ref(false)
const pollLogs = ref<string[]>(['轮询引擎空闲：当前无 status=1 的待处理任务。'])
const activeErrorTaskId = ref<string | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null
let tickCount = 0

const activeErrorTask = computed(() => tasks.value.find((t) => t.id === activeErrorTaskId.value) ?? null)

function stopPolling(reason: string) {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
  if (isPolling.value) {
    isPolling.value = false
    pollLogs.value = [reason, ...pollLogs.value].slice(0, 6)
  }
}

function startPolling() {
  if (isPolling.value) return
  isPolling.value = true
  pollLogs.value = ['startPolling() 启动：按 700ms 仅筛选待处理任务并发刷新。', ...pollLogs.value].slice(0, 6)
  pollTimer = setInterval(() => {
    tickCount += 1
    const result = advancePollingTasks(tasks.value)
    tasks.value = result.nextTasks
    pollLogs.value = [
      `第 ${tickCount} 次轮询：Promise.allSettled 并发查询 ${result.polledCount} 个待处理任务。`,
      ...pollLogs.value,
    ].slice(0, 6)
    if (!result.hasPending) {
      stopPolling('所有任务均已到达终态，stopPolling() 自动停止定时器。')
    }
  }, 700)
}

function submitMockTask(taskType: 'import' | 'export') {
  const id = `TASK-00${taskCounter.value++}`
  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  const templateLabel = selectedTemplate.value === 'customer' ? '客户档案模板' : '资产台账模板'
  const newTask: ImportTaskItem = {
    id,
    taskType,
    templateName: taskType === 'import' ? `${templateLabel} · 表头已映射` : `${templateLabel} · 字段筛选导出`,
    strategyLabel:
      taskType === 'import'
        ? REPEAT_STRATEGY_LABELS[repeatStrategy.value]
        : '自定义导出字段 + 关联文本',
    status: 1,
    percentage: 12,
    createdAt: timeStr,
    totalRows: taskType === 'import' ? 260 : 510,
    errors:
      taskType === 'import' && simulateErrorRow.value
        ? [
            { rowNum: 18, reason: '判重字段 contact_code 为空，触发导入前校验拦截' },
            { rowNum: 74, reason: '关联区域编码未匹配目标字典项' },
          ]
        : [],
  }
  tasks.value = [newTask, ...tasks.value].slice(0, 5)
  startPolling()
}

onBeforeUnmount(() => {
  stopPolling('组件卸载，beforeUnmount 清理定时器。')
})
</script>

<template>
  <section id="case-lowcode" class="case-section">
    <div class="container case-stack">
      <!-- Case Header -->
      <header class="case-header glass-panel">
        <div class="case-badges">
          <span class="badge badge-emerald">{{ lowcodeCase.number }} · {{ lowcodeCase.tier }}</span>
          <span class="mono case-period">{{ lowcodeCase.scopeLabel }}</span>
        </div>

        <h1 class="case-title">{{ lowcodeCase.title }}</h1>
        <p class="case-subtitle">{{ lowcodeCase.subtitle }}</p>

        <CaseValueStrip :trio="lowcodeCase.valueTrio" accent="emerald" />

        <div class="tag-row">
          <span v-for="tech in lowcodeCase.stack" :key="tech" class="tech-chip">{{ tech }}</span>
        </div>

        <div class="governance-strip">
          <div v-for="item in lowcodeCase.highlights" :key="item.value" class="gov-stat">
            <span class="mono gov-val">{{ item.value }}</span>
            <span class="gov-label">{{ item.label }}</span>
          </div>
        </div>
      </header>

      <!-- Architecture Layer Map -->
      <div id="lowcode-arch" class="glass-panel arch-panel">
        <div class="panel-top">
          <div>
            <span class="eyebrow">
              <span class="eyebrow-dot" />
              <span>ARCHITECTURE BOUNDARY &amp; OWNERSHIP MAP</span>
            </span>
            <h3 class="panel-heading">低代码引擎四层架构与个人改动落点</h3>
          </div>
          <div class="arch-legend">
            <span class="legend-item"><i class="dot dot-mine" />本人负责开发 / 重构</span>
            <span class="legend-item"><i class="dot dot-base" />团队既有基座与宿主边界</span>
          </div>
        </div>

        <div class="arch-layers" role="region" aria-label="低代码引擎四层架构图">
          <div class="arch-layer">
            <div class="layer-meta">
              <strong>宿主集成边界</strong>
              <span class="badge">宿主管理后台</span>
            </div>
            <div class="chip-wrap">
              <span class="arch-chip">组件库包导出设计器 / 渲染器 / CRUD</span>
              <span class="arch-chip">registerRequest 注入鉴权与请求层</span>
              <span class="arch-chip">customWidgets 注入业务扩展物料</span>
              <span class="arch-chip">流程引擎下发审批节点 taskForm 权限</span>
            </div>
          </div>

          <div class="arch-layer is-partial">
            <div class="layer-meta">
              <strong>① 设计态与物料协议</strong>
              <span class="badge badge-cyan">基座 + 物料扩展</span>
            </div>
            <div class="chip-wrap">
              <span class="arch-chip">画布拖拽 / 属性面板 / import.meta.glob 自动注册（既有基座）</span>
              <span class="arch-chip is-mine">★ 按 config / panel / runtime 新增配置物料（边距、圆角、主题、密码框）</span>
              <span class="arch-chip is-mine">★ 远程树形物料设计态请求隔离</span>
            </div>
          </div>

          <div class="arch-layer">
            <div class="layer-meta">
              <strong>② Schema 与编排层</strong>
              <span class="badge">团队既有基座</span>
            </div>
            <div class="chip-wrap">
              <span class="arch-chip">表单 / 布局 JSON Schema 协议</span>
              <span class="arch-chip">LogicFlow 动作流编排</span>
              <span class="arch-chip">规则编辑器与公式面板</span>
              <span class="arch-chip">数据源与全局变量中心</span>
            </div>
          </div>

          <div class="arch-layer is-partial">
            <div class="layer-meta">
              <strong>③ 运行态渲染引擎</strong>
              <span class="badge badge-cyan">基座 + 权限改造</span>
            </div>
            <div class="chip-wrap">
              <span class="arch-chip">GenerateForm 递归渲染器（既有基座）</span>
              <span class="arch-chip is-mine">★ 审批流节点字段权限透传（readable / writable 合流隐藏）</span>
            </div>
          </div>

          <div class="arch-layer is-owned">
            <div class="layer-meta">
              <strong>④ 图表与 CRUD 物料层</strong>
              <span class="badge badge-emerald">本人核心交付区</span>
            </div>
            <div class="chip-wrap">
              <span class="arch-chip is-mine">★ 图表统一数据源处理（分组 / 汇总 / 日期与数值分桶）</span>
              <span class="arch-chip is-mine">★ adaptChartData 适配与二维 Map O(n) 多维透视</span>
              <span class="arch-chip is-mine">★ CRUD 通用导入导出（模板、表头映射、3 种判重策略）</span>
              <span class="arch-chip is-mine">★ 异步任务并发进度轮询与终态自动停表</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Interactive Low-Code Sandbox -->
      <div id="lowcode-sandbox" class="glass-panel sandbox-shell">
        <div class="panel-top">
          <div>
            <span class="eyebrow">
              <span class="eyebrow-dot" />
              <span>INTERACTIVE LOW-CODE WORKBENCH · DESENSITIZED REPLAY</span>
            </span>
            <h3 class="panel-heading">核心机制交互沙盒 · 配置编译 / 字段权限 / 异步轮询</h3>
          </div>
          <div class="sandbox-tabs" role="tablist" aria-label="低代码机制演练台切换">
            <button
              type="button"
              role="tab"
              class="sandbox-tab"
              :class="{ 'is-active': activeTab === 'chart' }"
              :aria-selected="activeTab === 'chart'"
              @click="activeTab = 'chart'"
            >
              01 图表配置与透视
            </button>
            <button
              type="button"
              role="tab"
              class="sandbox-tab"
              :class="{ 'is-active': activeTab === 'permission' }"
              :aria-selected="activeTab === 'permission'"
              @click="activeTab = 'permission'"
            >
              02 审批字段权限
            </button>
            <button
              type="button"
              role="tab"
              class="sandbox-tab"
              :class="{ 'is-active': activeTab === 'crud' }"
              :aria-selected="activeTab === 'crud'"
              @click="activeTab = 'crud'"
            >
              03 CRUD 导入轮询
            </button>
          </div>
        </div>

        <!-- Tab 01: Chart Config -> Query DSL -> Pivot Render -->
        <div v-if="activeTab === 'chart'" class="sandbox-body" role="tabpanel" aria-label="图表配置驱动与多维透视">
          <div class="sandbox-status-bar">
            <span class="mono status-title">panel.vue 属性配置 → buildStatsQuery → pivotChartData (Map)</span>
            <div class="pill-group">
              <span class="badge badge-cyan">样本 {{ pivotResult.rowCount }} 条</span>
              <span class="badge badge-violet">复杂度 O(n)</span>
              <span class="badge" :class="compiledQuery.datasource.mode === 'bucket' ? 'badge-amber' : 'badge-emerald'">
                {{ compiledQuery.datasource.mode === 'bucket' ? '分桶模式 isBucket=true' : '标准聚合模式' }}
              </span>
              <span class="badge">补零 {{ pivotResult.zeroFilledCells }} 格</span>
            </div>
          </div>

          <div class="workbench-grid">
            <aside class="config-pane" aria-label="设计态属性配置面板">
              <p class="mono pane-label">DESIGNER PANEL · panel.vue</p>

              <div class="form-group">
                <span class="field-lbl">图表物料类型</span>
                <div class="seg-3">
                  <button type="button" :class="{ 'is-active': chartConfig.chartType === 'bar' }" @click="setChartType('bar')">柱状图</button>
                  <button type="button" :class="{ 'is-active': chartConfig.chartType === 'funnel' }" @click="setChartType('funnel')">漏斗图</button>
                  <button type="button" :class="{ 'is-active': chartConfig.chartType === 'radar' }" @click="setChartType('radar')">雷达图</button>
                </div>
              </div>

              <div class="form-group">
                <label for="neon-group-field" class="field-lbl">横轴维度 (group_fields)</label>
                <select
                  id="neon-group-field"
                  v-model="chartConfig.groupField"
                  class="neon-select"
                  :disabled="chartConfig.enableBucket"
                >
                  <option v-for="(label, key) in DIMENSION_LABELS" :key="key" :value="key as DimensionKey">{{ label }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="neon-color-field" class="field-lbl">颜色分组透视 (group_color_fields)</label>
                <select
                  id="neon-color-field"
                  v-model="chartConfig.colorField"
                  class="neon-select"
                  :disabled="chartConfig.chartType !== 'bar'"
                >
                  <option v-for="(label, key) in COLOR_LABELS" :key="key" :value="key as ColorDimensionKey">{{ label }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="neon-agg" class="field-lbl">汇总方式 (summary_fields)</label>
                <select id="neon-agg" v-model="chartConfig.aggregate" class="neon-select">
                  <option v-for="(label, key) in AGGREGATE_LABELS" :key="key" :value="key as AggregateMode">{{ label }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="neon-sort" class="field-lbl">排序规则 (order_fields)</label>
                <select id="neon-sort" v-model="chartConfig.sort" class="neon-select">
                  <option value="desc">按指标降序 (DESC)</option>
                  <option value="asc">按指标升序 (ASC)</option>
                  <option value="none">默认顺序（自动清理空数组）</option>
                </select>
              </div>

              <label class="neon-check">
                <input v-model="chartConfig.enableBucket" type="checkbox" />
                <span>开启数值分桶模式 (num_buckets)</span>
              </label>
            </aside>

            <div class="stage-pane">
              <div class="chart-stage">
                <div class="chart-stage-head">
                  <span class="mono pane-label">RUNTIME RENDER · adaptChartData</span>
                  <div class="legend-bar" aria-label="图例开关">
                    <button
                      v-for="(s, idx) in pivotResult.series"
                      :key="s.name"
                      type="button"
                      class="legend-chip"
                      :class="{ 'is-off': hiddenSeries.includes(s.name) }"
                      @click="toggleSeries(s.name)"
                    >
                      <span class="swatch" :class="`swatch-${idx % 4}`" />
                      <span>{{ s.name }}</span>
                    </button>
                  </div>
                </div>

                <svg
                  v-if="chartConfig.chartType === 'bar'"
                  class="chart-svg"
                  viewBox="0 0 560 246"
                  role="img"
                  aria-label="配置驱动多维透视堆叠柱状图"
                >
                  <g v-for="tick in barGeometry.ticks" :key="tick.value">
                    <line
                      class="grid-line"
                      :x1="barGeometry.chartLeft"
                      :x2="barGeometry.chartRight"
                      :y1="tick.y"
                      :y2="tick.y"
                    />
                    <text class="axis-lbl" x="40" :y="tick.y + 4" text-anchor="end">{{ tick.value }}</text>
                  </g>
                  <g v-for="col in barGeometry.columns" :key="col.category">
                    <rect
                      v-for="seg in col.segments"
                      :key="`${col.category}-${seg.seriesName}`"
                      class="bar-seg"
                      :x="seg.x"
                      :y="seg.y"
                      :width="seg.width"
                      :height="seg.height"
                      :fill="seg.color"
                      rx="3"
                      tabindex="0"
                      @mouseenter="hoveredInfo = `${col.category} · ${seg.seriesName}：${seg.value}（总计 ${col.total}）`"
                      @focus="hoveredInfo = `${col.category} · ${seg.seriesName}：${seg.value}（总计 ${col.total}）`"
                    />
                    <text class="val-lbl" :x="col.centerX" :y="col.topY" text-anchor="middle">{{ col.total }}</text>
                    <text class="axis-lbl" :x="col.centerX" :y="barGeometry.chartBottom + 18" text-anchor="middle">
                      {{ col.category }}
                    </text>
                  </g>
                </svg>

                <svg
                  v-else-if="chartConfig.chartType === 'funnel'"
                  class="chart-svg"
                  viewBox="0 0 560 246"
                  role="img"
                  aria-label="配置驱动统计漏斗图"
                >
                  <g v-for="row in funnelGeometry" :key="row.name">
                    <polygon
                      class="bar-seg"
                      :points="row.points"
                      :fill="row.color"
                      tabindex="0"
                      @mouseenter="hoveredInfo = `漏斗层级 ${row.name}：聚合值 ${row.value}`"
                      @focus="hoveredInfo = `漏斗层级 ${row.name}：聚合值 ${row.value}`"
                    />
                    <text x="280" :y="row.labelY" text-anchor="middle" fill="#040711" font-size="12" font-weight="700">
                      {{ row.name }} · {{ row.value }}
                    </text>
                  </g>
                </svg>

                <svg
                  v-else
                  class="chart-svg"
                  viewBox="0 0 560 246"
                  role="img"
                  aria-label="配置驱动多维雷达图"
                >
                  <polygon
                    v-for="(ring, idx) in radarGeometry.rings"
                    :key="idx"
                    :points="ring"
                    fill="none"
                    stroke="rgba(148,179,255,0.22)"
                    stroke-width="1"
                  />
                  <g v-for="axis in radarGeometry.axes" :key="axis.label">
                    <line
                      :x1="radarGeometry.cx"
                      :y1="radarGeometry.cy"
                      :x2="axis.outer.x"
                      :y2="axis.outer.y"
                      stroke="rgba(148,179,255,0.2)"
                      stroke-width="1"
                    />
                    <text class="axis-lbl" :x="axis.textPt.x" :y="axis.textPt.y + 4" text-anchor="middle">
                      {{ axis.label }}
                    </text>
                  </g>
                  <polygon
                    :points="radarGeometry.polygonPoints"
                    fill="rgba(56,232,255,0.2)"
                    stroke="#38e8ff"
                    stroke-width="2"
                  />
                  <circle
                    v-for="axis in radarGeometry.axes"
                    :key="`pt-${axis.label}`"
                    class="bar-seg"
                    :cx="axis.dataPt.x"
                    :cy="axis.dataPt.y"
                    r="5"
                    fill="#22d3a8"
                    tabindex="0"
                    @mouseenter="hoveredInfo = `雷达维度 ${axis.label}：聚合值 ${axis.val}`"
                    @focus="hoveredInfo = `雷达维度 ${axis.label}：聚合值 ${axis.val}`"
                  />
                </svg>

                <div class="hover-readout mono" role="status">{{ hoveredInfo }}</div>
              </div>

              <div class="inspector-box">
                <div class="inspector-bar">
                  <button type="button" :class="{ 'is-active': inspectorView === 'query' }" @click="inspectorView = 'query'">
                    编译后查询体 JSON
                  </button>
                  <button type="button" :class="{ 'is-active': inspectorView === 'matrix' }" @click="inspectorView = 'matrix'">
                    pivotData 透视矩阵
                  </button>
                  <button type="button" :class="{ 'is-active': inspectorView === 'protocol' }" @click="inspectorView = 'protocol'">
                    物料三件套协议
                  </button>
                </div>
                <pre v-if="inspectorView === 'query'" class="code-out">{{ JSON.stringify(compiledQuery, null, 2) }}</pre>
                <div v-else-if="inspectorView === 'matrix'" class="code-out">
                  <table class="dark-table">
                    <thead>
                      <tr>
                        <th>维度 (xVal)</th>
                        <th v-for="s in pivotResult.series" :key="s.name">{{ s.name }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(cat, cIdx) in pivotResult.categories" :key="cat">
                        <td>{{ cat }}</td>
                        <td
                          v-for="s in pivotResult.series"
                          :key="`${cat}-${s.name}`"
                          :class="{ 'is-zero': (s.data[cIdx] ?? 0) === 0 }"
                        >
                          {{ s.data[cIdx] ?? 0 }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <pre v-else class="code-out">{{ JSON.stringify(WIDGET_PROTOCOL_SAMPLE, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 02: Workflow Node Field Permission -->
        <div v-else-if="activeTab === 'permission'" class="sandbox-body" role="tabpanel" aria-label="渲染器审批字段级权限">
          <div class="sandbox-status-bar">
            <span class="mono status-title">GenerateForm → GenerateElementItem · taskForm 权限合流</span>
            <div class="pill-group">
              <span class="badge badge-cyan">baseVisible &amp;&amp; (readable || writable)</span>
              <span class="badge badge-emerald">可见 {{ visibleFields.length }} / 隐藏 {{ hiddenFields.length }}</span>
            </div>
          </div>

          <div class="preset-row">
            <button
              v-for="(preset, key) in WORKFLOW_NODE_PRESETS"
              :key="key"
              type="button"
              class="btn btn-sm"
              :class="activeNodePreset === key ? 'btn-primary' : 'btn-ghost'"
              @click="applyNodePreset(key as 'draft' | 'manager' | 'finance')"
            >
              {{ preset.name }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-portal"
              @click="runtimeMode = runtimeMode === 'preview' ? 'design' : 'preview'"
            >
              {{ runtimeMode === 'preview' ? '当前：运行/预览态（允许远程拉取）' : '当前：设计态（拦截脏请求）' }}
            </button>
          </div>
          <p class="preset-desc">{{ WORKFLOW_NODE_PRESETS[activeNodePreset].desc }}</p>

          <div class="perm-grid">
            <div class="chart-stage">
              <p class="mono pane-label">WORKFLOW NODE MATRIX · taskForm</p>
              <table class="dark-table">
                <thead>
                  <tr>
                    <th>业务字段</th>
                    <th>基础显隐</th>
                    <th>可读</th>
                    <th>可写</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in permItems" :key="item.field">
                    <td>{{ item.label }}</td>
                    <td><input v-model="item.baseVisible" type="checkbox" :aria-label="`${item.label}基础显隐`" /></td>
                    <td><input v-model="item.readable" type="checkbox" :aria-label="`${item.label}可读`" /></td>
                    <td><input v-model="item.writable" type="checkbox" :aria-label="`${item.label}可写`" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="config-pane">
              <p class="mono pane-label">RENDERER OUTPUT · GenerateElementItem</p>

              <div class="guard-box">
                <strong>设计态请求守卫：</strong>
                <span v-if="runtimeMode === 'design'">树形部门物料处于设计态，跳过远程数据源请求，仅保留占位结构。</span>
                <span v-else>运行态正常拉取远程树形数据源并渲染回显值。</span>
              </div>

              <div v-for="field in visibleFields" :key="field.field" class="preview-field">
                <div class="preview-head">
                  <label :for="`neon-prev-${field.field}`">{{ field.label }}</label>
                  <span class="badge" :class="field.disabled ? 'badge-violet' : 'badge-emerald'">{{ field.reason }}</span>
                </div>
                <input
                  :id="`neon-prev-${field.field}`"
                  class="neon-input"
                  :value="field.value"
                  :disabled="field.disabled"
                  readonly
                />
              </div>

              <div v-if="hiddenFields.length" class="hidden-strip">
                <span class="mono hidden-lbl">渲染器已跳过挂载：</span>
                <span v-for="item in hiddenFields" :key="item.field" class="badge badge-amber">
                  {{ item.label }}（{{ item.reason }}）
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 03: CRUD Import Mapping & Polling -->
        <div v-else class="sandbox-body" role="tabpanel" aria-label="CRUD 导入映射与任务轮询">
          <div class="sandbox-status-bar">
            <span class="mono status-title">CRUD 通用导入导出 · header_mapping &amp; 异步任务轮询</span>
            <div class="pill-group">
              <span class="badge" :class="isPolling ? 'badge-amber' : 'badge-emerald'">
                {{ isPolling ? '轮询运行中（700ms）' : '轮询已自动停止' }}
              </span>
              <span class="badge badge-cyan">任务队列 {{ tasks.length }} 条</span>
            </div>
          </div>

          <div class="crud-grid">
            <aside class="config-pane">
              <p class="mono pane-label">IMPORT CONFIG · header_mapping</p>
              <div class="form-group">
                <label for="neon-tpl" class="field-lbl">导入业务模板</label>
                <select id="neon-tpl" v-model="selectedTemplate" class="neon-select">
                  <option value="customer">客户档案标准模板</option>
                  <option value="asset">资产台账标准模板</option>
                </select>
              </div>

              <div class="form-group">
                <span class="field-lbl">Excel 表头 → 目标模型字段</span>
                <div class="map-row">
                  <span class="map-src">A列：名称</span>
                  <span class="mono">→</span>
                  <select v-model="headerMapping.excel_col_1" class="neon-select" aria-label="A列映射">
                    <option value="customer_name">customer_name</option>
                    <option value="asset_title">asset_title</option>
                  </select>
                </div>
                <div class="map-row">
                  <span class="map-src">B列：编码(判重)</span>
                  <span class="mono">→</span>
                  <select v-model="headerMapping.excel_col_2" class="neon-select" aria-label="B列映射">
                    <option value="contact_code">contact_code</option>
                    <option value="asset_sn">asset_sn</option>
                  </select>
                </div>
                <div class="map-row">
                  <span class="map-src">C列：所属区域</span>
                  <span class="mono">→</span>
                  <select v-model="headerMapping.excel_col_3" class="neon-select" aria-label="C列映射">
                    <option value="region_name">region_name</option>
                    <option value="dept_name">dept_name</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="neon-repeat" class="field-lbl">重复数据处理 (repeat_operation_type)</label>
                <select id="neon-repeat" v-model.number="repeatStrategy" class="neon-select">
                  <option :value="0">{{ REPEAT_STRATEGY_LABELS[0] }}</option>
                  <option :value="1">{{ REPEAT_STRATEGY_LABELS[1] }}</option>
                  <option :value="2">{{ REPEAT_STRATEGY_LABELS[2] }}</option>
                </select>
              </div>

              <label class="neon-check">
                <input v-model="simulateErrorRow" type="checkbox" />
                <span>模拟含 2 条脏数据行（触发失败行明细）</span>
              </label>

              <div class="preset-row">
                <button type="button" class="btn btn-primary btn-sm" @click="submitMockTask('import')">提交导入任务</button>
                <button type="button" class="btn btn-ghost btn-sm" @click="submitMockTask('export')">提交导出任务</button>
              </div>
            </aside>

            <div class="stage-pane">
              <div class="task-stack">
                <article v-for="task in tasks" :key="task.id" class="task-card">
                  <div class="task-head">
                    <strong class="mono">{{ task.id }} · {{ task.templateName }}</strong>
                    <span
                      class="badge"
                      :class="task.status === 1 ? 'badge-cyan' : task.status === 2 ? 'badge-emerald' : 'badge-amber'"
                    >
                      {{ task.status === 1 ? `处理中 ${task.percentage}%` : task.status === 2 ? '已完成 100%' : '部分失败 · 可看明细' }}
                    </span>
                  </div>
                  <p class="task-meta mono">{{ task.createdAt }} · {{ task.strategyLabel }} · 共 {{ task.totalRows }} 行</p>
                  <svg class="progress-svg" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
                    <rect x="0" y="0" width="100" height="6" rx="3" fill="rgba(148,179,255,0.16)" />
                    <rect
                      x="0"
                      y="0"
                      :width="task.percentage"
                      height="6"
                      rx="3"
                      :fill="task.status === 3 ? '#f5b942' : '#22d3a8'"
                    />
                  </svg>
                  <div v-if="task.status === 3" class="preset-row">
                    <button
                      type="button"
                      class="btn btn-ghost btn-sm"
                      @click="activeErrorTaskId = activeErrorTaskId === task.id ? null : task.id"
                    >
                      {{ activeErrorTaskId === task.id ? '收起失败行明细' : `查看 ${task.errors.length} 条失败行明细` }}
                    </button>
                  </div>
                  <div v-if="activeErrorTask && activeErrorTask.id === task.id" class="error-detail">
                    <div v-for="err in activeErrorTask.errors" :key="err.rowNum" class="mono">
                      第 {{ err.rowNum }} 行：{{ err.reason }}
                    </div>
                  </div>
                </article>
              </div>

              <div class="poll-console" role="status">
                <p class="mono pane-label">POLLING STATE MACHINE · Promise.allSettled</p>
                <ul class="poll-list mono">
                  <li v-for="(line, idx) in pollLogs" :key="`${idx}-${line}`">{{ line }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p class="provenance-note">{{ lowcodeCase.evidenceNote }}</p>
      </div>

      <!-- 4 Technical Decisions (Progressive Disclosure: 2 open by default) -->
      <DecisionAccordion
        :decisions="lowcodeCase.decisions"
        :default-open-count="2"
        accent="emerald"
        section-id="lowcode-decisions"
      />
    </div>
  </section>
</template>

<style scoped>
.case-section {
  padding-top: 16px;
  padding-bottom: clamp(24px, 3.2vw, 40px);
}

.case-stack {
  display: grid;
  gap: 20px;
}

.case-header,
.arch-panel,
.sandbox-shell {
  padding: clamp(20px, 2.8vw, 30px);
  display: grid;
  gap: 16px;
}

.case-header {
  border-color: rgba(56, 232, 255, 0.24);
  background:
    radial-gradient(60% 85% at 100% 0%, rgba(56, 232, 255, 0.09), transparent 68%),
    var(--bg-glass);
}

.case-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.case-period {
  font-size: 12px;
  color: var(--ink-muted);
}

.case-title {
  margin: 0;
  font-size: clamp(22px, 2.8vw, 32px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink-primary);
}

.case-subtitle {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink-secondary);
  max-width: 78ch;
}

.governance-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 4px;
}

.gov-stat {
  padding: 13px 15px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(56, 232, 255, 0.22);
  background: rgba(7, 13, 27, 0.78);
  display: grid;
  gap: 4px;
}

.gov-val {
  font-size: 15px;
  font-weight: 700;
  color: var(--cyan);
}

.gov-label {
  font-size: 12.5px;
  color: var(--ink-secondary);
}

.panel-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
}

.panel-heading {
  margin: 6px 0 0;
  font-size: clamp(18px, 2vw, 22px);
  color: var(--ink-primary);
}

.arch-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 12.5px;
  color: var(--ink-secondary);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 3px;
  display: inline-block;
}

.dot-mine {
  background: var(--cyan);
  box-shadow: 0 0 8px rgba(56, 232, 255, 0.65);
}

.dot-base {
  background: rgba(148, 179, 255, 0.35);
}

.arch-layers {
  display: grid;
  gap: 10px;
}

.arch-layer {
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(7, 13, 27, 0.72);
  display: grid;
  grid-template-columns: 195px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.arch-layer.is-partial {
  border-color: rgba(56, 232, 255, 0.3);
  background: rgba(9, 20, 40, 0.8);
}

.arch-layer.is-owned {
  border-color: rgba(34, 211, 168, 0.5);
  background: linear-gradient(120deg, rgba(10, 32, 44, 0.88), rgba(9, 21, 42, 0.88));
}

.layer-meta {
  display: grid;
  gap: 6px;
  justify-items: start;
}

.layer-meta strong {
  font-size: 14.5px;
  color: var(--ink-primary);
}

.chip-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.arch-chip {
  padding: 6px 10px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(148, 179, 255, 0.14);
  background: rgba(13, 22, 42, 0.72);
  font-size: 12.5px;
  color: var(--ink-secondary);
}

.arch-chip.is-mine {
  border-color: rgba(56, 232, 255, 0.42);
  background: rgba(56, 232, 255, 0.11);
  color: #e6fbff;
  font-weight: 600;
}

/* Sandbox Tabs */
.sandbox-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-subtle);
  background: rgba(5, 10, 22, 0.88);
}

.sandbox-tab {
  padding: 8px 13px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--ink-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.sandbox-tab:hover {
  color: var(--ink-primary);
}

.sandbox-tab.is-active {
  background: linear-gradient(135deg, rgba(56, 232, 255, 0.22), rgba(79, 124, 255, 0.28));
  color: #ffffff;
}

.sandbox-body {
  display: grid;
  gap: 14px;
}

.sandbox-status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line-subtle);
}

.status-title {
  font-size: 12.5px;
  color: var(--cyan);
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.workbench-grid {
  display: grid;
  grid-template-columns: minmax(0, 270px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.config-pane,
.chart-stage {
  padding: 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(6, 12, 26, 0.82);
  display: grid;
  gap: 12px;
}

.pane-label {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--cyan);
}

.form-group {
  display: grid;
  gap: 5px;
}

.field-lbl {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-primary);
}

.neon-select,
.neon-input {
  width: 100%;
  min-height: 36px;
  padding: 6px 10px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--line-strong);
  background: rgba(11, 19, 38, 0.95);
  color: var(--ink-primary);
  font-size: 13px;
}

.neon-select:disabled,
.neon-input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.seg-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
}

.seg-3 button {
  min-height: 34px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--line-strong);
  background: rgba(11, 19, 38, 0.85);
  color: var(--ink-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.seg-3 button.is-active {
  border-color: var(--cyan);
  background: rgba(56, 232, 255, 0.16);
  color: #ffffff;
}

.neon-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-primary);
  cursor: pointer;
}

.neon-check input {
  width: 15px;
  height: 15px;
  accent-color: var(--cyan);
}

.stage-pane {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.chart-stage-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.legend-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.legend-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 9px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--line-subtle);
  background: rgba(16, 27, 51, 0.8);
  color: var(--ink-primary);
  font-size: 12px;
  cursor: pointer;
}

.legend-chip.is-off {
  opacity: 0.4;
  text-decoration: line-through;
}

.swatch {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  display: inline-block;
}

.swatch-0 { background: #22d3a8; }
.swatch-1 { background: #38e8ff; }
.swatch-2 { background: #f5b942; }
.swatch-3 { background: #8b5cf6; }

.chart-svg {
  width: 100%;
  height: auto;
}

.grid-line {
  stroke: rgba(148, 179, 255, 0.14);
  stroke-width: 1;
}

.axis-lbl {
  fill: #98aecf;
  font-size: 11.5px;
}

.val-lbl {
  fill: #f0f5ff;
  font-size: 11px;
  font-weight: 700;
}

.bar-seg {
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.bar-seg:hover,
.bar-seg:focus-visible {
  opacity: 0.82;
}

.hover-readout {
  padding: 8px 11px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(56, 232, 255, 0.2);
  background: rgba(11, 22, 45, 0.82);
  font-size: 12px;
  color: #b9ecff;
}

.inspector-box {
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: #040814;
  overflow: hidden;
}

.inspector-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--line-subtle);
  background: rgba(11, 19, 38, 0.9);
}

.inspector-bar button {
  padding: 5px 10px;
  border: 0;
  border-radius: var(--radius-xs);
  background: transparent;
  color: var(--ink-muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.inspector-bar button.is-active {
  background: rgba(56, 232, 255, 0.18);
  color: #e6fbff;
}

.code-out {
  margin: 0;
  padding: 12px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.55;
  color: #cde3ff;
  overflow-x: auto;
  max-height: 230px;
}

.dark-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.dark-table th,
.dark-table td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(148, 179, 255, 0.12);
  text-align: left;
  font-variant-numeric: tabular-nums;
}

.dark-table th {
  color: var(--cyan);
  font-weight: 600;
}

.dark-table td.is-zero {
  color: var(--amber);
  font-weight: 700;
}

/* Permission & CRUD Tabs */
.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-desc {
  margin: 0;
  font-size: 13px;
  color: var(--ink-secondary);
}

.perm-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.guard-box {
  padding: 9px 11px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(34, 211, 168, 0.3);
  background: rgba(34, 211, 168, 0.08);
  font-size: 12.5px;
  color: #b7f7e6;
}

.preview-field {
  display: grid;
  gap: 5px;
}

.preview-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12.5px;
}

.hidden-strip {
  padding-top: 10px;
  border-top: 1px dashed var(--line-strong);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.hidden-lbl {
  font-size: 11.5px;
  color: var(--ink-muted);
}

.crud-grid {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.map-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr);
  gap: 6px;
  align-items: center;
  font-size: 12px;
}

.map-src {
  padding: 6px 8px;
  border-radius: var(--radius-xs);
  background: rgba(16, 27, 51, 0.85);
  color: var(--ink-secondary);
}

.task-stack {
  display: grid;
  gap: 10px;
}

.task-card {
  padding: 13px 15px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: rgba(6, 12, 26, 0.84);
  display: grid;
  gap: 8px;
}

.task-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.task-meta {
  margin: 0;
  font-size: 11.5px;
  color: var(--ink-muted);
}

.progress-svg {
  width: 100%;
  height: 8px;
}

.error-detail {
  padding: 9px 11px;
  border-radius: var(--radius-xs);
  border: 1px solid rgba(245, 185, 66, 0.35);
  background: rgba(245, 185, 66, 0.08);
  font-size: 12px;
  color: #fde19e;
  display: grid;
  gap: 4px;
}

.poll-console {
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-subtle);
  background: #040814;
  display: grid;
  gap: 6px;
}

.poll-list {
  margin: 0;
  padding-left: 16px;
  display: grid;
  gap: 4px;
  font-size: 11.5px;
  color: var(--ink-secondary);
}

.provenance-note {
  margin: 0;
  font-size: 12px;
  color: var(--ink-muted);
}

/* 4 Decisions Grid */
.decisions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.decision-card {
  padding: 20px 22px;
  display: grid;
  gap: 8px;
  align-content: start;
}

.decision-index {
  font-size: 11.5px;
  color: var(--cyan);
}

.decision-title {
  margin: 0;
  font-size: 16.5px;
  color: var(--ink-primary);
}

.decision-row,
.decision-outcome {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-secondary);
}

.decision-outcome {
  color: #a6f4e4;
}

@media (max-width: 960px) {
  .governance-strip,
  .arch-layer,
  .workbench-grid,
  .perm-grid,
  .crud-grid,
  .decisions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
