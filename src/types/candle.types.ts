/**
 * 촛불 관련 타입 정의 (실시간 데이터)
 */

export type CandleType = 'onsite' | 'remote'

export interface CandleLocation {
  lat: number
  lng: number
}

export interface Candle {
  userId: string
  eventId: string
  type: CandleType
  location?: CandleLocation // 현장 참여자만 해당
  timestamp: number // 마지막 업데이트 시간
}

// 촛불 생성용 타입
export type CandleInput = Omit<Candle, 'timestamp'>
