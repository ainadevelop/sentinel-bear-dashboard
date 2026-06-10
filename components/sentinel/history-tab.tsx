'use client'

import { useMemo, useState } from 'react'
import { useBearDashboard } from '@/lib/bear-context'
import { AlertGlyph, SectionLabel } from './primitives'

export function HistoryTab() {
  const { detections } = useBearDashboard()
  const [threshold, setThreshold] = useState(70)

  const filtered = useMemo(
    () => detections.filter((d) => d.confidence >= threshold),
    [detections, threshold],
  )

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <SectionLabel>熊出没検知履歴</SectionLabel>
        <p className="section-hint mt-1">
          監視カメラにより熊と判定された記録の一覧です
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">表示閾値（判定信頼度）</span>
            <span className="font-bold text-alert">{threshold}% 以上</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-alert"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white px-4 py-12 text-center shadow-sm">
            <AlertGlyph size={32} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              該当する検知記録はありません
            </p>
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-alert/20 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {d.image && d.image !== '/placeholder.svg' ? (
                  <img
                    src={d.image}
                    alt={`${d.stationName} 検知画像`}
                    className="size-20 shrink-0 rounded-lg border border-border object-cover"
                    loading="lazy"
                  />
                ) : (
                  <AlertGlyph size={26} urgent className="shrink-0 text-alert" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-foreground">
                    {d.stationName}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    検知時刻 {d.time}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {d.alarmFired && (
                      <span className="rounded-md border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-medium text-amber">
                        警告音発報済
                      </span>
                    )}
                    {d.lineNotified && (
                      <span className="rounded-md border border-green/30 bg-green/10 px-3 py-1 text-xs font-medium text-green">
                        関係者へ通知済
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-alert tabular">
                    {d.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">判定信頼度</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
