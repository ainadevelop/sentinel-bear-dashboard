'use client'

import { useEffect, useRef, useState } from 'react'
import { TopNav, type TabKey } from './top-nav'
import { OverviewTab } from './overview-tab'
import { StationsTab } from './stations-tab'
import { HistoryTab } from './history-tab'
import { MapTab } from './map-tab'
import { AnalysisTab } from './analysis-tab'
import { SettingsTab } from './settings-tab'
import { AlertBanner, type AlertData } from './alert-banner'
import { BearDashboardProvider, useBearDashboard } from '@/lib/bear-context'

function DashboardSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="h-14 border-b border-border bg-card" />
      <main className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 md:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-md bg-card" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72 rounded-md bg-card" />
          <div className="h-72 rounded-md bg-card" />
        </div>
        <div className="h-56 rounded-md bg-card" />
      </main>
    </div>
  )
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-md bg-card p-6 text-center">
        <div className="font-mono text-xs text-amber">SENTINEL BEAR</div>
        <h1 className="mt-2 text-lg font-medium text-foreground">データ取得エラー</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <button
          onClick={onRetry}
          className="mt-4 rounded-sm bg-amber px-4 py-2 text-sm font-medium text-background hover:bg-amber-light"
        >
          再試行
        </button>
      </div>
    </div>
  )
}

function DashboardContent() {
  const { loading, error, refresh, detections, stations } = useBearDashboard()
  const [tab, setTab] = useState<TabKey>('overview')
  const [alert, setAlert] = useState<AlertData | null>(null)
  const lastAlertId = useRef<string | null>(null)

  useEffect(() => {
    const latest = detections[0]
    if (!latest || latest.id === lastAlertId.current) return
    if (latest.confidence < 70) return

    lastAlertId.current = latest.id
    const station = stations.find((s) => s.id === latest.stationId)
    setAlert({
      station: `${station?.prefecture ?? ''} ${latest.stationName} (${latest.stationId})`.trim(),
      confidence: latest.confidence,
    })
  }, [detections, stations])

  useEffect(() => {
    if (!alert) return
    const t = setTimeout(() => setAlert(null), 8000)
    return () => clearTimeout(t)
  }, [alert])

  if (loading) return <DashboardSkeleton />
  if (error) return <DashboardError message={error} onRetry={() => void refresh()} />

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

export function Dashboard() {
  return (
    <BearDashboardProvider>
      <DashboardContent />
    </BearDashboardProvider>
  )
}
