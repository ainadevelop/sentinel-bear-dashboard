'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Detection, Station } from '@/lib/data'
import { KPI as mockKpi, detections as mockDetections, weeklyData } from '@/lib/data'

export interface DashboardKpi {
  online: number
  totalStations: number
  today: number
  needsAttention: number
  cumulative: number
}

export interface BearDashboardContextValue {
  stations: Station[]
  detections: Detection[]
  KPI: DashboardKpi
  weeklyData: typeof weeklyData
  kpiLoading: boolean
  usingMock: boolean
}

const BearDashboardContext = createContext<BearDashboardContextValue | null>(null)

export function getMockDashboardData(): BearDashboardContextValue {
  const station = {
    id: 'UMEDAYA-001',
    name: '宇都宮市街地',
    prefecture: '栃木県',
    status: 'online' as const,
    battery: 100,
    voltage: 12.8,
    lat: 36.555,
    lng: 139.883,
    mapX: 50,
    mapY: 50,
    starlink: 0,
    detectionsToday: mockKpi.today,
    detectionsTotal: mockKpi.cumulative,
    lastSeen: '—',
    camera: true,
    speaker: true,
    solar: 0,
  }

  return {
    stations: [station],
    detections: mockDetections.slice(0, 3),
    KPI: {
      online: mockKpi.online,
      totalStations: 1,
      today: mockKpi.today,
      needsAttention: mockKpi.needsAttention,
      cumulative: mockKpi.cumulative,
    },
    weeklyData,
    kpiLoading: false,
    usingMock: true,
  }
}

export function BearDashboardProvider({
  value,
  children,
}: {
  value: BearDashboardContextValue
  children: ReactNode
}) {
  return (
    <BearDashboardContext.Provider value={value}>
      {children}
    </BearDashboardContext.Provider>
  )
}

export function useBearDashboard() {
  const context = useContext(BearDashboardContext)
  if (!context) {
    throw new Error('useBearDashboard must be used within BearDashboardProvider')
  }
  return context
}
