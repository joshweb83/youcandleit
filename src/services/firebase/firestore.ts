/**
 * Firebase Firestore 서비스
 *
 * 집회, 댓글 등의 데이터 CRUD 기능을 제공합니다.
 */

import { db } from './config'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import type { Event, EventInput } from '@/types/event.types'
import type { Comment, CommentInput } from '@/types/comment.types'

/**
 * 집회 목록 가져오기
 */
export async function fetchEvents(status?: string): Promise<Event[]> {
  if (!db) {
    console.warn('Firestore가 초기화되지 않았습니다.')
    return []
  }

  try {
    const eventsRef = collection(db!, 'events')
    let q = query(eventsRef, orderBy('datetime.start', 'desc'))

    if (status) {
      q = query(q, where('status', '==', status))
    }

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        datetime: {
          start: data.datetime.start.toDate().toISOString(),
          end: data.datetime.end?.toDate().toISOString(),
        },
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
      } as Event
    })
  } catch (error) {
    console.error('집회 목록 가져오기 실패:', error)
    return []
  }
}

/**
 * 집회 상세 정보 가져오기
 */
export async function fetchEvent(eventId: string): Promise<Event | null> {
  if (!db) {
    console.warn('Firestore가 초기화되지 않았습니다.')
    return null
  }

  try {
    const eventRef = doc(db!, 'events', eventId)
    const eventSnap = await getDoc(eventRef)

    if (eventSnap.exists()) {
      const data = eventSnap.data()
      return {
        id: eventSnap.id,
        ...data,
        datetime: {
          start: data.datetime.start.toDate().toISOString(),
          end: data.datetime.end?.toDate().toISOString(),
        },
        createdAt: data.createdAt.toMillis(),
        updatedAt: data.updatedAt.toMillis(),
      } as Event
    }

    return null
  } catch (error) {
    console.error('집회 정보 가져오기 실패:', error)
    return null
  }
}

/**
 * 집회 생성 (관리자 전용)
 */
export async function createEvent(eventData: EventInput): Promise<string | null> {
  if (!db) {
    console.warn('Firestore가 초기화되지 않았습니다.')
    return null
  }

  try {
    const eventsRef = collection(db!, 'events')

    const docRef = await addDoc(eventsRef, {
      ...eventData,
      datetime: {
        start: Timestamp.fromDate(new Date(eventData.datetime.start)),
        end: eventData.datetime.end ? Timestamp.fromDate(new Date(eventData.datetime.end)) : null,
      },
      participantCount: 0,
      remoteCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    console.error('집회 생성 실패:', error)
    return null
  }
}

/**
 * 댓글 목록 가져오기
 */
export async function fetchComments(eventId?: string): Promise<Comment[]> {
  if (!db) {
    console.warn('Firestore가 초기화되지 않았습니다.')
    return []
  }

  try {
    const commentsRef = collection(db!, 'comments')
    let q = query(commentsRef, orderBy('createdAt', 'desc'), limit(50))

    if (eventId) {
      q = query(commentsRef, where('eventId', '==', eventId), orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Comment
    })
  } catch (error) {
    console.error('댓글 가져오기 실패:', error)
    return []
  }
}

/**
 * 댓글 작성
 */
export async function createComment(commentData: CommentInput): Promise<string | null> {
  if (!db) {
    console.warn('Firestore가 초기화되지 않았습니다.')
    return null
  }

  try {
    const commentsRef = collection(db!, 'comments')

    const docRef = await addDoc(commentsRef, {
      ...commentData,
      likes: 0,
      createdAt: Timestamp.now(),
    })

    // 집회의 remoteCount 증가 (원격 참여자)
    if (commentData.isRemote) {
      const eventRef = doc(db, 'events', commentData.eventId)
      await updateDoc(eventRef, {
        remoteCount: (await getDoc(eventRef)).data()?.remoteCount + 1 || 1,
      })
    }

    return docRef.id
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    return null
  }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string): Promise<boolean> {
  if (!db) return false

  try {
    const commentRef = doc(db!, 'comments', commentId)
    await deleteDoc(commentRef)
    return true
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    return false
  }
}
