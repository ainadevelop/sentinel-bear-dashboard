'use client'

import { useState } from 'react'
import {
  ChevronDown,
  Camera,
  Volume2,
  Sun,
  Satellite,
  Plus,
} from 'lucide-react'
import { useBearDashboard } from '@/lib/bear-context'
import type { Station } from '@/lib/data'
import { batteryColor, SectionLabel } from './primitives'

const statusMeta: Record<
  Station['status'],
  { label: string; border: string; badge: string }
> = {
  online: {
    label: 'ONLINE',
    border: 'var(--green)',
    badge: 'bg-green/15 text-green',
  },
  warning: {
    label: 'WARNING',
    border: 'var(--amber-light)',
    badge: 'bg-amber/15 text-amber-light',
  },
  offline: {
    label: 'OFFLINE',
    border: 'var(--muted-foreground)',
    badge: 'bg-white/5 text-muted-foreground',
  },
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-xs text-foreground">{value}</span>
    </div>
  )
}

function StationCard({ station }: { station: Station }) {
  const [open, setOpen] = useState(false)
  const meta = statusMeta[station.status]

  return (
    <div
      className="rounded-md bg-card"
      style={{ borderLeft: `2px solid ${meta.border}` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[11px] text-amber">{station.id}</div>
          <div className="mt-0.5 truncate text-sm font-medium text-foreground">
            {station.prefecture} {station.name}
          </div>
        </div>

        <span
          className={`rounded-sm px-2 py-1 font-mono text-[9px] tracking-widest ${meta.badge}`}
        >
          {meta.label}
        </span>

        <div className="text-right">
          <div
            className="num-display text-3xl tabular leading-none"
            style={{ color: batteryColor(station.battery) }}
          >
            {station.battery}
            <span className="text-sm">%</span>
          </div>
          <div className="font-mono text-[9px] text-muted-foreground">
            {station.voltage.toFixed(1)}V
          </div>
        </div>

        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-border/50 p-4">
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            <DetailRow label="最終通信時刻" value={station.lastSeen} />
            <DetailRow
              label="本日検知件数"
              value={`${station.detectionsToday} 件`}
            />
            <DetailRow
              label="累計検知件数"
              value={`${station.detectionsTotal} 件`}
            />
            <DetailRow
              label="Starlink 信号強度"
              value={`${station.starlink}%`}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatusChip
              icon={<Camera className="size-3.5" />}
              label="カメラ"
              on={station.camera}
            />
            <StatusChip
              icon={<Volume2 className="size-3.5" />}
              label="スピーカー"
              on={station.speaker}
            />
            <StatusChip
              icon={<Sun className="size-3.5" />}
              label="ソーラー"
              on={station.solar > 10}
              detail={`${station.solar}%`}
            />
            <StatusChip
              icon={<Satellite className="size-3.5" />}
              label="Starlink"
              on={station.starlink > 0}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-sm bg-amber px-3 py-2 text-xs font-medium text-background hover:bg-amber-light">
              カメラ確認
            </button>
            <button className="rounded-sm bg-white/5 px-3 py-2 text-xs font-medium text-foreground hover:bg-white/10">
              テスト発報
            </button>
            <button className="rounded-sm bg-white/5 px-3 py-2 text-xs font-medium text-foreground hover:bg-white/10">
              設定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusChip({
  icon,
  label,
  on,
  detail,
}: {
  icon: React.ReactNode
  label: string
  on: boolean
  detail?: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-sm bg-black/20 px-2.5 py-2">
      <span style={{ color: on ? 'var(--green)' : 'var(--muted-foreground)' }}>
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-[11px] text-foreground">{label}</div>
        <div
          className="font-mono text-[9px]"
          style={{ color: on ? 'var(--green)' : 'var(--muted-foreground)' }}
        >
          {detail ?? (on ? '稼働中' : '停止')}
        </div>
      </div>
    </div>
  )
}

export function StationsTab() {
  const { stations } = useBearDashboard()

  return (
    <div className="relative space-y-4 pb-20">
      <SectionLabel>ステーション一覧 — {stations.length} 台</SectionLabel>
      <div className="space-y-2.5">
        {stations.map((s) => (
          <StationCard key={s.id} station={s} />
        ))}
      </div>

      <button className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-md bg-amber px-4 py-3 text-sm font-medium text-background shadow-lg shadow-black/40 hover:bg-amber-light">
        <Plus className="size-4" />
        ステーション追加
      </button>
    </div>
  )
}
