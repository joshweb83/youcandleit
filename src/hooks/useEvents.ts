/**
 * useEvents 커스텀 훅
 *
 * 집회 데이터를 관리합니다.
 */

import { useState, useEffect } from 'react'
import { fetchEvents } from '@/services/firebase/firestore'
import type { Event } from '@/types/event.types'

export function useEvents(status?: string) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await fetchEvents(status)
        setEvents(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [status])

  return { events, loading, error, refetch: () => fetchEvents(status).then(setEvents) }
}
