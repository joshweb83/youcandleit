/**
 * useCandles 커스텀 훅
 *
 * 실시간 촛불 데이터를 관리합니다.
 */

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useGeolocation } from './useGeolocation'
import {
  subscribeToAllCandles,
  setCandleData,
  removeCandleData,
  isWithinEventRadius,
} from '@/services/firebase/realtime'
import type { Candle } from '@/types/candle.types'
import type { Event } from '@/types/event.types'

interface UseCandlesOptions {
  eventId?: string
  autoLight?: boolean // 자동으로 촛불 켜기
  event?: Event // 현장 판단을 위한 이벤트 정보
}

export function useCandles(options: UseCandlesOptions = {}) {
  const { eventId, autoLight = false, event } = options
  const { user, isAuthenticated } = useAuth()
  const { latitude, longitude } = useGeolocation(autoLight)
  const [candles, setCandles] = useState<Candle[]>([])
  const [myCandle, setMyCandle] = useState<Candle | null>(null)

  // 모든 촛불 구독
  useEffect(() => {
    const unsubscribe = subscribeToAllCandles((allCandles) => {
      if (eventId) {
        // 특정 이벤트의 촛불만 필터링
        setCandles(allCandles.filter((c) => c.eventId === eventId))
      } else {
        setCandles(allCandles)
      }

      // 내 촛불 찾기
      if (user) {
        const mine = allCandles.find((c) => c.userId === user.uid && c.eventId === eventId)
        setMyCandle(mine || null)
      }
    })

    return unsubscribe
  }, [eventId, user])

  // 자동으로 촛불 켜기
  useEffect(() => {
    if (!autoLight || !isAuthenticated || !user || !eventId || !event) return
    if (latitude === null || longitude === null) return

    const isOnsite = isWithinEventRadius(
      latitude,
      longitude,
      event.location.coordinates.lat,
      event.location.coordinates.lng
    )

    lightCandle(eventId, isOnsite)

    // 컴포넌트 언마운트 시 촛불 끄기
    return () => {
      if (eventId && user) {
        blowCandle(eventId)
      }
    }
  }, [autoLight, isAuthenticated, user, eventId, event, latitude, longitude])

  // 촛불 켜기
  const lightCandle = async (targetEventId: string, isOnsite: boolean = false) => {
    if (!isAuthenticated || !user) return

    const candleData: Candle = {
      userId: user.uid,
      eventId: targetEventId,
      type: isOnsite ? 'onsite' : 'remote',
      location:
        isOnsite && latitude !== null && longitude !== null
          ? { lat: latitude, lng: longitude }
          : undefined,
      timestamp: Date.now(),
    }

    try {
      await setCandleData(candleData)
      setMyCandle(candleData)
    } catch (error) {
      console.error('Failed to light candle:', error)
    }
  }

  // 촛불 끄기
  const blowCandle = async (targetEventId: string) => {
    if (!isAuthenticated || !user) return

    try {
      await removeCandleData(targetEventId, user.uid)
      setMyCandle(null)
    } catch (error) {
      console.error('Failed to blow candle:', error)
    }
  }

  // 현장/원격 촛불 개수
  const onsiteCount = candles.filter((c) => c.type === 'onsite').length
  const remoteCount = candles.filter((c) => c.type === 'remote').length

  return {
    candles,
    myCandle,
    onsiteCount,
    remoteCount,
    lightCandle,
    blowCandle,
    isLit: myCandle !== null,
  }
}
