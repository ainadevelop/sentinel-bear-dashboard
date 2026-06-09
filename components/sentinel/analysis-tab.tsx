'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  dataFields,
  hourlyData,
  monthlyTrend,
  stationDetectionCounts,
} from '@/lib/data'
import { SectionLabel } from './primitives'

const tooltipStyle = {
  background: '#1e1408',
  border: '1px solid rgba(200,120,10,0.3)',
  borderRadius: 4,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: '#f0e8d8',
}

function Metric({
  label,
  value,
  unit,
  pending,
}: {
  label: string
  value: string
  unit?: string
  pending?: boolean
}) {
  return (
    <div className="rounded-md bg-card p-4">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="num-display text-4xl tabular"
          style={{ color: pending ? 'var(--muted-foreground)' : 'var(--amber-light)' }}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono text-xs text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

const statusBadge: Record<string, string> = {
  active: 'bg-green/15 text-green',
  pending: 'bg-white/5 text-muted-foreground',
  important: 'bg-alert/15 text-alert',
  future: 'bg-amber/15 text-amber-light',
}

export function AnalysisTab() {
  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="平均検知信頼度" value="86.4" unit="%" />
        <Metric label="平均通知到達時間" value="2.8" unit="秒" />
        <Metric label="警告音後の再出現率" value="収集中" pending />
        <Metric label="誤検知率" value="3.1" unit="%" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md bg-card p-4">
          <SectionLabel>時間帯別検知件数</SectionLabel>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(200,120,10,0.08)"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={24}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(200,120,10,0.08)' }} />
                <Bar dataKey="count" fill="var(--amber)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 font-mono text-[9px] text-muted-foreground">
            明け方と夕暮れに検知が集中
          </p>
        </div>

        <div className="rounded-md bg-card p-4">
          <SectionLabel>月別トレンド</SectionLabel>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(200,120,10,0.08)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--amber-light)"
                  strokeWidth={2}
                  dot={{ r: 2, fill: 'var(--amber-light)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md bg-card p-4">
          <SectionLabel>ステーション別検知数</SectionLabel>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stationDetectionCounts}
                layout="vertical"
                margin={{ left: 8 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={64}
                  tick={{
                    fill: 'var(--muted-foreground)',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                  }}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(200,120,10,0.08)' }} />
                <Bar dataKey="count" fill="var(--amber)" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-md bg-card p-4">
          <SectionLabel>天候 × 検知件数 相関</SectionLabel>
          <div className="mt-4 flex h-56 flex-col items-center justify-center rounded-sm border border-dashed border-border">
            <div className="num-display text-3xl text-muted-foreground">
              データ収集中
            </div>
            <p className="mt-2 font-mono text-[9px] text-muted-foreground">
              天候データ統合後に散布図を表示
            </p>
          </div>
        </div>
      </div>

      {/* Data collection status */}
      <div className="rounded-md bg-card p-4">
        <SectionLabel>データ収集状況</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 font-mono text-[10px] font-normal uppercase tracking-widest text-muted-foreground">
                  フィールド
                </th>
                <th className="py-2 text-right font-mono text-[10px] font-normal uppercase tracking-widest text-muted-foreground">
                  状態
                </th>
              </tr>
            </thead>
            <tbody>
              {dataFields.map((f) => (
                <tr key={f.field} className="border-b border-border/40">
                  <td className="py-2.5 font-mono text-xs text-foreground">
                    {f.status === 'important' && (
                      <span className="mr-1 text-amber-light">⭐</span>
                    )}
                    {f.field}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`rounded-sm px-2 py-1 font-mono text-[9px] ${statusBadge[f.status]}`}
                    >
                      {f.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
