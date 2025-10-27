/**
 * 사용자 관련 타입 정의
 */

export type UserRole = 'user' | 'admin'
export type Language = 'ko' | 'en' | 'zh' | 'ja' | 'es'

export interface UserSettings {
  autoEnableGPS: boolean // 집회 상세 화면에서 GPS 자동 켜기
  language: Language
  notifications: boolean // 알림 설정
}

export interface UserStats {
  eventsAttended: number // 참여한 집회 수
  commentsPosted: number // 작성한 댓글 수
}

export interface User {
  uid: string // Firebase Auth UID
  email: string
  displayName: string // 닉네임
  photoURL?: string
  role: UserRole
  settings: UserSettings
  stats: UserStats
  favorites: string[] // 즐겨찾기한 집회 ID 배열
  createdAt: Date
  lastLoginAt: Date
}

// 사용자 생성용 타입
export type UserInput = Omit<User, 'createdAt' | 'lastLoginAt' | 'stats'>
