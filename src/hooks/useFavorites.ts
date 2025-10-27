/**
 * useFavorites 커스텀 훅
 *
 * 즐겨찾기 상태 및 토글 기능을 관리합니다.
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { addFavorite, removeFavorite, fetchFavoriteEvents } from '@/services/firebase/firestore'
import type { Event } from '@/types/event.types'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  // 사용자의 즐겨찾기 목록 로드
  useEffect(() => {
    if (user?.favorites) {
      setFavorites(user.favorites)
    } else {
      setFavorites([])
    }
  }, [user])

  // 즐겨찾기 집회 목록 가져오기
  const loadFavoriteEvents = useCallback(async () => {
    if (!user || favorites.length === 0) {
      setFavoriteEvents([])
      return
    }

    setLoading(true)
    try {
      const events = await fetchFavoriteEvents(favorites)
      setFavoriteEvents(events)
    } catch (error) {
      console.error('즐겨찾기 집회 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [user, favorites])

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(
    async (eventId: string) => {
      if (!user) {
        alert('로그인이 필요합니다.')
        return
      }

      const isFavorite = favorites.includes(eventId)

      try {
        if (isFavorite) {
          const success = await removeFavorite(user.uid, eventId)
          if (success) {
            setFavorites((prev) => prev.filter((id) => id !== eventId))
          }
        } else {
          const success = await addFavorite(user.uid, eventId)
          if (success) {
            setFavorites((prev) => [...prev, eventId])
          }
        }
      } catch (error) {
        console.error('즐겨찾기 토글 실패:', error)
        alert('즐겨찾기 처리 중 오류가 발생했습니다.')
      }
    },
    [user, favorites]
  )

  // 특정 집회가 즐겨찾기인지 확인
  const isFavorite = useCallback(
    (eventId: string) => {
      return favorites.includes(eventId)
    },
    [favorites]
  )

  return {
    favorites,
    favoriteEvents,
    loading,
    toggleFavorite,
    isFavorite,
    loadFavoriteEvents,
  }
}
