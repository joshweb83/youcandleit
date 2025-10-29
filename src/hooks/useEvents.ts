/**
 * useEvents 커스텀 훅
 *
 * 집회 데이터를 관리합니다.
 */

import { useState, useEffect } from 'react'
import { fetchEvents } from '@/services/firebase/firestore'
import type { Event } from '@/types/event.types'

// 샘플 집회 데이터 (개발/테스트용)
const SAMPLE_EVENT: Event = {
  id: 'sample-event-001',
  title: '기후정의를 위한 촛불집회',
  description: '기후 위기 대응을 촉구하는 시민들의 평화적 집회입니다. 모든 시민의 참여를 환영합니다. 지구를 지키기 위한 우리의 목소리를 함께 내주세요.',
  summary: '기후 위기에 대응하는 시민들의 목소리를 모아 정부의 적극적인 대응을 촉구합니다.',
  posterImage: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80',
  icon: '🕯️',
  location: {
    address: '서울특별시 종로구 세종대로 172 (세종문화회관 앞)',
    details: '세종문화회관 정문 앞 광장',
    coordinates: {
      lat: 37.5720,
      lng: 126.9760,
    },
    radius: 500,
  },
  datetime: {
    start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2시간 후
    end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5시간 후
  },
  organizer: '기후정의행동',
  liveStreamUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', // 샘플 YouTube 영상
  tags: ['기후위기', '환경', '시민행동', '평화집회'],
  status: 'ongoing' as const,
  participantCount: 1247,
  remoteCount: 389,
  createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1일 전
  createdBy: 'sample-user',
  updatedAt: Date.now(),
}

export function useEvents(status?: string) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await fetchEvents(status)

        // Firebase에서 데이터를 가져왔지만 비어있으면 샘플 데이터 추가
        if (data.length === 0) {
          setEvents([SAMPLE_EVENT])
        } else {
          setEvents(data)
        }
      } catch (err) {
        // 에러가 발생해도 샘플 데이터로 대체
        console.warn('Firebase 연결 실패, 샘플 데이터 사용:', err)
        setEvents([SAMPLE_EVENT])
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [status])

  return { events, loading, error, refetch: () => fetchEvents(status).then(setEvents) }
}

