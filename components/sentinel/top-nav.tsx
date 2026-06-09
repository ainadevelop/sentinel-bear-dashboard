'use client'

import { useEffect, useState } from 'react'

export type TabKey =
  | 'overview'
  | 'stations'
  | 'history'
  | 'map'
  | 'analysis'
  | 'settings'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'overview', label: '概要' },
  { key: 'stations', label: 'ステーション' },
  { key: 'history', label: '検知履歴' },
  { key: 'map', label: '熊マップ' },
  { key: 'analysis', label: 'データ分析' },
  { key: 'settings', label: '設定' },
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
        new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-surface">
      <div className="h-[5px] w-full bg-amber" />
      <div className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-sm bg-amber/15 ring-1 ring-amber/30">
            <BearGlyph />
          </div>
          <div className="leading-none">
            <div className="num-display text-2xl text-amber-light">
              SENTINEL BEAR
            </div>
            <div className="label-mono mt-0.5 text-[8px]">
              熊検知監視システム
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="-mx-1 flex items-center gap-0.5 overflow-x-auto scrollbar-thin md:mx-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
                active === t.key
                  ? 'text-amber-light'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              <span
                className={`mx-auto mt-1 block h-0.5 w-full origin-center transition-transform ${
                  active === t.key ? 'scale-x-100 bg-amber' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 rounded-full bg-green pulse-dot" />
              <span className="inline-flex size-2 rounded-full bg-green" />
            </span>
            <span className="label-mono text-green">LIVE</span>
          </div>
          <div className="font-mono text-sm tabular text-foreground">{now}</div>
        </div>
      </div>
    </header>
  )
}

function BearGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--amber-light)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <path d="M5 13.5c0-3.6 3-6 7-6s7 2.4 7 6c0 3.4-3 5.5-7 5.5s-7-2.1-7-5.5Z" />
      <circle cx="10" cy="12.5" r="0.8" fill="var(--amber-light)" />
      <circle cx="14" cy="12.5" r="0.8" fill="var(--amber-light)" />
      <path d="M11 15.5h2" />
    </svg>
  )
}
