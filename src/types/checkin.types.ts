/**
 * 참여 인증 관련 타입 정의
 */

export interface CheckIn {
  id: string
  eventId: string
  userId: string
  userName: string
  location: {
    lat: number
    lng: number
  }
  checkedInAt: Date
  isAnonymous: boolean
}

export interface CheckInInput {
  eventId: string
  userId: string
  userName: string
  location: {
    lat: number
    lng: number
  }
  isAnonymous: boolean
}
