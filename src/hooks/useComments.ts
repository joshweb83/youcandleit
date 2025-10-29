/**
 * useComments 커스텀 훅
 *
 * 댓글 데이터를 관리합니다.
 * 실시간 업데이트를 지원합니다.
 */

import { useState, useEffect } from 'react'
import { db } from '@/services/firebase/config'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import type { Comment } from '@/types/comment.types'

export function useComments(eventId?: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!db) {
      console.warn('Firestore가 초기화되지 않았습니다.')
      setLoading(false)
      return
    }

    const commentsRef = collection(db, 'comments')
    let q = query(commentsRef, orderBy('createdAt', 'desc'), limit(50))

    if (eventId) {
      q = query(commentsRef, where('eventId', '==', eventId), orderBy('createdAt', 'desc'))
    }

    // 실시간 리스너 설정
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toMillis(),
          } as Comment
        })
        setComments(commentsData)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('댓글 실시간 업데이트 실패:', err)
        setError(err as Error)
        setLoading(false)
      }
    )

    // 컴포넌트 언마운트 시 리스너 정리
    return () => unsubscribe()
  }, [eventId])

  return {
    comments,
    loading,
    error,
  }
}
