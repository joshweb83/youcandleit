/**
 * 댓글 관련 타입 정의
 */

export interface Comment {
  id: string
  eventId: string // 집회 ID
  userId: string // 작성자 UID
  userName: string // 작성자 닉네임 (캐시)
  content: string // 댓글 내용
  isRemote: boolean // 원격 참여 여부
  isAIGenerated: boolean // AI 생성 여부
  likes: number // 공감 수
  createdAt: number // timestamp
}

// 댓글 생성용 타입
export type CommentInput = Omit<Comment, 'id' | 'createdAt' | 'likes'>
