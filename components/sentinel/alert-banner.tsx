'use client'

import { X } from 'lucide-react'

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
    <div className="slide-down fixed inset-x-0 top-0 z-50">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        className="flex cursor-pointer items-center gap-3 bg-alert px-4 py-3 md:px-6"
      >
        <span className="text-2xl leading-none">🐻</span>
        <span className="num-display text-xl text-foreground">熊検知</span>
        <span className="hidden h-4 w-px bg-foreground/30 sm:block" />
        <span className="truncate text-sm font-medium text-foreground">
          {alert.station}
        </span>
        <span className="font-mono text-sm text-foreground/90">
          信頼度 {alert.confidence}%
        </span>
        <span className="ml-auto hidden rounded-sm bg-black/25 px-2 py-1 font-mono text-[10px] text-foreground sm:block">
          警告音発報済
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDismiss()
          }}
          className="flex size-7 items-center justify-center rounded-sm text-foreground hover:bg-black/20"
          aria-label="閉じる"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
