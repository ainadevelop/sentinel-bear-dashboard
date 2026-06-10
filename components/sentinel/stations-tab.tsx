'use client'

import { Camera, Volume2 } from 'lucide-react'
import { useBearDashboard } from '@/lib/bear-context'
import { SectionLabel, StatusDot } from './primitives'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

function DeviceChip({
  icon,
  label,
  ok,
}: {
  icon: React.ReactNode
  label: string
  ok: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-4">
      <span style={{ color: ok ? 'var(--green)' : 'var(--alert)' }}>
        {icon}
      </span>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div
          className="text-xs font-medium"
          style={{ color: ok ? 'var(--green)' : 'var(--alert)' }}
        >
          {ok ? '正常' : '要点検'}
        </div>
      </div>
    </div>
  )
}

export function StationsTab() {
  const { stations } = useBearDashboard()
  const station = stations[0]

  if (!station) {
    return (
      <div className="rounded-xl border border-border bg-white px-4 py-12 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">監視設備の情報を取得できません</p>
      </div>
    )
  }

  const online = station.status === 'online'

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <StatusDot status={station.status} />
          <div>
            <SectionLabel>{station.name}</SectionLabel>
            <p className="text-sm text-muted-foreground">{station.prefecture}</p>
          </div>
        </div>

        <div
          className={`mt-5 rounded-xl border px-4 py-4 text-center ${
            online ? 'border-green/30 bg-green/5' : 'border-alert/30 bg-alert/5'
          }`}
        >
          <div
            className="text-lg font-bold"
            style={{ color: online ? 'var(--green)' : 'var(--alert)' }}
          >
            {online ? '監視設備は正常に稼働しています' : '監視設備の点検が必要です'}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {online
              ? '熊出没の自動検知および警告発報を継続しています。'
              : '電源・通信・カメラの状態を確認してください。'}
          </p>
        </div>

        <div className="mt-5">
          <InfoRow label="監視区域" value={station.name} />
          <InfoRow label="最終通信" value={station.lastSeen} />
          <InfoRow label="本日の検知件数" value={`${station.detectionsToday} 件`} />
          <InfoRow label="累計検知件数" value={`${station.detectionsTotal} 件`} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DeviceChip
          icon={<Camera className="size-5" />}
          label="監視カメラ"
          ok={station.camera}
        />
        <DeviceChip
          icon={<Volume2 className="size-5" />}
          label="警告音出力装置"
          ok={station.speaker}
        />
      </div>

      <div className="rounded-xl border border-alert/20 bg-alert/5 p-5">
        <p className="text-sm font-bold text-foreground">緊急時の対応</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          熊出没の検知、警告音の不発、設備異常が確認された場合は、
          直ちに担当者へ連絡し、周辺住民の安全確保および関係機関への通報を検討してください。
        </p>
      </div>
    </div>
  )
}
