'use client'

import { useEffect, useState } from 'react'
import { BearGlyph } from './primitives'

export type TabKey = 'overview' | 'history' | 'stations'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'いまの様子' },
  { key: 'history', label: 'これまでの記録' },
  { key: 'stations', label: 'カメラの状態' },
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
          month: 'numeric',
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
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-amber/10">
              <BearGlyph size={24} className="text-amber" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">くま見張り番</div>
              <div className="text-sm text-muted-foreground">梅田屋 上野</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-2.5 rounded-full bg-green pulse-dot" />
                <span className="inline-flex size-2.5 rounded-full bg-green" />
              </span>
              <span className="text-sm font-medium text-green">見張り中</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{now}</div>
          </div>
        </div>

        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex-1 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                active === t.key
                  ? 'bg-amber text-white shadow-sm'
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
