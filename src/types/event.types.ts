/**
 * 집회 관련 타입 정의
 */

export type EventStatus = 'scheduled' | 'ongoing' | 'ended'

export interface EventLocation {
  address: string
  details?: string // 추가 장소 설명
  coordinates: {
    lat: number
    lng: number
  }
  radius: number // GPS 인증 반경 (미터)
}

export interface EventDateTime {
  start: string
  end?: string
}

export interface Event {
  id: string
  title: string
  description: string
  summary: string
  posterImage?: string // 포스터 이미지 URL
  location: EventLocation
  datetime: EventDateTime
  organizer: string
  liveStreamUrl?: string
  tags: string[]
  status: EventStatus
  participantCount: number // 현장 참여자 수
  remoteCount: number // 원격 참여자 수
  createdAt: number // timestamp
  createdBy: string // 관리자 UID
  updatedAt: number // timestamp
}

// 집회 생성용 타입 (id, 메타데이터 제외)
export type EventInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'participantCount' | 'remoteCount'>

// 집회 요약 타입 (목록용)
export type EventSummary = Pick<Event, 'id' | 'title' | 'summary' | 'datetime' | 'location' | 'status' | 'participantCount' | 'remoteCount'>
