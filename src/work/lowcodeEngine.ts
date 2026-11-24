export type ChartType = 'bar' | 'funnel' | 'radar'
export type DimensionKey = 'dept' | 'region' | 'month'
export type ColorDimensionKey = '' | 'channel' | 'priority'
export type AggregateMode = 'sum' | 'count' | 'avg'
export type SortMode = 'none' | 'desc' | 'asc'

export interface RawMetricRecord {
  dept: string
  region: string
  month: string
  channel: string
  priority: string
  amount: number
  tickets: number
}

export interface ChartPanelConfig {
  chartType: ChartType
  groupField: DimensionKey
  colorField: ColorDimensionKey
  aggregate: AggregateMode
  enableBucket: boolean
  sort: SortMode
}

export interface StatsQueryPayload {
  datasource: {
    model: string
    mode: 'bucket' | 'standard'
  }
  group_fields: Array<{
    name: string
    num_buckets?: string[]
  }>
  summary_fields: Array<{
    name: string
    calculate_mode: AggregateMode
  }>
  order_fields?: Array<{
    name: string
    direction: 'asc' | 'desc'
    type: 'group' | 'summary'
  }>
}

export interface PivotSeries {
  name: string
  stack: string
  data: number[]
}

export interface PivotResult {
  categories: string[]
  series: PivotSeries[]
  zeroFilledCells: number
  rowCount: number
}

export interface FieldPermissionItem {
  field: string
  label: string
  type: 'text' | 'number' | 'select' | 'tree' | 'textarea'
  value: string
  baseVisible: boolean
  readable: boolean
  writable: boolean
}

export interface ResolvedFieldState {
  field: string
  label: string
  type: FieldPermissionItem['type']
  value: string
  visible: boolean
  disabled: boolean
  reason: '可编辑' | '节点只读' | '节点权限隐藏' | '基础条件隐藏'
}

export type RepeatStrategy = 0 | 1 | 2

export interface ImportTaskItem {
  id: string
  taskType: 'import' | 'export'
  templateName: string
  strategyLabel: string
  status: 1 | 2 | 3 // 1: 处理中, 2: 成功, 3: 部分失败
  percentage: number
  createdAt: string
  totalRows: number
  errors: Array<{ rowNum: number; reason: string }>
}

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  dept: '业务部门',
  region: '区域中心',
  month: '统计月份',
}

export const COLOR_LABELS: Record<ColorDimensionKey, string> = {
  '': '不拆分系列（单维聚合）',
  channel: '渠道来源（多维透视堆叠）',
  priority: '工单等级（多维透视堆叠）',
}

export const AGGREGATE_LABELS: Record<AggregateMode, string> = {
  sum: '金额求和 (SUM)',
  count: '记录计数 (COUNT)',
  avg: '单均金额 (AVG)',
}

export const SAMPLE_METRIC_RECORDS: RawMetricRecord[] = [
  { dept: '华东交付', region: '华东', month: '2025-01', channel: '自助表单', priority: '常规', amount: 42, tickets: 12 },
  { dept: '华东交付', region: '华东', month: '2025-01', channel: '流程审批', priority: '紧急', amount: 68, tickets: 9 },
  { dept: '华东交付', region: '华东', month: '2025-02', channel: '外部集成', priority: '常规', amount: 36, tickets: 7 },
  { dept: '华东交付', region: '华东', month: '2025-03', channel: '流程审批', priority: '高优', amount: 85, tickets: 11 },
  { dept: '华南运营', region: '华南', month: '2025-01', channel: '自助表单', priority: '常规', amount: 54, tickets: 15 },
  { dept: '华南运营', region: '华南', month: '2025-02', channel: '流程审批', priority: '高优', amount: 73, tickets: 10 },
  { dept: '华南运营', region: '华南', month: '2025-03', channel: '自助表单', priority: '紧急', amount: 112, tickets: 14 },
  { dept: '平台研发', region: '华东', month: '2025-01', channel: '外部集成', priority: '高优', amount: 96, tickets: 13 },
  { dept: '平台研发', region: '华东', month: '2025-02', channel: '外部集成', priority: '紧急', amount: 124, tickets: 16 },
  { dept: '平台研发', region: '华东', month: '2025-03', channel: '流程审批', priority: '常规', amount: 62, tickets: 8 },
  { dept: '客户成功', region: '华北', month: '2025-01', channel: '自助表单', priority: '常规', amount: 28, tickets: 9 },
  { dept: '客户成功', region: '华北', month: '2025-02', channel: '流程审批', priority: '常规', amount: 49, tickets: 11 },
  { dept: '客户成功', region: '华北', month: '2025-03', channel: '外部集成', priority: '高优', amount: 91, tickets: 10 },
  { dept: '供应链组', region: '西南', month: '2025-02', channel: '自助表单', priority: '高优', amount: 58, tickets: 8 },
  { dept: '供应链组', region: '西南', month: '2025-03', channel: '流程审批', priority: '紧急', amount: 105, tickets: 12 },
]

