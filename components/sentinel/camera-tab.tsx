'use client'

import { useCallback, useEffect, useState } from 'react'
import { Camera, RefreshCw } from 'lucide-react'
import { PI5_SNAPSHOT_URL } from '@/lib/api'
import { useBearDashboard } from '@/lib/bear-context'
import { AlertGlyph, SectionLabel } from './primitives'

export function CameraTab() {
  const { stations } = useBearDashboard()
  const station = stations[0]
  const [tick, setTick] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')

  const refresh = useCallback(() => {
    setLoading(true)
    setError(false)
    setTick((t) => t + 1)
  }, [])

  useEffect(() => {
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh])

  const snapshotSrc = `${PI5_SNAPSHOT_URL}?t=${tick}`

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <SectionLabel>監視カメラ映像</SectionLabel>
            <p className="section-hint mt-1">
              {station?.name ?? '宇都宮市街地'} · 自動更新（10秒間隔）
            </p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-border"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            更新
          </button>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={tick}
            src={snapshotSrc}
            alt="監視カメラの現在映像"
            className="aspect-video w-full object-cover"
            onLoad={() => {
              setLoading(false)
              setError(false)
              setLastUpdate(
                new Date().toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
              )
            }}
            onError={() => {
              setLoading(false)
              setError(true)
            }}
          />

          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm text-muted-foreground">
              映像を読み込み中…
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted px-6 text-center">
              <Camera className="size-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                カメラ映像を取得できません
              </p>
              <p className="text-xs text-muted-foreground">
                下記は監視画面の表示イメージです（デモ）
              </p>
            </div>
          )}

          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md bg-alert px-2.5 py-1 text-xs font-bold text-white">
            <span className="size-2 rounded-full bg-white pulse-dot" />
            LIVE
          </div>
          {lastUpdate && (
            <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white">
              最終更新 {lastUpdate}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-dashed border-border bg-white p-4 shadow-sm">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-green-50 to-slate-200">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <AlertGlyph size={40} className="text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-foreground">
                デモ映像（宇都宮市街地 監視区域）
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                実機接続時は上部にライブ映像が表示されます
              </p>
            </div>
            <div className="absolute bottom-4 left-4 rounded bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow">
              カメラ #1 · 宇都宮市街地
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground shadow-sm">
        <p className="font-semibold text-foreground">映像について</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>熊の検知はこの映像を自動解析して行います</li>
          <li>映像が表示されない場合は、監視設備タブで状態を確認してください</li>
          <li>夜間は照明状況により画質が変わることがあります</li>
        </ul>
      </div>
    </div>
  )
}
