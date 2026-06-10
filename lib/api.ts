// lib/api.ts
const PI5_BASE = 'https://cam.ainadevelop.com'

export const PI5_SNAPSHOT_URL = `${PI5_BASE}/api/snapshot`

export async function fetchBearStats() {
  const res = await fetch(`${PI5_BASE}/api/bear/stats`, {
    next: { revalidate: 10 },
  })
  if (!res.ok) throw new Error('stats fetch failed')
  return res.json()
}

export async function fetchBearEvents(limit = 20) {
  const res = await fetch(`${PI5_BASE}/api/bear/events?limit=${limit}`, {
    next: { revalidate: 10 },
  })
  if (!res.ok) throw new Error('events fetch failed')
  return res.json()
}

export async function fetchBearStatus() {
  const res = await fetch(`${PI5_BASE}/api/bear/status`, {
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error('status fetch failed')
  return res.json()
}

export async function triggerBearSoundTest() {
  const res = await fetch(`${PI5_BASE}/api/bear/test-sound`, {
    method: 'POST',
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('sound test failed')
  return res.json()
}
