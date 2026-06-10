'use client'

import { useEffect, useRef, useState } from 'react'
import { TopNav, type TabKey } from './top-nav'
import { OverviewTab } from './overview-tab'
import { StationsTab } from './stations-tab'
import { HistoryTab } from './history-tab'
import { AlertBanner, type AlertData } from './alert-banner'
import { BearDashboardProvider, useBearDashboard } from '@/lib/bear-context'

function DashboardSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="h-1 bg-alert" />
      <div className="h-28 border-b border-border bg-white" />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5">
        <div className="h-40 rounded-2xl bg-white" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white" />
          ))}
        </div>
      </main>
    </div>
  )
}

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-bold text-foreground">データの取得に失敗しました</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          通信状態を確認のうえ、再度お試しください。
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{message}</p>
        <button
          onClick={onRetry}
          className="mt-6 rounded-lg bg-alert px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          再読み込み
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
      station: `${station?.prefecture ?? ''} ${latest.stationName}`.trim(),
      confidence: latest.confidence,
    })
  }, [detections, stations])

  useEffect(() => {
    if (!alert) return
    const t = setTimeout(() => setAlert(null), 12000)
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

      <main className="mx-auto max-w-3xl px-4 py-5">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'stations' && <StationsTab />}
      </main>

      <footer className="border-t border-border bg-white px-4 py-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-foreground">
            検知から警告発報まで約3秒
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            SENTINEL BEAR · 宇都宮市街地 熊出没監視システム
          </p>
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