export function removeEmptyArrays<T>(input: T): T {
  if (input === null || typeof input !== 'object') return input
  if (Array.isArray(input)) {
    const cleaned = input
      .map((item) => removeEmptyArrays(item))
      .filter((item) => item !== undefined && !(Array.isArray(item) && item.length === 0))
    return cleaned as unknown as T
  }
  const output: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      const cleaned = removeEmptyArrays(value)
      if ((cleaned as unknown[]).length > 0) output[key] = cleaned
    } else if (value !== null && typeof value === 'object') {
      output[key] = removeEmptyArrays(value)
    } else {
      output[key] = value
    }
  }
  return output as T
}

export function resolveBucketLabel(amount: number): string {
  if (amount < 50) return '0-49 区间'
  if (amount < 100) return '50-99 区间'
  return '100+ 区间'
}

export function buildStatsQuery(config: ChartPanelConfig): StatsQueryPayload {
  const groupFields: StatsQueryPayload['group_fields'] = [
    {
      name: config.enableBucket ? 'amount_bucket' : config.groupField,
      ...(config.enableBucket ? { num_buckets: ['0-49', '50-99', '100+'] } : {}),
    },
  ]
  if (config.colorField && config.chartType === 'bar') {
    groupFields.push({ name: config.colorField })
  }
  const raw: StatsQueryPayload = {
    datasource: {
      model: 'mock_business_metrics',
      mode: config.enableBucket ? 'bucket' : 'standard',
    },
    group_fields: groupFields,
    summary_fields: [
      {
        name: config.aggregate === 'count' ? 'tickets' : 'amount',
        calculate_mode: config.aggregate,
      },
    ],
    order_fields:
      config.sort === 'none'
        ? []
        : [
            {
              name: config.aggregate === 'count' ? 'tickets' : 'amount',
              direction: config.sort,
              type: 'summary',
            },
          ],
  }
  return removeEmptyArrays(raw)
}

export function pivotChartData(
  records: RawMetricRecord[],
  config: ChartPanelConfig,
): PivotResult {
  const xValues: string[] = []
  const sValues: string[] = []
  const xSeen = new Set<string>()
  const sSeen = new Set<string>()

  const usePivot = Boolean(config.colorField) && config.chartType === 'bar'
  const singleSeriesName = AGGREGATE_LABELS[config.aggregate].split(' ')[0]

  const sumMap = new Map<string, Map<string, number>>()
  const countMap = new Map<string, Map<string, number>>()

  for (const row of records) {
    const xVal = config.enableBucket ? resolveBucketLabel(row.amount) : row[config.groupField]
    const sVal = usePivot && config.colorField ? row[config.colorField] : singleSeriesName

    if (!xSeen.has(xVal)) {
      xSeen.add(xVal)
      xValues.push(xVal)
      sumMap.set(xVal, new Map())
      countMap.set(xVal, new Map())
    }
    if (!sSeen.has(sVal)) {
      sSeen.add(sVal)
      sValues.push(sVal)
    }

    const metric = config.aggregate === 'count' ? row.tickets : row.amount
    const xSum = sumMap.get(xVal)!
    const xCnt = countMap.get(xVal)!
    xSum.set(sVal, (xSum.get(sVal) ?? 0) + metric)
    xCnt.set(sVal, (xCnt.get(sVal) ?? 0) + 1)
  }

  const orderedX = [...xValues]
  if (config.enableBucket) {
    const bucketOrder = ['0-49 区间', '50-99 区间', '100+ 区间']
    orderedX.sort((a, b) => bucketOrder.indexOf(a) - bucketOrder.indexOf(b))
  }
  if (config.sort !== 'none') {
    const totalOf = (xVal: string) => {
      let total = 0
      for (const sVal of sValues) {
        const sum = sumMap.get(xVal)?.get(sVal) ?? 0
        const cnt = countMap.get(xVal)?.get(sVal) ?? 0
        total += config.aggregate === 'avg' && cnt > 0 ? Math.round(sum / cnt) : sum
      }
      return total
    }
    orderedX.sort((a, b) => (config.sort === 'desc' ? totalOf(b) - totalOf(a) : totalOf(a) - totalOf(b)))
  }

  let zeroFilledCells = 0
  const series: PivotSeries[] = sValues.map((sVal) => {
    const data = orderedX.map((xVal) => {
      const sum = sumMap.get(xVal)?.get(sVal)
      const cnt = countMap.get(xVal)?.get(sVal) ?? 0
      if (sum === undefined) {
        zeroFilledCells += 1
        return 0
      }
      return config.aggregate === 'avg' && cnt > 0 ? Math.round(sum / cnt) : sum
    })
    return {
      name: sVal,
      stack: usePivot ? 'total' : 'single',
      data,
    }
  })

  return {
    categories: orderedX,
    series,
    zeroFilledCells,
    rowCount: records.length,
  }
}

export function resolveFieldPermissions(items: FieldPermissionItem[]): ResolvedFieldState[] {
  return items.map((item) => {
    const permVisible = item.readable || item.writable
    const visible = item.baseVisible && permVisible
    const disabled = !item.writable
    let reason: ResolvedFieldState['reason'] = '可编辑'
    if (!item.baseVisible) reason = '基础条件隐藏'
    else if (!permVisible) reason = '节点权限隐藏'
    else if (disabled) reason = '节点只读'
    return {
      field: item.field,
      label: item.label,
      type: item.type,
      value: item.value,
      visible,
      disabled,
      reason,
    }
  })
}

