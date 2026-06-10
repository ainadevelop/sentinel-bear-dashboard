'use client'

import { useState } from 'react'
import { AlertTriangle, Volume2 } from 'lucide-react'
import { triggerBearSoundTest, BEAR_DETECTION_CONFIDENCE_PERCENT, BEAR_MONITORING_SCHEDULE } from '@/lib/api'
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
  const [soundTesting, setSoundTesting] = useState(false)
  const [browserPlaying, setBrowserPlaying] = useState(false)
  const [soundResult, setSoundResult] = useState<string | null>(null)
  const [showSoundConfirm, setShowSoundConfirm] = useState(false)

  async function playBrowserPreview() {
    setBrowserPlaying(true)
    setSoundResult(null)
    try {
      const audio = new Audio('/bear/bear_alert.wav')
      audio.volume = 0.8
      await audio.play()
      setSoundResult('「熊が出没した可能性があります。確認し、避難してください。」を再生しました。')
    } catch {
      setSoundResult('ブラウザでの再生に失敗しました。音量とブラウザの自動再生設定を確認してください。')
    } finally {
      setBrowserPlaying(false)
    }
  }

  async function runSoundTest() {
    setShowSoundConfirm(false)
    setSoundTesting(true)
    setSoundResult(null)
    try {
      const result = await triggerBearSoundTest() as {
        status?: string
        message?: string
        played?: boolean
        hint?: string
      }
      if (result.played) {
        setSoundResult(result.message ?? '現地スピーカーから音声案内を再生しました。')
      } else {
        setSoundResult(
          [result.message, result.hint].filter(Boolean).join(' ') ||
            '現地スピーカーから再生できませんでした。USB スピーカーの接続を確認してください。',
        )
      }
    } catch {
      setSoundResult('音声案内のテストに失敗しました。Pi5 の接続状態を確認してください。')
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
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
          <div className="text-sm font-medium text-muted-foreground">検知判定の閾値</div>
          <div className="mt-1 text-base font-bold text-foreground">
            {BEAR_DETECTION_CONFIDENCE_PERCENT}%（システム固定）
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            誤操作による検知漏れを防ぐため、ダッシュボードからは変更できません。
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-3">
          <div className="text-sm font-medium text-muted-foreground">監視時間</div>
          <div className="mt-1 text-base font-bold text-foreground">{BEAR_MONITORING_SCHEDULE}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            昼夜を問わず常時監視します。
          </p>
        </div>
      </Card>

      <Card title="音声案内の確認">
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">発報内容</p>
          <p className="mt-2 text-foreground">
            「熊が出没した可能性があります。確認し、避難してください。」
          </p>
        </div>

        <div className="rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm leading-relaxed text-muted-foreground">
          <p className="font-semibold text-amber">現地スピーカーについて</p>
          <p className="mt-1">
            Pi5 本体の HDMI 音声だけでは鳴らないことがあります。
            屋外設置時は <strong className="text-foreground">USB スピーカー</strong> を接続してください。
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">ブラウザで試聴</span>
            — Microsoft 音声（Nanami）で生成した案内を、この端末から再生します。
          </p>
        </div>

        <button
          onClick={() => void playBrowserPreview()}
          disabled={browserPlaying}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-alert bg-white px-4 py-3 text-sm font-semibold text-alert hover:bg-alert/5 disabled:opacity-50"
        >
          <Volume2 className="size-5" />
          {browserPlaying ? '再生中…' : 'ブラウザで音声案内を聴く'}
        </button>

        <div className="rounded-lg border border-alert/30 bg-alert/5 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 shrink-0 text-alert" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p className="font-semibold text-alert">現地スピーカー（大音量）</p>
              <p className="mt-1">
                Pi5 設置現場のスピーカーから同じ音声案内を発報します。
                周囲の方へ事前に告知のうえ実行してください。
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
          {soundTesting ? '発報中…' : '現地スピーカーでテスト発報'}
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
                <h3 className="text-lg font-bold text-foreground">音声案内テストを実行しますか？</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  現地のスピーカーから<strong className="text-foreground">大音量</strong>で
                  「熊が出没した可能性があります。確認し、避難してください。」が流れます。
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
