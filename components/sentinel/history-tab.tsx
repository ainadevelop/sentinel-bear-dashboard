'use client'

import { useEffect, useMemo, useState } from 'react'
import { useBearDashboard } from '@/lib/bear-context'
import { fetchBearSnapshots, type BearSnapshotItem } from '@/lib/api'
import { AlertGlyph, SectionLabel } from './primitives'

function formatAlbumTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryTab() {
  const { detections } = useBearDashboard()
  const [threshold, setThreshold] = useState(70)
  const [albumItems, setAlbumItems] = useState<BearSnapshotItem[]>([])
  const [albumLoading, setAlbumLoading] = useState(true)
  const [selected, setSelected] = useState<BearSnapshotItem | null>(null)

  const filtered = useMemo(
    () => detections.filter((d) => d.confidence >= threshold),
    [detections, threshold],
  )

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchBearSnapshots(100)
        if (!cancelled) setAlbumItems(data.items)
      } catch {
        if (!cancelled) setAlbumItems([])
      } finally {
        if (!cancelled) setAlbumLoading(false)
      }
    }

    void load()
    const interval = setInterval(() => void load(), 10000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <SectionLabel>検知スナップショット</SectionLabel>
        <p className="section-hint mt-1">
          熊検知時に保存された画像です。行政・関係者への共有用 URL として利用できます。
        </p>
        {!albumLoading && albumItems.length > 0 && (
          <p className="mt-3 truncate text-xs text-muted-foreground">
            共有URL例: {albumItems[0].public_url}
          </p>
        )}
      </div>

      {albumLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : albumItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            保存されたスナップショットはまだありません
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {albumItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setSelected(item)}
              className="group overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm transition hover:border-alert/40 hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.public_url}
                  alt={`熊検知 ${item.name}`}
                  className="size-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-foreground">
                  {formatAlbumTime(item.modified_at)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <SectionLabel>検知イベント履歴</SectionLabel>
        <p className="section-hint mt-1">
          信頼度・音声案内・通知の記録です（サービス再起動後はリセットされる場合があります）
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
                        音声案内発報済
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

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="text-sm font-bold text-foreground">検知スナップショット</div>
                <div className="text-xs text-muted-foreground">
                  {formatAlbumTime(selected.modified_at)}
                </div>
              </div>
              <a
                href={selected.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                新しいタブで開く
              </a>
            </div>
            <img
              src={selected.public_url}
              alt={selected.name}
              className="max-h-[70vh] w-full object-contain bg-black"
            />
          </div>
        </div>
      )}
    </div>
  )
}
