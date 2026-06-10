'use client'

import { useEffect, useState } from 'react'
import { AlertGlyph } from './primitives'

export type TabKey = 'overview' | 'history' | 'stations'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: '警戒状況' },
  { key: 'history', label: '検知履歴' },
  { key: 'stations', label: '監視設備' },
]

export function TopNav({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (t: TabKey) => void
}) {
  const [now, setNow] = useState('')

  useEffect(() => {
    const update = () =>
      setNow(
        new Date().toLocaleString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    update()
    const i = setInterval(update, 60000)
    return () => clearInterval(i)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
      <div className="h-1 w-full bg-alert" />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg border border-alert/20 bg-alert/5">
              <AlertGlyph size={24} className="text-alert" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-foreground">
                SENTINEL BEAR
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                宇都宮市街地 · 熊出没監視
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-2.5 rounded-full bg-green pulse-dot" />
                <span className="inline-flex size-2.5 rounded-full bg-green" />
              </span>
              <span className="text-sm font-semibold text-green">監視稼働中</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{now}</div>
          </div>
        </div>

        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex-1 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                active === t.key
                  ? 'bg-alert text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
