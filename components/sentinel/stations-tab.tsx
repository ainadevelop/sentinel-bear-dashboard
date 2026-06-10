'use client'

import { Camera, Volume2 } from 'lucide-react'
import { useBearDashboard } from '@/lib/bear-context'
import { SectionLabel, StatusDot } from './primitives'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-medium text-foreground">{value}</span>
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
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-4">
      <span style={{ color: ok ? 'var(--green)' : 'var(--muted-foreground)' }}>
        {icon}
      </span>
      <div>
        <div className="text-base font-medium">{label}</div>
        <div
          className="text-sm"
          style={{ color: ok ? 'var(--green)' : 'var(--muted-foreground)' }}
        >
          {ok ? '使えます' : '確認が必要です'}
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
        <p className="text-base text-muted-foreground">カメラ情報を読み込めませんでした</p>
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

        <div className="mt-5 rounded-xl bg-muted/50 px-4 py-4 text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: online ? 'var(--green)' : 'var(--alert)' }}
          >
            {online ? 'カメラは動いています' : 'カメラを確認してください'}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {online
              ? '見張りは続いています。くまが来たら自動でお知らせします。'
              : '電源・配線・ネットの状態を確認してください。'}
          </p>
        </div>

        <div className="mt-5">
          <InfoRow label="場所の名前" value={station.name} />
          <InfoRow label="最後に確認した時間" value={station.lastSeen} />
          <InfoRow
            label="今日くまを見つけた回数"
            value={`${station.detectionsToday} 回`}
          />
          <InfoRow
            label="これまでの合計"
            value={`${station.detectionsTotal} 回`}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DeviceChip
          icon={<Camera className="size-5" />}
          label="カメラ"
          ok={station.camera}
        />
        <DeviceChip
          icon={<Volume2 className="size-5" />}
          label="警告のスピーカー"
          ok={station.speaker}
        />
      </div>

      <div className="rounded-xl border border-amber/20 bg-amber/5 p-5">
        <p className="text-base font-medium text-foreground">困ったときは</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          画面が止まった・くまが来たのに音が鳴らない、など気になることがあれば、
          担当者にこの画面を見せて連絡してください。
        </p>
      </div>
    </div>
  )
}
