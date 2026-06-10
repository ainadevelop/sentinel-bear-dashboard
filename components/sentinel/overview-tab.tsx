'use client'

import { useBearDashboard } from '@/lib/bear-context'
import { BearGlyph, SectionLabel, StatusDot } from './primitives'

function SimpleCard({
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
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-3xl font-bold tabular" style={{ color: accent }}>
        {value}
      </div>
      {note && <div className="mt-2 text-sm text-muted-foreground">{note}</div>}
    </div>
  )
}

export function OverviewTab() {
  const { detections, KPI, stations } = useBearDashboard()
  const station = stations[0]
  const isSafe = KPI.today === 0 && detections.length === 0
  const cameraOk = station?.status === 'online'

  return (
    <div className="space-y-5">
      <div
        className={`rounded-2xl border p-6 text-center shadow-sm ${
          isSafe
            ? 'border-green/30 bg-green/5'
            : 'border-alert/30 bg-alert/5'
        }`}
      >
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-white shadow-sm">
          <BearGlyph size={36} className={isSafe ? 'text-green' : 'text-alert'} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {isSafe ? '今はくまは見つかっていません' : 'くまを見つけました'}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {isSafe
            ? 'カメラは見張りを続けています。くまが来たら音とお知らせが届きます。'
            : '警告音とお知らせを送りました。記録タブで詳しく見られます。'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SimpleCard
          title="今日くまを見つけた回数"
          value={`${KPI.today} 回`}
          accent={KPI.today > 0 ? 'var(--alert)' : 'var(--green)'}
        />
        <SimpleCard
          title="これまでの合計"
          value={`${KPI.cumulative} 回`}
        />
        <SimpleCard
          title="カメラの状態"
          value={cameraOk ? '動いています' : '確認が必要'}
          note={cameraOk ? 'よく見えています' : '電源や配線を確認してください'}
          accent={cameraOk ? 'var(--green)' : 'var(--alert)'}
        />
      </div>

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <SectionLabel>さいきんの記録</SectionLabel>
        <p className="section-hint mt-1">くまを見つけたときの記録です</p>

        <div className="mt-4 space-y-3">
          {detections.length === 0 ? (
            <div className="rounded-lg bg-muted px-4 py-8 text-center text-base text-muted-foreground">
              まだ記録はありません
            </div>
          ) : (
            detections.slice(0, 5).map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3"
              >
                <BearGlyph size={22} className="text-amber" />
                <div className="min-w-0 flex-1">
                  <div className="text-base font-medium text-foreground">
                    {d.stationName}
                  </div>
                  <div className="text-sm text-muted-foreground">{d.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-alert tabular">
                    {d.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">くまの可能性</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {station && (
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <SectionLabel>見張り場所</SectionLabel>
          <div className="mt-3 flex items-center gap-3">
            <StatusDot status={station.status} />
            <div>
              <div className="text-base font-medium">{station.name}</div>
              <div className="text-sm text-muted-foreground">
                {station.prefecture} · 最後の確認 {station.lastSeen}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
