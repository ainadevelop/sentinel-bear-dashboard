'use client'

import { useState } from 'react'
import { AlertTriangle, Volume2 } from 'lucide-react'
import { triggerBearSoundTest } from '@/lib/api'
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
      <div className="mb-1.5 text-sm font-medium text-muted-foreground">{label}</div>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-alert focus:ring-1 focus:ring-alert'

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function SettingsTab() {
  const { stations } = useBearDashboard()
  const [threshold, setThreshold] = useState(70)
  const [soundTesting, setSoundTesting] = useState(false)
  const [soundResult, setSoundResult] = useState<string | null>(null)
  const [showSoundConfirm, setShowSoundConfirm] = useState(false)

  async function runSoundTest() {
    setShowSoundConfirm(false)
    setSoundTesting(true)
    setSoundResult(null)
    try {
      await triggerBearSoundTest()
      setSoundResult('警告音のテスト発報を実行しました。スピーカーから音が鳴ることを確認してください。')
    } catch {
      setSoundResult('警告音のテストに失敗しました。Pi5 の接続状態を確認してください。')
    } finally {
      setSoundTesting(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card title="通知設定">
        <Field label="Discord Webhook URL">
          <input
            className={inputCls}
            placeholder="https://discord.com/api/webhooks/..."
            defaultValue="（管理者が設定済み）"
            readOnly
          />
        </Field>
        <Field label="LINE 通知">
          <input className={inputCls} defaultValue="（管理者が設定済み）" readOnly />
        </Field>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">検知判定の閾値</span>
            <span className="font-bold text-alert">{threshold}%</span>
          </div>
          <input
            type="range"
            min={60}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-alert"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            この値以上の信頼度で熊出没と判定し、警告音・通知を行います
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="監視開始時刻">
            <input type="time" defaultValue="16:00" className={inputCls} />
          </Field>
          <Field label="監視終了時刻">
            <input type="time" defaultValue="07:00" className={inputCls} />
          </Field>
        </div>
      </Card>

      <Card title="警告音の確認">
        <div className="rounded-lg border border-alert/30 bg-alert/5 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 shrink-0 text-alert" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-alert">大音量が出る可能性があります</p>
              <p className="mt-1">
                テスト発報を実行すると、現地のスピーカーから警告音が鳴ります。
                周囲の方へ事前に告知のうえ、音量にご注意ください。
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowSoundConfirm(true)}
          disabled={soundTesting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-alert px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          <Volume2 className="size-5" />
          {soundTesting ? '発報中…' : '警告音テスト発報'}
        </button>

        {soundResult && (
          <p className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
            {soundResult}
          </p>
        )}
      </Card>

      <Card title="監視区域">
        <div className="space-y-2">
          {stations.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground">
                  {s.prefecture} · ID {s.id}
                </div>
              </div>
              <span
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  s.status === 'online'
                    ? 'bg-green/10 text-green'
                    : 'bg-alert/10 text-alert'
                }`}
              >
                {s.status === 'online' ? '稼働中' : '要確認'}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="担当者情報">
        <Field label="組織名">
          <input className={inputCls} defaultValue="宇都宮市（監視協定先）" />
        </Field>
        <Field label="担当者名">
          <input className={inputCls} placeholder="担当者名" />
        </Field>
        <Field label="連絡先メール">
          <input type="email" className={inputCls} placeholder="example@city.utsunomiya.tochigi.jp" />
        </Field>
        <button className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
          変更を保存
        </button>
      </Card>

      {showSoundConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="size-6 shrink-0 text-alert" />
              <div>
                <h3 className="text-lg font-bold text-foreground">警告音テストを実行しますか？</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  現地のスピーカーから<strong className="text-foreground">大音量</strong>の警告音が鳴ります。
                  周囲の安全を確認し、了承のうえ実行してください。
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSoundConfirm(false)}
                className="flex-1 rounded-lg border border-border bg-muted px-4 py-3 text-sm font-semibold text-foreground"
              >
                キャンセル
              </button>
              <button
                onClick={() => void runSoundTest()}
                className="flex-1 rounded-lg bg-alert px-4 py-3 text-sm font-semibold text-white"
              >
                実行する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
