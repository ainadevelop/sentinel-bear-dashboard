'use client'

import { useState } from 'react'
import { Plus, Trash2, Volume2 } from 'lucide-react'
import { useBearDashboard } from '@/lib/bear-context'
import { SectionLabel } from './primitives'

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="mb-1.5 font-mono text-[10px] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-sm bg-black/30 px-3 py-2 text-sm text-foreground outline-none ring-amber placeholder:text-muted-foreground/60 focus:ring-1'

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-md bg-card p-5">
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function SettingsTab() {
  const { stations } = useBearDashboard()
  const [threshold, setThreshold] = useState(85)
  const [volume, setVolume] = useState(70)
  const [sound, setSound] = useState('熊撃退音')

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* 通知設定 */}
      <Card title="通知設定">
        <Field label="Discord Webhook URL">
          <input
            className={inputCls}
            placeholder="https://discord.com/api/webhooks/..."
            defaultValue="https://discord.com/api/webhooks/****"
          />
        </Field>
        <Field label="LINE チャンネル ID">
          <input className={inputCls} placeholder="U1a2b3c4..." />
        </Field>
        <div>
          <div className="mb-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>検知信頼度閾値</span>
            <span className="text-amber-light">{threshold}%</span>
          </div>
          <input
            type="range"
            min={60}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-amber"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="稼働開始時刻">
            <input type="time" defaultValue="16:00" className={inputCls} />
          </Field>
          <Field label="稼働終了時刻">
            <input type="time" defaultValue="07:00" className={inputCls} />
          </Field>
        </div>
      </Card>

      {/* 警告音設定 */}
      <Card title="警告音設定">
        <Field label="音源選択">
          <select
            value={sound}
            onChange={(e) => setSound(e.target.value)}
            className={inputCls}
          >
            <option>標準アラート</option>
            <option>熊撃退音</option>
            <option>カスタム</option>
          </select>
        </Field>
        <div>
          <div className="mb-1.5 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>音量設定</span>
            <span className="text-amber-light">{volume}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-amber"
          />
        </div>
        <button className="flex items-center gap-2 rounded-sm bg-amber px-4 py-2.5 text-sm font-medium text-background hover:bg-amber-light">
          <Volume2 className="size-4" />
          テスト発報
        </button>
      </Card>

      {/* ステーション管理 */}
      <Card title="ステーション管理">
        <div className="space-y-2">
          {stations.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-sm bg-black/20 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] text-amber">{s.id}</div>
                <div className="truncate text-sm text-foreground">
                  {s.prefecture} {s.name}
                </div>
                <div className="font-mono text-[9px] text-muted-foreground">
                  {s.lat.toFixed(2)}, {s.lng.toFixed(2)} · Starlink{' '}
                  {s.starlink > 0 ? '接続' : '切断'}
                </div>
              </div>
              <button className="rounded-sm bg-white/5 px-2.5 py-1.5 text-xs text-foreground hover:bg-white/10">
                編集
              </button>
              <button
                className="rounded-sm bg-alert/15 p-1.5 text-alert hover:bg-alert/25"
                aria-label="削除"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-amber/40 py-2.5 text-sm text-amber-light hover:bg-amber/5">
          <Plus className="size-4" />
          ステーション追加
        </button>
      </Card>

      {/* アカウント設定 */}
      <Card title="アカウント設定">
        <Field label="組織名">
          <input className={inputCls} defaultValue="遠野市農業協同組合" />
        </Field>
        <Field label="担当者名">
          <input className={inputCls} defaultValue="佐藤 健一" />
        </Field>
        <Field label="メールアドレス">
          <input
            type="email"
            className={inputCls}
            defaultValue="k.sato@tono-ja.example.jp"
          />
        </Field>
        <button className="rounded-sm bg-amber px-4 py-2.5 text-sm font-medium text-background hover:bg-amber-light">
          変更を保存
        </button>
      </Card>
    </div>
  )
}
