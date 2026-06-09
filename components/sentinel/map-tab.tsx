'use client'

import { useState } from 'react'
import {
  Plus,
  Minus,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react'
import {
  detectionTrail,
  detections,
  stations,
  trailSpeed,
  type Station,
} from '@/lib/data'
import { SectionLabel, StatusDot, BearGlyph } from './primitives'

type Layer = 'stations' | 'detections' | 'heatmap' | 'trail'
type TimeRange = '24h' | '7d' | '30d'

const markerColor = (s: Station['status']) =>
  s === 'online'
    ? 'var(--green)'
    : s === 'warning'
      ? 'var(--amber-light)'
      : 'var(--muted-foreground)'

export function MapTab() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    stations: true,
    detections: true,
    heatmap: false,
    trail: true,
  })
  const [range, setRange] = useState<TimeRange>('7d')
  const [enabledStations, setEnabledStations] = useState<
    Record<string, boolean>
  >(Object.fromEntries(stations.map((s) => [s.id, true])))

  const toggleLayer = (l: Layer) =>
    setLayers((p) => ({ ...p, [l]: !p[l] }))

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      {/* MAP */}
      <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-md bg-card ring-1 ring-border">
        {/* base map gradient + grid */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 60% 30%, #15240f 0%, #0d1409 40%, #08060300 70%), linear-gradient(160deg, #0c0f08, #0a0805)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* coastline-ish abstraction */}
        <svg
          className="absolute inset-0 size-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M40 2 L62 6 L70 18 L60 24 L66 30 L60 40 L70 46 L64 54 L70 64 L58 72 L52 86 L44 78 L48 64 L40 54 L46 44 L40 34 L48 24 L42 14 Z"
            fill="rgba(26,48,24,0.35)"
            stroke="rgba(74,158,72,0.25)"
            strokeWidth="0.3"
          />
        </svg>

        {/* HEATMAP */}
        {layers.heatmap && (
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="heat" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(192,32,16,0.55)" />
                <stop offset="50%" stopColor="rgba(240,160,32,0.30)" />
                <stop offset="100%" stopColor="rgba(240,160,32,0)" />
              </radialGradient>
            </defs>
            {detections.map((d) => (
              <circle
                key={d.id}
                cx={d.mapX}
                cy={d.mapY}
                r={14}
                fill="url(#heat)"
              />
            ))}
          </svg>
        )}

        {/* TRAIL */}
        {layers.trail && (
          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
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
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* trail speed label */}
        {layers.trail && (
          <div
            className="absolute -translate-y-1/2 rounded-sm bg-alert/90 px-2 py-0.5 font-mono text-[9px] text-foreground"
            style={{ left: '40%', top: '28%' }}
          >
            移動速度 ~{trailSpeed} km/h
          </div>
        )}

        {/* DETECTION markers */}
        {layers.detections &&
          detections.map((d) => (
            <div
              key={d.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${d.mapX}%`, top: `${d.mapY}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute size-6 rounded-full bg-alert/40 ping-ring" />
                <BearGlyph size={16} className="relative text-alert drop-shadow" />
              </div>
            </div>
          ))}

        {/* PREDICTION zone (準備中) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: '64%', top: '47%' }}
        >
          <div className="group relative flex size-32 items-center justify-center rounded-full border border-dashed border-amber/40 bg-amber/5">
            <div className="text-center">
              <div className="label-mono text-[8px]">出没予測エリア</div>
              <div className="num-display mt-1 text-2xl text-amber-light">
                準備中
              </div>
            </div>
            <div className="pointer-events-none absolute bottom-full mb-2 hidden w-48 rounded-sm bg-black/90 p-2 text-center font-mono text-[9px] text-muted-foreground group-hover:block">
              予測機能は50台以上設置後に有効化されます
            </div>
          </div>
        </div>

        {/* STATION markers */}
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
                  className="block size-3 rounded-full ring-2 ring-black/50"
                  style={{ background: markerColor(s.status) }}
                />
                <div className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-sm bg-black/90 px-2 py-1 group-hover:block">
                  <div className="font-mono text-[9px] text-amber">{s.id}</div>
                  <div className="text-[10px] text-foreground">{s.name}</div>
                </div>
              </div>
            ))}

        {/* Top-left: layer toggles */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {(
            [
              ['stations', 'ステーション表示'],
              ['detections', '検知履歴'],
              ['heatmap', 'ヒートマップ'],
              ['trail', '移動経路'],
            ] as [Layer, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className={`rounded-sm px-2.5 py-1.5 font-mono text-[10px] backdrop-blur transition-colors ${
                layers[key]
                  ? 'bg-amber text-background'
                  : 'bg-black/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Top-right: time range */}
        <div className="absolute right-3 top-3 flex gap-1 rounded-sm bg-black/50 p-1 backdrop-blur">
          {(
            [
              ['24h', '過去24時間'],
              ['7d', '過去7日'],
              ['30d', '過去30日'],
            ] as [TimeRange, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`rounded-sm px-2 py-1 font-mono text-[9px] ${
                range === key
                  ? 'bg-amber text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-20 right-3 flex flex-col gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-sm bg-black/60 text-foreground backdrop-blur hover:bg-black/80"
            aria-label="ズームイン"
          >
            <Plus className="size-4" />
          </button>
          <button
            className="flex size-8 items-center justify-center rounded-sm bg-black/60 text-foreground backdrop-blur hover:bg-black/80"
            aria-label="ズームアウト"
          >
            <Minus className="size-4" />
          </button>
        </div>

        {/* Time slider */}
        <div className="absolute inset-x-3 bottom-3 rounded-sm bg-black/55 px-4 py-2.5 backdrop-blur">
          <div className="mb-1.5 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>00:00</span>
            <span className="text-amber-light">タイムスクラブ — 14:32</span>
            <span>現在</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={92}
            className="w-full accent-amber"
            aria-label="検知履歴タイムスライダー"
          />
        </div>

        {/* panel toggle */}
        <button
          onClick={() => setPanelOpen((o) => !o)}
          className="absolute right-3 top-14 z-10 hidden size-8 items-center justify-center rounded-sm bg-black/60 text-foreground backdrop-blur lg:flex"
          aria-label="パネル切替"
        >
          {panelOpen ? (
            <PanelRightClose className="size-4" />
          ) : (
            <PanelRightOpen className="size-4" />
          )}
        </button>
      </div>

      {/* RIGHT PANEL */}
      {panelOpen && (
        <div className="w-full shrink-0 space-y-3 lg:w-80">
          <div className="rounded-md bg-card p-4">
            <SectionLabel>直近の検知</SectionLabel>
            <div className="mt-3 space-y-1.5">
              {detections.map((d) => (
                <button
                  key={d.id}
                  className="flex w-full items-center gap-2 rounded-sm bg-black/20 px-2.5 py-2 text-left hover:bg-black/40"
                >
                  <BearGlyph size={16} className="text-amber" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs text-foreground">
                      {d.stationName}
                    </div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      {d.time}
                    </div>
                  </div>
                  <span
                    className="num-display text-lg"
                    style={{
                      color:
                        d.confidence >= 90
                          ? 'var(--alert)'
                          : 'var(--amber-light)',
                    }}
                  >
                    {d.confidence}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-card p-4">
            <SectionLabel>ステーション</SectionLabel>
            <div className="mt-3 space-y-2">
              {stations.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <StatusDot status={s.status} />
                  <span className="flex-1 truncate text-xs text-foreground">
                    {s.name}
                  </span>
                  <button
                    onClick={() =>
                      setEnabledStations((p) => ({ ...p, [s.id]: !p[s.id] }))
                    }
                    className={`relative h-4 w-7 rounded-full transition-colors ${
                      enabledStations[s.id] ? 'bg-amber' : 'bg-white/10'
                    }`}
                    aria-label={`${s.name} 表示切替`}
                  >
                    <span
                      className={`absolute top-0.5 size-3 rounded-full bg-foreground transition-transform ${
                        enabledStations[s.id]
                          ? 'translate-x-3.5'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-card p-4">
            <SectionLabel>凡例</SectionLabel>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <LegendRow color="var(--green)" label="オンライン" />
              <LegendRow color="var(--amber-light)" label="警告" />
              <LegendRow color="var(--muted-foreground)" label="オフライン" />
              <div className="flex items-center gap-2">
                <BearGlyph size={14} className="text-alert" />
                <span>熊検知イベント</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-alert" />
                <span>推定移動経路</span>
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
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  )
}
