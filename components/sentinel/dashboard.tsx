'use client'

import { useEffect, useState } from 'react'
import { TopNav, type TabKey } from './top-nav'
import { OverviewTab } from './overview-tab'
import { StationsTab } from './stations-tab'
import { HistoryTab } from './history-tab'
import { MapTab } from './map-tab'
import { AnalysisTab } from './analysis-tab'
import { SettingsTab } from './settings-tab'
import { AlertBanner, type AlertData } from './alert-banner'

export function Dashboard() {
  const [tab, setTab] = useState<TabKey>('overview')
  const [alert, setAlert] = useState<AlertData | null>(null)

  // Trigger live alert demo after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      setAlert({ station: '遠野市 農地 (IWT-001)', confidence: 97 })
    }, 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!alert) return
    const t = setTimeout(() => setAlert(null), 8000)
    return () => clearTimeout(t)
  }, [alert])

  return (
    <div className="min-h-screen bg-background">
      {alert && (
        <AlertBanner
          alert={alert}
          onDismiss={() => setAlert(null)}
          onClick={() => {
            setTab('history')
            setAlert(null)
          }}
        />
      )}

      <TopNav active={tab} onChange={setTab} />

      <main className="mx-auto max-w-[1400px] px-4 py-5 md:px-6">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'stations' && <StationsTab />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'analysis' && <AnalysisTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>

      <footer className="border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="num-display text-base text-amber/70">
            検知から3秒。3分では間に合わない。
          </div>
          <div className="font-mono text-[10px] text-muted-foreground">
            SENTINEL BEAR · v1.0 · 熊検知監視システム
          </div>
        </div>
      </footer>
    </div>
  )
}
