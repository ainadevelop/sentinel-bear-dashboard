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
import { dataFields, hourlyData, monthlyTrend, stationDetectionCounts } from '@/lib/data'
import { useBearDashboard } from '@/lib/bear-context'
import { SectionLabel } from './primitives'

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #e2e6ea',
  borderRadius: 8,
  fontSize: 12,
  color: '#1a1a1a',
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
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2 flex items-baseline gap-1">
        <span
          className="text-3xl font-bold tabular"
          style={{ color: pending ? 'var(--muted-foreground)' : 'var(--alert)' }}
        >
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  )
}

const statusBadge: Record<string, string> = {
  active: 'bg-green/10 text-green',
  pending: 'bg-muted text-muted-foreground',
  important: 'bg-alert/10 text-alert',
  future: 'bg-amber/10 text-amber',
}

export function AnalysisTab() {
  const { KPI } = useBearDashboard()
  const stationCounts = stationDetectionCounts.length
    ? stationDetectionCounts
    : [{ name: '宇都宮市街地', count: KPI.cumulative }]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="平均判定信頼度" value="—" unit="%" pending />
        <Metric label="通知到達時間" value="約3" unit="秒" />
        <Metric label="再出没率" value="収集中" pending />
        <Metric label="誤検知率" value="—" unit="%" pending />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <SectionLabel>時間帯別検知件数</SectionLabel>
          <p className="section-hint mt-1">参考データ（複数地点設置後に実測値へ更新）</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid vertical={false} stroke="#e2e6ea" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} interval={2} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} width={24} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--alert)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <SectionLabel>月別検知推移</SectionLabel>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid vertical={false} stroke="#e2e6ea" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} interval={1} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} width={28} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="var(--alert)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <SectionLabel>区域別検知件数</SectionLabel>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stationCounts} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--alert)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
          <SectionLabel>天候と検知の相関</SectionLabel>
          <div className="mt-4 flex h-56 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <p className="text-lg font-semibold text-muted-foreground">データ収集中</p>
            <p className="mt-2 text-sm text-muted-foreground">気象データ連携後に表示します</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <SectionLabel>データ収集状況</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 font-medium text-muted-foreground">項目</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">状態</th>
              </tr>
            </thead>
            <tbody>
              {dataFields.map((f) => (
                <tr key={f.field} className="border-t border-border">
                  <td className="px-3 py-2.5">{f.field}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`rounded-md px-2 py-1 text-xs font-medium ${statusBadge[f.status]}`}>
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
