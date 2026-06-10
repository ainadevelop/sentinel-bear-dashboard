'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TopNav, type TabKey } from './top-nav'
import { OverviewTab } from './overview-tab'
import { CameraTab } from './camera-tab'
import { StationsTab } from './stations-tab'
import { HistoryTab } from './history-tab'
import { AlbumTab } from './album-tab'
import { MapTab } from './map-tab'
import { AnalysisTab } from './analysis-tab'
import { SettingsTab } from './settings-tab'
import { AlertBanner, type AlertData } from './alert-banner'
import {
  BearDashboardProvider,
  getMockDashboardData,
  useBearDashboard,
  type BearDashboardContextValue,
} from '@/lib/bear-context'
import { fetchBearEvents, fetchBearStats, fetchBearStatus } from '@/lib/api'
import { buildDashboardData } from '@/lib/bear-data'

function DashboardContent() {
  const { detections, stations, usingMock } = useBearDashboard()
  const [tab, setTab] = useState<TabKey>('overview')
  const [alert, setAlert] = useState<AlertData | null>(null)
  const lastAlertId = useRef<string | null>(null)

  useEffect(() => {
    const latest = detections[0]
    if (!latest || latest.id === lastAlertId.current || usingMock) return
    if (latest.confidence < 70) return

    lastAlertId.current = latest.id
    const station = stations.find((s) => s.id === latest.stationId)
    setAlert({
      station: `${station?.prefecture ?? ''} ${latest.stationName}`.trim(),
      confidence: latest.confidence,
    })
  }, [detections, stations, usingMock])

  useEffect(() => {
    if (!alert) return
    const t = setTimeout(() => setAlert(null), 12000)
    return () => clearTimeout(t)
  }, [alert])

  return (
    <div className="min-h-screen bg-background">
      {usingMock && (
        <div className="border-b border-amber/30 bg-amber/10 px-4 py-2 text-center text-sm text-amber">
          Pi5 に接続できません。デモデータを表示しています。
        </div>
      )}

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

      <main className="mx-auto max-w-6xl px-4 py-5">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'camera' && <CameraTab />}
        {tab === 'history' && <HistoryTab />}
        {tab === 'album' && <AlbumTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'analysis' && <AnalysisTab />}
        {tab === 'stations' && <StationsTab />}
        {tab === 'settings' && <SettingsTab />}
      </main>

      <footer className="border-t border-border bg-white px-4 py-6">
        <div className="mx-auto max-w-6xl text-center">
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
  const [dashboardData, setDashboardData] = useState<BearDashboardContextValue>({
    ...getMockDashboardData(),
    kpiLoading: true,
    usingMock: false,
  })

  const refresh = useCallback(async () => {
    try {
      const [stats, events, status] = await Promise.all([
        fetchBearStats(),
        fetchBearEvents(20),
        fetchBearStatus(),
      ])

      setDashboardData({
        ...buildDashboardData(stats, events, status),
        kpiLoading: false,
        usingMock: false,
      })
    } catch {
      setDashboardData({ ...getMockDashboardData(), kpiLoading: false })
    }
  }, [])

  useEffect(() => {
    void refresh()
    const interval = setInterval(() => {
      void refresh()
    }, 10000)
    return () => clearInterval(interval)
  }, [refresh])

  return (
    <BearDashboardProvider value={dashboardData}>
      <DashboardContent />
    </BearDashboardProvider>
  )
}
