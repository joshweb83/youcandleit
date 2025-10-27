/**
 * Firebase Realtime Database 서비스
 *
 * 실시간 촛불 데이터를 관리합니다.
 */

import { ref, set, onValue, remove } from 'firebase/database'
import { rtdb } from './config'
import type { Candle } from '@/types/candle.types'

/**
 * 촛불 데이터 생성/업데이트
 */
export async function setCandleData(candle: Candle): Promise<void> {
  try {
    const candleRef = ref(rtdb, `candles/${candle.eventId}/${candle.userId}`)
    await set(candleRef, {
      ...candle,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Failed to set candle data:', error)
    throw error
  }
}

/**
 * 촛불 데이터 삭제 (사용자가 집회를 떠날 때)
 */
export async function removeCandleData(eventId: string, userId: string): Promise<void> {
  try {
    const candleRef = ref(rtdb, `candles/${eventId}/${userId}`)
    await remove(candleRef)
  } catch (error) {
    console.error('Failed to remove candle data:', error)
    throw error
  }
}

/**
 * 특정 집회의 모든 촛불 실시간 구독
 */
export function subscribeToCandles(
  eventId: string,
  callback: (candles: Candle[]) => void
): () => void {
  const candlesRef = ref(rtdb, `candles/${eventId}`)

  const unsubscribe = onValue(candlesRef, (snapshot) => {
    const candlesData = snapshot.val()
    if (!candlesData) {
      callback([])
      return
    }

    // 객체를 배열로 변환
    const candles: Candle[] = Object.values(candlesData)
    callback(candles)
  })

  return unsubscribe
}

/**
 * 모든 집회의 촛불 실시간 구독 (지도용)
 */
export function subscribeToAllCandles(callback: (candles: Candle[]) => void): () => void {
  const candlesRef = ref(rtdb, 'candles')

  const unsubscribe = onValue(candlesRef, (snapshot) => {
    const eventsData = snapshot.val()
    if (!eventsData) {
      callback([])
      return
    }

    // 모든 이벤트의 촛불을 하나의 배열로 합치기
    const allCandles: Candle[] = []
    Object.values(eventsData).forEach((eventCandles: any) => {
      Object.values(eventCandles).forEach((candle) => {
        allCandles.push(candle as Candle)
      })
    })

    callback(allCandles)
  })

  return unsubscribe
}

/**
 * 사용자의 현재 위치가 집회 반경 내에 있는지 확인
 */
export function isWithinEventRadius(
  userLat: number,
  userLng: number,
  eventLat: number,
  eventLng: number,
  radiusKm: number = 0.5 // 기본 반경 500m
): boolean {
  // Haversine 공식으로 두 지점 간 거리 계산
  const R = 6371 // 지구 반경 (km)
  const dLat = ((eventLat - userLat) * Math.PI) / 180
  const dLng = ((eventLng - userLng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
      Math.cos((eventLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance <= radiusKm
}
