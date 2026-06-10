import { ShieldAlert, TriangleAlert } from 'lucide-react'

export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={`section-title ${className}`}>{children}</h2>
}

export function StatusDot({
  status,
  className = '',
}: {
  status: 'online' | 'warning' | 'offline'
  className?: string
}) {
  const color =
    status === 'online'
      ? 'bg-green'
      : status === 'warning'
        ? 'bg-amber'
        : 'bg-muted-foreground'
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className={`size-3 rounded-full ${color}`} />
      {status === 'online' && (
        <span
          className={`absolute inset-0 size-3 rounded-full ${color} pulse-dot`}
        />
      )}
    </span>
  )
}

/** 警戒・監視を示すアイコン（熊の足印は使用しない） */
export function AlertGlyph({
  size = 18,
  className = 'text-amber',
  urgent = false,
}: {
  size?: number
  className?: string
  urgent?: boolean
}) {
  const Icon = urgent ? TriangleAlert : ShieldAlert
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label={urgent ? '熊出没警報' : '熊出没監視'}
    >
      <Icon style={{ width: size, height: size }} strokeWidth={2.2} />
    </span>
  )
}

/** @deprecated AlertGlyph を使用 */
export const BearGlyph = AlertGlyph

export function batteryColor(pct: number) {
  if (pct >= 50) return 'var(--green)'
  if (pct >= 20) return 'var(--amber)'
  return 'var(--alert)'
}

export function BatteryBar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: batteryColor(pct) }}
      />
    </div>
  )
}
