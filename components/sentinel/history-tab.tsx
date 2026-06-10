'use client'

import { useMemo, useState } from 'react'
import { useBearDashboard } from '@/lib/bear-context'
import { BearGlyph, SectionLabel } from './primitives'

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
        <SectionLabel>くまを見つけた記録</SectionLabel>
        <p className="section-hint mt-1">
          カメラがくまらしきものを見つけたときの一覧です
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">表示のしきい値</span>
            <span className="font-bold text-amber">{threshold}% 以上</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-amber"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            数字が高いほど「くまだと思う度合い」が強い記録だけを表示します
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-white px-4 py-12 text-center shadow-sm">
            <BearGlyph size={32} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-base text-muted-foreground">
              該当する記録はありません
            </p>
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <BearGlyph size={28} className="shrink-0 text-amber" />
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold text-foreground">
                    {d.stationName}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {d.time} に検知
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {d.alarmFired && (
                      <span className="rounded-full bg-amber/10 px-3 py-1 text-sm text-amber">
                        警告音を鳴らしました
                      </span>
                    )}
                    {d.lineNotified && (
                      <span className="rounded-full bg-green/10 px-3 py-1 text-sm text-green">
                        お知らせを送りました
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-alert tabular">
                    {d.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">くまの可能性</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
