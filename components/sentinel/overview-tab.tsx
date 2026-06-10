'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis } from 'recharts'
import { useBearDashboard } from '@/lib/bear-context'
import { AlertGlyph, SectionLabel, StatusDot } from './primitives'

function StatCard({
  title,
  value,
  note,
  accent = 'var(--foreground)',
}: {
  title: string
  value: string
  note?: string
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-bold tabular" style={{ color: accent }}>
        {value}
      </div>
      {note && <div className="mt-2 text-sm text-muted-foreground">{note}</div>}
    </div>
  )
}

export function OverviewTab() {
  const { detections, KPI, stations, weeklyData } = useBearDashboard()
  const station = stations[0]
  const isSafe = KPI.today === 0 && detections.length === 0
  const cameraOk = station?.status === 'online'

  return (
    <div className="space-y-5">
      <div
        className={`rounded-2xl border-2 p-6 shadow-sm ${
          isSafe
            ? 'border-green/40 bg-green/5'
            : 'border-alert bg-alert/5'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex size-14 shrink-0 items-center justify-center rounded-lg ${
              isSafe ? 'bg-white' : 'bg-alert/10'
            }`}
          >
            <AlertGlyph
              size={32}
              urgent={!isSafe}
              className={isSafe ? 'text-green' : 'text-alert'}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-snug text-foreground">
              {isSafe
                ? '現時点、熊の出没は確認されていません'
                : '熊出没を検知しました'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {isSafe
                ? '監視カメラによる自動警戒を継続しています。出没が確認された場合、警告音の発報および関係者への通知を行います。'
                : '警告音を発報し、関係者へ通知済みです。周辺の安全確認および警戒体制の強化をお願いいたします。'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          title="本日の検知件数"
          value={`${KPI.today} 件`}
          accent={KPI.today > 0 ? 'var(--alert)' : 'var(--foreground)'}
        />
        <StatCard
          title="累計検知件数"
          value={`${KPI.cumulative} 件`}
        />
        <StatCard
          title="監視設備の状態"
          value={cameraOk ? '正常稼働' : '要確認'}
          note={cameraOk ? '映像取得可能' : '設備の点検が必要です'}
          accent={cameraOk ? 'var(--green)' : 'var(--alert)'}
        />
      </div>

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <SectionLabel>直近の検知記録</SectionLabel>
        <p className="section-hint mt-1">
          熊と判定された検知の一覧です
        </p>

        <div className="mt-4 space-y-3">
          {detections.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
              検知記録はありません
            </div>
          ) : (
            detections.slice(0, 5).map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-lg border border-alert/20 bg-alert/5 px-4 py-3"
              >
                <AlertGlyph size={22} urgent className="text-alert" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    {d.stationName}
                  </div>
                  <div className="text-xs text-muted-foreground">{d.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-alert tabular">
                    {d.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">判定信頼度</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <SectionLabel>週次検知件数</SectionLabel>
        <p className="section-hint mt-1">直近1週間の検知推移（参考）</p>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 20, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                <LabelList dataKey="count" position="top" fontSize={11} />
                {weeklyData.map((entry, i) => (
                  <Cell key={i} fill={entry.today ? 'var(--alert)' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {station && (
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <SectionLabel>監視区域</SectionLabel>
          <div className="mt-3 flex items-center gap-3">
            <StatusDot status={station.status} />
            <div>
              <div className="text-base font-semibold">{station.name}</div>
              <div className="text-sm text-muted-foreground">
                {station.prefecture} · 最終確認 {station.lastSeen}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
