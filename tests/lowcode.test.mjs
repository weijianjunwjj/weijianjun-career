import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  SAMPLE_METRIC_RECORDS,
  WORKFLOW_NODE_PRESETS,
  advancePollingTasks,
  buildStatsQuery,
  pivotChartData,
  removeEmptyArrays,
  resolveFieldPermissions,
} from '../src/work/lowcodeEngine.ts'

test('removeEmptyArrays cleans empty arrays recursively', () => {
  const cleaned = removeEmptyArrays({
    group_fields: [{ name: 'dept' }],
    order_fields: [],
    nested: { keep: [1], drop: [] },
  })
  assert.deepEqual(cleaned, {
    group_fields: [{ name: 'dept' }],
    nested: { keep: [1] },
  })
})

test('buildStatsQuery compiles standard and bucket mode payloads', () => {
  const standard = buildStatsQuery({
    chartType: 'bar',
    groupField: 'dept',
    colorField: 'channel',
    aggregate: 'sum',
    enableBucket: false,
    sort: 'none',
  })
  assert.equal(standard.datasource.mode, 'standard')
  assert.deepEqual(standard.group_fields, [{ name: 'dept' }, { name: 'channel' }])
  assert.equal(standard.order_fields, undefined)

  const bucketed = buildStatsQuery({
    chartType: 'bar',
    groupField: 'dept',
    colorField: '',
    aggregate: 'count',
    enableBucket: true,
    sort: 'desc',
  })
  assert.equal(bucketed.datasource.mode, 'bucket')
  assert.deepEqual(bucketed.group_fields[0].num_buckets, ['0-49', '50-99', '100+'])
  assert.equal(bucketed.summary_fields[0].name, 'tickets')
  assert.equal(bucketed.order_fields?.[0].direction, 'desc')
})

test('pivotChartData aggregates stacked series in O(n) and zero-fills missing combinations', () => {
  const result = pivotChartData(SAMPLE_METRIC_RECORDS, {
    chartType: 'bar',
    groupField: 'dept',
    colorField: 'channel',
    aggregate: 'sum',
    enableBucket: false,
    sort: 'desc',
  })
  assert.equal(result.rowCount, SAMPLE_METRIC_RECORDS.length)
  assert.equal(result.series.length, 3)
  assert.ok(result.zeroFilledCells > 0)
  const totalSum = result.series.reduce((sum, s) => sum + s.data.reduce((a, b) => a + b, 0), 0)
  const expected = SAMPLE_METRIC_RECORDS.reduce((acc, r) => acc + r.amount, 0)
  assert.equal(totalSum, expected)
})

test('resolveFieldPermissions enforces baseVisible && (readable || writable)', () => {
  const resolved = resolveFieldPermissions(WORKFLOW_NODE_PRESETS.manager.fields)
  const hidden = resolved.find((f) => f.field === 'cost_center')
  assert.equal(hidden?.visible, false)
  assert.equal(hidden?.reason, '节点权限隐藏')

  const readonly = resolved.find((f) => f.field === 'budget_amount')
  assert.equal(readonly?.visible, true)
  assert.equal(readonly?.disabled, true)

  const editable = resolved.find((f) => f.field === 'approver_note')
  assert.equal(editable?.visible, true)
  assert.equal(editable?.disabled, false)
})

test('advancePollingTasks polls only pending items and auto-stops at terminal states', () => {
  const initial = [
    {
      id: 'T1',
      taskType: 'export',
      templateName: 'done',
      strategyLabel: '-',
      status: 2,
      percentage: 100,
      createdAt: '10:00:00',
      totalRows: 10,
      errors: [],
    },
    {
      id: 'T2',
      taskType: 'import',
      templateName: 'running',
      strategyLabel: '覆盖更新',
      status: 1,
      percentage: 50,
      createdAt: '10:01:00',
      totalRows: 20,
      errors: [{ rowNum: 5, reason: '字段为空' }],
    },
  ]
  const step1 = advancePollingTasks(initial)
  assert.equal(step1.polledCount, 1)
  assert.equal(step1.hasPending, true)
  const step2 = advancePollingTasks(step1.nextTasks)
  assert.equal(step2.polledCount, 1)
  assert.equal(step2.hasPending, false)
  assert.equal(step2.nextTasks[1].status, 3)
})

test('lowcode showcase files contain zero former-company identifiers', async () => {
  const files = [
    '../src/work/components/LowcodeCaseSection.vue',
    '../src/work/lowcodeEngine.ts',
    '../src/work/workData.ts',
    '../src/data/projects.ts',
  ]
  for (const rel of files) {
    const text = await readFile(new URL(rel, import.meta.url), 'utf8')
    assert.doesNotMatch(text, /速众|suconnect|su-ui|su-code-service|sudev\.|sutest\.|laamfun|wakary/i)
  }
})
