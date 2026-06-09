'use client'

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from 'recharts'
import {
  detections,
  KPI,
  stations,
  weeklyData,
} from '@/lib/data'
import { BatteryBar, BearGlyph, SectionLabel, StatusDot } from './primitives'

function KpiCard({
  label,
  value,
  accent,
  suffix,
}: {
  label: string
  value: number
  accent: string
  suffix?: string
}) {
  return (
    <div
      className="rounded-md bg-card p-4"
      style={{ borderLeft: `2px solid ${accent}` }}
    >
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="num-display text-5xl tabular" style={{ color: accent }}>
          {value}
        </span>
        {suffix && (
          <span className="font-mono text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export function OverviewTab() {
  return (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="稼働中台数"
          value={KPI.online}
          accent="var(--green)"
          suffix={`/ ${KPI.totalStations} 台`}
        />
        <KpiCard
          label="本日検知件数"
          value={KPI.today}
          accent="var(--amber-light)"
          suffix="件"
        />
        <KpiCard
          label="要確認台数"
          value={KPI.needsAttention}
          accent={KPI.needsAttention > 0 ? 'var(--alert)' : 'var(--green)'}
          suffix="台"
        />
        <KpiCard
          label="累計検知件数"
          value={KPI.cumulative}
          accent="var(--foreground)"
          suffix="件"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent detections */}
        <div className="rounded-md bg-card p-4">
          <SectionLabel>直近の検知</SectionLabel>
          <div className="mt-3 space-y-1.5">
            {detections.map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-sm bg-black/20 px-3 py-2.5"
                style={
                  i === 0 ? { borderLeft: '2px solid var(--alert)' } : undefined
                }
              >
                <BearGlyph size={20} className="text-amber" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {d.stationName}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {d.stationId} · {d.time}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="num-display text-2xl tabular"
                    style={{
                      color:
                        d.confidence >= 90
                          ? 'var(--alert)'
                          : 'var(--amber-light)',
                    }}
                  >
                    {d.confidence}
                    <span className="text-xs">%</span>
                  </div>
                </div>
                <span className="rounded-sm bg-amber/15 px-2 py-1 font-mono text-[9px] text-amber-light">
                  警告音発報済
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Station status */}
        <div className="rounded-md bg-card p-4">
          <SectionLabel>ステーション状態</SectionLabel>
          <div className="mt-3 space-y-2.5">
            {stations.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <StatusDot status={s.status} />
                <div className="w-28 shrink-0">
                  <div className="truncate text-sm text-foreground">
                    {s.name}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground">
                    {s.id} · {s.lastSeen}
                  </div>
                </div>
                <div className="flex-1">
                  <BatteryBar pct={s.battery} />
                </div>
                <div className="w-10 text-right font-mono text-xs tabular text-muted-foreground">
                  {s.battery}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="rounded-md bg-card p-4">
        <SectionLabel>週次検知グラフ</SectionLabel>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 24, bottom: 0 }}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} maxBarSize={48}>
                <LabelList
                  dataKey="count"
                  position="top"
                  fill="var(--foreground)"
                  fontSize={12}
                  fontFamily="var(--font-mono)"
                />
                {weeklyData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.today ? 'var(--amber-light)' : '#6b4408'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
