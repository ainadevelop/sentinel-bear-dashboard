'use client'

import { useEffect, useState } from 'react'
import { fetchBearSnapshots, type BearSnapshotItem } from '@/lib/api'
import { SectionLabel } from './primitives'

function formatAlbumTime(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AlbumTab() {
  const [items, setItems] = useState<BearSnapshotItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<BearSnapshotItem | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetchBearSnapshots(100)
        if (!cancelled) setItems(data.items)
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
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
        <SectionLabel>検知スナップショットアルバム</SectionLabel>
        <p className="section-hint mt-1">
          熊検知時に保存された監視カメラ画像です。関係者・行政向けにウェブ上で共有可能です。
        </p>
        {!loading && items.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            共有URL例: {items[0].public_url}
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border bg-white px-4 py-16 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            保存されたスナップショットはまだありません
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
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
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {item.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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
