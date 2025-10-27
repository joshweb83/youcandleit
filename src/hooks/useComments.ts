/**
 * useComments 커스텀 훅
 *
 * 댓글 데이터를 관리합니다.
 */

import { useState, useEffect } from 'react'
import { fetchComments } from '@/services/firebase/firestore'
import type { Comment } from '@/types/comment.types'

export function useComments(eventId?: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true)
        const data = await fetchComments(eventId)
        setComments(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [eventId])

  return {
    comments,
    loading,
    error,
    refetch: () => fetchComments(eventId).then(setComments),
  }
}
