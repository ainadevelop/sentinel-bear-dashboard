export type StationStatus = 'online' | 'warning' | 'offline'

export interface Station {
  id: string
  name: string
  prefecture: string
  status: StationStatus
  battery: number
  voltage: number
  lat: number
  lng: number
  // normalized 0-100 position for the placeholder map
  mapX: number
  mapY: number
  starlink: number
  detectionsToday: number
  detectionsTotal: number
  lastSeen: string
  camera: boolean
  speaker: boolean
  solar: number
}

export interface Detection {
  id: string
  stationId: string
  stationName: string
  confidence: number
  time: string
  timestamp: number
  alarmFired: boolean
  lineNotified: boolean
  mapX: number
  mapY: number
}

export const stations: Station[] = [
  {
    id: 'AKT-001',
    name: '金足農地A',
    prefecture: '秋田市',
    status: 'online',
    battery: 87,
    voltage: 12.8,
    lat: 39.78,
    lng: 140.06,
    mapX: 46,
    mapY: 40,
    starlink: 92,
    detectionsToday: 1,
    detectionsTotal: 142,
    lastSeen: '2分前',
    camera: true,
    speaker: true,
    solar: 78,
  },
  {
    id: 'AKT-002',
    name: '金足農地B',
    prefecture: '秋田市',
    status: 'online',
    battery: 62,
    voltage: 12.4,
    lat: 39.8,
    lng: 140.1,
    mapX: 50,
    mapY: 36,
    starlink: 84,
    detectionsToday: 0,
    detectionsTotal: 98,
    lastSeen: '1分前',
    camera: true,
    speaker: true,
    solar: 64,
  },
  {
    id: 'IWT-001',
    name: '遠野市 農地',
    prefecture: '岩手県',
    status: 'online',
    battery: 94,
    voltage: 13.1,
    lat: 39.33,
    lng: 141.53,
    mapX: 66,
    mapY: 48,
    starlink: 96,
    detectionsToday: 3,
    detectionsTotal: 211,
    lastSeen: 'たった今',
    camera: true,
    speaker: true,
    solar: 88,
  },
  {
    id: 'IWT-002',
    name: '花巻市 林縁',
    prefecture: '岩手県',
    status: 'warning',
    battery: 18,
    voltage: 11.6,
    lat: 39.39,
    lng: 141.12,
    mapX: 62,
    mapY: 44,
    starlink: 71,
    detectionsToday: 0,
    detectionsTotal: 167,
    lastSeen: '34分前',
    camera: true,
    speaker: true,
    solar: 22,
  },
  {
    id: 'HKD-001',
    name: '函館市 農場',
    prefecture: '北海道',
    status: 'online',
    battery: 78,
    voltage: 12.7,
    lat: 41.77,
    lng: 140.73,
    mapX: 58,
    mapY: 14,
    starlink: 89,
    detectionsToday: 1,
    detectionsTotal: 76,
    lastSeen: '5分前',
    camera: true,
    speaker: true,
    solar: 70,
  },
  {
    id: 'HKD-002',
    name: '札幌市 郊外',
    prefecture: '北海道',
    status: 'offline',
    battery: 0,
    voltage: 0,
    lat: 43.06,
    lng: 141.35,
    mapX: 54,
    mapY: 8,
    starlink: 0,
    detectionsToday: 0,
    detectionsTotal: 54,
    lastSeen: '6時間前',
    camera: false,
    speaker: false,
    solar: 0,
  },
]

export const detections: Detection[] = [
  {
    id: 'D-20817',
    stationId: 'IWT-001',
    stationName: '遠野市 農地',
    confidence: 97,
    time: '14:32',
    timestamp: Date.now() - 1000 * 60 * 12,
    alarmFired: true,
    lineNotified: true,
    mapX: 66,
    mapY: 48,
  },
  {
    id: 'D-20816',
    stationId: 'HKD-001',
    stationName: '函館市 農場',
    confidence: 78,
    time: '13:58',
    timestamp: Date.now() - 1000 * 60 * 46,
    alarmFired: true,
    lineNotified: true,
    mapX: 58,
    mapY: 14,
  },
  {
    id: 'D-20815',
    stationId: 'IWT-001',
    stationName: '遠野市 農地',
    confidence: 91,
    time: '12:11',
    timestamp: Date.now() - 1000 * 60 * 60 * 2.3,
    alarmFired: true,
    lineNotified: true,
    mapX: 65,
    mapY: 47,
  },
  {
    id: 'D-20814',
    stationId: 'IWT-002',
    stationName: '花巻市 林縁',
    confidence: 84,
    time: '10:47',
    timestamp: Date.now() - 1000 * 60 * 60 * 3.7,
    alarmFired: true,
    lineNotified: true,
    mapX: 62,
    mapY: 44,
  },
  {
    id: 'D-20813',
    stationId: 'AKT-001',
    stationName: '金足農地A',
    confidence: 73,
    time: '08:22',
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    alarmFired: true,
    lineNotified: false,
    mapX: 46,
    mapY: 40,
  },
]

// Detection trail: bear moving across IWT stations within 4 hours
export const detectionTrail = [
  { x: 62, y: 44, label: '10:47', conf: 84 },
  { x: 65, y: 47, label: '12:11', conf: 91 },
  { x: 66, y: 48, label: '14:32', conf: 97 },
]
export const trailSpeed = 2.4 // km/h estimate

export const weeklyData = [
  { day: '月', count: 4 },
  { day: '火', count: 7 },
  { day: '水', count: 3 },
  { day: '木', count: 9 },
  { day: '金', count: 6 },
  { day: '土', count: 11 },
  { day: '日', count: 5, today: true },
]

export const hourlyData = Array.from({ length: 24 }, (_, h) => {
  // bears most active dawn/dusk
  const base =
    h >= 4 && h <= 7 ? 9 : h >= 16 && h <= 19 ? 11 : h >= 20 || h <= 3 ? 4 : 2
  return { hour: `${h}`, count: base + ((h * 7) % 4) }
})

export const monthlyTrend = [
  { month: '1月', count: 12 },
  { month: '2月', count: 8 },
  { month: '3月', count: 19 },
  { month: '4月', count: 34 },
  { month: '5月', count: 41 },
  { month: '6月', count: 38 },
  { month: '7月', count: 52 },
  { month: '8月', count: 61 },
  { month: '9月', count: 88 },
  { month: '10月', count: 124 },
  { month: '11月', count: 97 },
  { month: '12月', count: 43 },
]

export const stationDetectionCounts = stations
  .map((s) => ({ name: s.id, count: s.detectionsTotal }))
  .sort((a, b) => b.count - a.count)

export const KPI = {
  online: stations.filter((s) => s.status === 'online').length,
  totalStations: stations.length,
  today: detections.length,
  needsAttention: stations.filter((s) => s.status !== 'online').length,
  cumulative: stations.reduce((acc, s) => acc + s.detectionsTotal, 0),
}

export const dataFields = [
  { field: 'timestamp', status: 'active', label: '収集中' },
  { field: 'station_id', status: 'active', label: '収集中' },
  { field: 'confidence', status: 'active', label: '収集中' },
  { field: 'image_url', status: 'active', label: '収集中' },
  { field: 'weather', status: 'pending', label: '準備中' },
  { field: 'direction', status: 'pending', label: '準備中' },
  { field: 'reappearance', status: 'important', label: '重要・準備中' },
  { field: 'individual_id', status: 'future', label: 'v2予定' },
]
