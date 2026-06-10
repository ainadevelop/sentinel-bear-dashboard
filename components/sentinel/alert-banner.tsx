'use client'

import { X } from 'lucide-react'
import { BearGlyph } from './primitives'

export interface AlertData {
  station: string
  confidence: number
}

export function AlertBanner({
  alert,
  onDismiss,
  onClick,
}: {
  alert: AlertData
  onDismiss: () => void
  onClick: () => void
}) {
  return (
    <div className="slide-down fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className="mx-auto flex max-w-3xl cursor-pointer items-center gap-3 rounded-xl bg-alert px-4 py-4 text-white shadow-lg"
      >
        <BearGlyph size={28} className="text-white" />
        <div className="min-w-0 flex-1">
          <div className="text-lg font-bold">くまを見つけました</div>
          <div className="truncate text-sm">{alert.station}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular">{alert.confidence}%</div>
          <div className="text-xs">くまの可能性</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="flex size-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          aria-label="閉じる"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  )
}
