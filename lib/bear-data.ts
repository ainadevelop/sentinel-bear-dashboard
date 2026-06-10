import type { Detection, Station } from '@/lib/data'
import type { DashboardKpi } from '@/lib/bear-context'
import { weeklyData } from '@/lib/data'

const STATION_NAMES: Record<string, { name: string; prefecture: string }> = {
  'UMEDAYA-001': { name: '宇都宮市街地', prefecture: '栃木県' },
  'BEAR-001': { name: '宇都宮市街地', prefecture: '栃木県' },
  'TEST-001': { name: '宇都宮市街地（試験）', prefecture: '栃木県' },
}

export interface BearStatsResponse {
  total_detections: number
  today_detections: number
  model_loaded: boolean
  station_id: string
  last_detection: BearEvent | null
}

export interface BearEvent {
  detected: boolean
  bears?: { confidence: number; bbox: number[] }[]
  timestamp: string
  station_id: string
  image_path?: string | null
}

export interface BearStatusResponse {
  model_loaded: boolean
  model_path?: string
  status: string
}

function formatLastSeen(timestamp?: string | null) {
  if (!timestamp) return '—'
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  return `${Math.floor(hours / 24)}日前`
}

function mapStation(stats: BearStatsResponse, status: BearStatusResponse): Station {
  const meta = STATION_NAMES[stats.station_id] ?? {
    name: stats.station_id,
    prefecture: '—',
  }
  const online = status.model_loaded && status.status === 'ready'

  return {
    id: stats.station_id,
    name: meta.name,
    prefecture: meta.prefecture,
    status: online ? 'online' : 'offline',
    battery: online ? 100 : 0,
    voltage: online ? 12.8 : 0,
    lat: 36.555,
    lng: 139.883,
    mapX: 50,
    mapY: 50,
    starlink: 0,
    detectionsToday: stats.today_detections,
    detectionsTotal: stats.total_detections,
    lastSeen: formatLastSeen(stats.last_detection?.timestamp),
    camera: status.model_loaded,
    speaker: true,
    solar: 0,
  }
}

function mapDetection(event: BearEvent, index: number): Detection {
  const meta = STATION_NAMES[event.station_id] ?? {
    name: event.station_id,
    prefecture: '—',
  }
  const confidence = Math.round((event.bears?.[0]?.confidence ?? 0) * 100)
  const timestamp = new Date(event.timestamp).getTime()

  return {
    id: `D-${timestamp}-${index}`,
    stationId: event.station_id,
    stationName: meta.name,
    confidence,
    time: new Date(event.timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    timestamp,
    alarmFired: Boolean(event.image_path),
    lineNotified: Boolean(event.image_path),
    mapX: 50,
    mapY: 50,
    image: '/placeholder.svg',
  }
}

export function buildDashboardData(
  stats: BearStatsResponse,
  events: { events?: BearEvent[] },
  status: BearStatusResponse,
) {
  const station = mapStation(stats, status)
  const detections = (events.events ?? [])
    .filter((event) => event.detected)
    .map(mapDetection)

  const KPI: DashboardKpi = {
    online: station.status === 'online' ? 1 : 0,
    totalStations: 1,
    today: stats.today_detections ?? 0,
    needsAttention: station.status === 'online' ? 0 : 1,
    cumulative: stats.total_detections ?? 0,
  }

  return {
    stations: [station],
    detections,
    KPI,
    weeklyData,
    kpiLoading: false,
    usingMock: false,
  }
}
