export function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`label-mono ${className}`}>{children}</div>
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
        ? 'bg-amber-light'
        : 'bg-muted-foreground'
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className={`size-2 rounded-full ${color}`} />
      {status === 'online' && (
        <span
          className={`absolute inset-0 size-2 rounded-full ${color} pulse-dot`}
        />
      )}
    </span>
  )
}

export function batteryColor(pct: number) {
  if (pct >= 50) return 'var(--green)'
  if (pct >= 20) return 'var(--amber-light)'
  return 'var(--alert)'
}

export function BatteryBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/40">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: batteryColor(pct) }}
      />
    </div>
  )
}
