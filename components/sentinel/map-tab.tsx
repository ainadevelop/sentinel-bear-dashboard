'use client'

import { useEffect, useState } from 'react'
import { Plus, Minus, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useBearDashboard } from '@/lib/bear-context'
import { detectionTrail, trailSpeed, type Station } from '@/lib/data'
import { SectionLabel, StatusDot, AlertGlyph } from './primitives'

type Layer = 'stations' | 'detections' | 'heatmap' | 'trail'
type TimeRange = '24h' | '7d' | '30d'

const markerColor = (s: Station['status']) =>
  s === 'online' ? 'var(--green)' : s === 'warning' ? 'var(--amber)' : 'var(--muted-foreground)'

export function MapTab() {
  const { detections, stations } = useBearDashboard()
  const [panelOpen, setPanelOpen] = useState(true)
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    stations: true,
    detections: true,
    heatmap: false,
    trail: true,
  })
  const [range, setRange] = useState<TimeRange>('7d')
  const [enabledStations, setEnabledStations] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setEnabledStations((prev) => {
      const next = { ...prev }
      for (const station of stations) {
        if (!(station.id in next)) next[station.id] = true
      }
      return next
    })
  }, [stations])

  const toggleLayer = (l: Layer) => setLayers((p) => ({ ...p, [l]: !p[l] }))

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #e8f5e9 0%, #f1f5f9 45%, #e2e8f0 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold text-foreground shadow">
          宇都宮市街地 監視区域
        </div>

        {layers.heatmap && (
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="heat" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(198,40,40,0.45)" />
                <stop offset="50%" stopColor="rgba(224,120,0,0.25)" />
                <stop offset="100%" stopColor="rgba(224,120,0,0)" />
              </radialGradient>
            </defs>
            {detections.map((d) => (
              <circle key={d.id} cx={d.mapX} cy={d.mapY} r={14} fill="url(#heat)" />
            ))}
          </svg>
        )}

        {layers.trail && detections.length > 0 && (
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="trailgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--amber)" />
                <stop offset="100%" stopColor="var(--alert)" />
              </linearGradient>
            </defs>
            <polyline
              points={detectionTrail.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="url(#trailgrad)"
              strokeWidth="0.6"
              strokeDasharray="1.4 1.2"
            />
          </svg>
        )}

        {layers.trail && detections.length > 0 && (
          <div className="absolute rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-foreground shadow" style={{ left: '40%', top: '28%' }}>
            推定移動速度 約 {trailSpeed} km/h
          </div>
        )}

        {layers.detections &&
          detections.map((d) => (
            <div
              key={d.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.mapX}%`, top: `${d.mapY}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute size-8 rounded-full bg-alert/20 pulse-dot" />
                <AlertGlyph size={18} urgent className="relative text-alert" />
              </div>
            </div>
          ))}

        {layers.stations &&
          stations
            .filter((s) => enabledStations[s.id])
            .map((s) => (
              <div
                key={s.id}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.mapX}%`, top: `${s.mapY}%` }}
              >
                <span
                  className="block size-4 rounded-full border-2 border-white shadow"
                  style={{ background: markerColor(s.status) }}
                />
                <div className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 shadow group-hover:block">
                  <div className="text-xs font-semibold text-foreground">{s.name}</div>
                </div>
              </div>
            ))}

        <div className="absolute left-3 top-14 flex flex-wrap gap-1.5">
          {(
            [
              ['stations', '監視地点'],
              ['detections', '検知位置'],
              ['heatmap', '出没密度'],
              ['trail', '移動経路'],
            ] as [Layer, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium shadow-sm ${
                layers[key]
                  ? 'bg-alert text-white'
                  : 'bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="absolute right-3 top-3 flex gap-1 rounded-lg bg-white p-1 shadow-sm">
          {(
            [
              ['24h', '24時間'],
              ['7d', '7日間'],
              ['30d', '30日間'],
            ] as [TimeRange, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                range === key ? 'bg-alert text-white' : 'text-muted-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-16 right-3 flex flex-col gap-1">
          <button className="flex size-8 items-center justify-center rounded-md bg-white text-foreground shadow" aria-label="拡大">
            <Plus className="size-4" />
          </button>
          <button className="flex size-8 items-center justify-center rounded-md bg-white text-foreground shadow" aria-label="縮小">
            <Minus className="size-4" />
          </button>
        </div>

        <button
          onClick={() => setPanelOpen((o) => !o)}
          className="absolute right-3 top-14 z-10 hidden size-8 items-center justify-center rounded-md bg-white shadow lg:flex"
          aria-label="パネル切替"
        >
          {panelOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
        </button>
      </div>

      {panelOpen && (
        <div className="w-full shrink-0 space-y-3 lg:w-80">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <SectionLabel>直近の検知</SectionLabel>
            <div className="mt-3 space-y-2">
              {detections.length === 0 ? (
                <p className="text-sm text-muted-foreground">検知記録はありません</p>
              ) : (
                detections.map((d) => (
                  <div key={d.id} className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
                    <AlertGlyph size={16} urgent className="text-alert" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{d.stationName}</div>
                      <div className="text-xs text-muted-foreground">{d.time}</div>
                    </div>
                    <span className="text-sm font-bold text-alert">{d.confidence}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <SectionLabel>監視地点</SectionLabel>
            <div className="mt-3 space-y-2">
              {stations.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <StatusDot status={s.status} />
                  <span className="flex-1 truncate text-sm">{s.name}</span>
                  <button
                    onClick={() => setEnabledStations((p) => ({ ...p, [s.id]: !p[s.id] }))}
                    className={`relative h-5 w-9 rounded-full ${enabledStations[s.id] ? 'bg-alert' : 'bg-border'}`}
                    aria-label={`${s.name} 表示切替`}
                  >
                    <span
                      className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
                        enabledStations[s.id] ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <SectionLabel>凡例</SectionLabel>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <LegendRow color="var(--green)" label="監視稼働中" />
              <LegendRow color="var(--amber)" label="要注意" />
              <LegendRow color="var(--muted-foreground)" label="停止" />
              <div className="flex items-center gap-2">
                <AlertGlyph size={14} urgent className="text-alert" />
                <span>熊出没検知</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-3 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  )
}