export const WORKFLOW_NODE_PRESETS: Record<
  'draft' | 'manager' | 'finance',
  { name: string; desc: string; fields: FieldPermissionItem[] }
> = {
  draft: {
    name: '发起人草稿',
    desc: '所有业务字段可读写；提交前可编辑成本中心与敏感备注。',
    fields: [
      { field: 'apply_title', label: '申请标题', type: 'text', value: 'Q2 华东云资源扩容采购', baseVisible: true, readable: true, writable: true },
      { field: 'dept_tree', label: '所属部门（远程树形物料）', type: 'tree', value: '平台研发 / 基础架构组', baseVisible: true, readable: true, writable: true },
      { field: 'budget_amount', label: '申请预算（万元）', type: 'number', value: '18.5', baseVisible: true, readable: true, writable: true },
      { field: 'cost_center', label: '内部成本核算系数', type: 'text', value: 'CC-2025-08', baseVisible: true, readable: true, writable: true },
      { field: 'approver_note', label: '审批节点批注', type: 'textarea', value: '待提交后由审批人补充', baseVisible: true, readable: true, writable: true },
    ],
  },
  manager: {
    name: '部门主管初审',
    desc: '基础单据字段只读锁定；内部成本系数节点隐藏（readable/writable 同为 false）；开放审批批注填写。',
    fields: [
      { field: 'apply_title', label: '申请标题', type: 'text', value: 'Q2 华东云资源扩容采购', baseVisible: true, readable: true, writable: false },
      { field: 'dept_tree', label: '所属部门（远程树形物料）', type: 'tree', value: '平台研发 / 基础架构组', baseVisible: true, readable: true, writable: false },
      { field: 'budget_amount', label: '申请预算（万元）', type: 'number', value: '18.5', baseVisible: true, readable: true, writable: false },
      { field: 'cost_center', label: '内部成本核算系数', type: 'text', value: 'CC-2025-08', baseVisible: true, readable: false, writable: false },
      { field: 'approver_note', label: '审批节点批注', type: 'textarea', value: '符合季度容量规划，建议通过', baseVisible: true, readable: true, writable: true },
    ],
  },
  finance: {
    name: '财务复核归档',
    desc: '成本核算系数恢复只读核验；批注字段锁定；验证渲染器显隐与只读合流。',
    fields: [
      { field: 'apply_title', label: '申请标题', type: 'text', value: 'Q2 华东云资源扩容采购', baseVisible: true, readable: true, writable: false },
      { field: 'dept_tree', label: '所属部门（远程树形物料）', type: 'tree', value: '平台研发 / 基础架构组', baseVisible: true, readable: true, writable: false },
      { field: 'budget_amount', label: '申请预算（万元）', type: 'number', value: '18.5', baseVisible: true, readable: true, writable: false },
      { field: 'cost_center', label: '内部成本核算系数', type: 'text', value: 'CC-2025-08', baseVisible: true, readable: true, writable: false },
      { field: 'approver_note', label: '审批节点批注', type: 'textarea', value: '财务复核无误，等待归档', baseVisible: true, readable: true, writable: false },
    ],
  },
}

export function advancePollingTasks(tasks: ImportTaskItem[]): {
  nextTasks: ImportTaskItem[]
  polledCount: number
  hasPending: boolean
} {
  let polledCount = 0
  const nextTasks = tasks.map((task) => {
    if (task.status !== 1) return task
    polledCount += 1
    const step = task.taskType === 'export' ? 35 : 28
    const nextPct = Math.min(100, task.percentage + step)
    if (nextPct >= 100) {
      const simulatePartialError = task.taskType === 'import' && task.errors.length > 0
      return {
        ...task,
        percentage: 100,
        status: simulatePartialError ? (3 as const) : (2 as const),
      }
    }
    return { ...task, percentage: nextPct }
  })
  const hasPending = nextTasks.some((t) => t.status === 1)
  return { nextTasks, polledCount, hasPending }
}

export const REPEAT_STRATEGY_LABELS: Record<RepeatStrategy, string> = {
  0: '0 · 覆盖更新已有记录',
  1: '1 · 跳过重复记录',
  2: '2 · 仅更新已有旧记录',
}

export const WIDGET_PROTOCOL_SAMPLE = {
  el: 'lc-chart-bar',
  group: 'chart',
  enableScopes: ['page', 'dashboard'],
  files: ['index.js (元数据 config)', 'panel.vue (设计态属性面板)', 'index.vue (运行态渲染组件)'],
  options: {
    customProps: {
      dataSource: { source: 'mock_business_metrics', rules: [] },
      group_fields: [{ name: 'dept' }],
      group_color_fields: [{ name: 'channel' }],
      summary_fields: [{ name: 'amount', calculate_mode: 'sum' }],
    },
  },
}
