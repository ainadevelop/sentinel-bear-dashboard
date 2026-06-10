'use client'

import { useMemo, useState } from 'react'
import { Calendar, Download, X } from 'lucide-react'
import { useBearDashboard } from '@/lib/bear-context'
import { BearGlyph, SectionLabel } from './primitives'

export function HistoryTab() {
  const { detections, stations } = useBearDashboard()
  const [stationFilter, setStationFilter] = useState('all')
  const [threshold, setThreshold] = useState(50)
  const [enlarged, setEnlarged] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      detections.filter(
        (d) =>
          (stationFilter === 'all' || d.stationId === stationFilter) &&
          d.confidence >= threshold,
      ),
    [detections, stationFilter, threshold],
  )

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="rounded-md bg-card p-4">
        <SectionLabel>フィルター</SectionLabel>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div>
            <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">
              期間
            </div>
            <button className="flex items-center gap-2 rounded-sm bg-black/30 px-3 py-2 text-xs text-foreground">
              <Calendar className="size-3.5 text-amber" />
              2026/06/01 — 2026/06/09
            </button>
          </div>

          <div>
            <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">
              ステーション
            </div>
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="rounded-sm bg-black/30 px-3 py-2 text-xs text-foreground outline-none ring-amber focus:ring-1"
            >
              <option value="all">すべて</option>
              {stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[180px]">
            <div className="mb-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>信頼度閾値</span>
              <span className="text-amber-light">{threshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-amber"
            />
          </div>

          <button className="ml-auto flex items-center gap-2 rounded-sm bg-amber px-3 py-2 text-xs font-medium text-background hover:bg-amber-light">
            <Download className="size-3.5" />
            CSV エクスポート
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="flex items-center gap-4 rounded-md bg-card p-3"
          >
            <BearGlyph size={26} className="shrink-0 text-amber" />

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {d.stationName}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {d.stationId} · {d.id}
              </div>
            </div>

            <div className="hidden text-right sm:block">
              <div className="font-mono text-xs text-foreground">{d.time}</div>
              <div className="font-mono text-[9px] text-muted-foreground">
                本日
              </div>
            </div>

            <div className="text-right">
              <div
                className="num-display text-3xl tabular leading-none"
                style={{
                  color:
                    d.confidence >= 90
                      ? 'var(--alert)'
                      : d.confidence >= 70
                        ? 'var(--amber-light)'
                        : 'var(--muted-foreground)',
                }}
              >
                {d.confidence}
                <span className="text-sm">%</span>
              </div>
            </div>

            <div className="hidden flex-col gap-1 md:flex">
              {d.alarmFired && (
                <span className="rounded-sm bg-amber/15 px-2 py-0.5 text-center font-mono text-[9px] text-amber-light">
                  警告音発報
                </span>
              )}
              {d.lineNotified && (
                <span className="rounded-sm bg-green/15 px-2 py-0.5 text-center font-mono text-[9px] text-green">
                  LINE通知済
                </span>
              )}
            </div>

            <button
              onClick={() => setEnlarged(d.id)}
              className="size-12 shrink-0 overflow-hidden rounded-sm ring-1 ring-border"
              aria-label="スナップショットを拡大"
            >
              <img
                src={d.image || '/placeholder.svg'}
                alt={`${d.stationName}の検知スナップショット`}
                className="size-full object-cover"
                crossOrigin="anonymous"
              />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-md bg-card py-12 text-center text-sm text-muted-foreground">
            該当する検知記録がありません
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`size-8 rounded-sm font-mono text-xs ${
                n === 1
                  ? 'bg-amber text-background'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setEnlarged(null)}
        >
          <div className="relative max-w-md">
            <button
              onClick={() => setEnlarged(null)}
              className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full bg-card ring-1 ring-border"
              aria-label="閉じる"
            >
              <X className="size-4 text-foreground" />
            </button>
            <div className="overflow-hidden rounded-md ring-1 ring-amber/30">
              <img
                src={
                  detections.find((d) => d.id === enlarged)?.image ||
                  '/placeholder.svg'
                }
                alt="検知スナップショット拡大表示"
                className="aspect-video w-[28rem] max-w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
              {enlarged} · スナップショット
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
