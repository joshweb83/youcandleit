/**
 * useFavorites 커스텀 훅
 *
 * 즐겨찾기 상태 및 토글 기능을 관리합니다.
 * 로그인한 사용자는 Firestore에, 익명 사용자는 localStorage에 저장됩니다.
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { addFavorite, removeFavorite, fetchFavoriteEvents } from '@/services/firebase/firestore'
import type { Event } from '@/types/event.types'

const FAVORITES_STORAGE_KEY = 'youcandleit_favorites'

export function useFavorites() {
  const { user, isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  // 사용자의 즐겨찾기 목록 로드
  useEffect(() => {
    if (isAuthenticated && user?.favorites) {
      // 로그인한 사용자: Firestore에서 가져오기
      setFavorites(user.favorites)
    } else {
      // 익명 사용자: localStorage에서 가져오기
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (stored) {
          setFavorites(JSON.parse(stored))
        } else {
          setFavorites([])
        }
      } catch (error) {
        console.error('즐겨찾기 로드 실패:', error)
        setFavorites([])
      }
    }
  }, [user, isAuthenticated])

  // 즐겨찾기 집회 목록 가져오기
  const loadFavoriteEvents = useCallback(async () => {
    if (favorites.length === 0) {
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
  }, [favorites])

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(
    async (eventId: string) => {
      const isFavorite = favorites.includes(eventId)

      try {
        if (isAuthenticated && user) {
          // 로그인한 사용자: Firestore에 저장
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
        } else {
          // 익명 사용자: localStorage에 저장
          let newFavorites: string[]
          if (isFavorite) {
            newFavorites = favorites.filter((id) => id !== eventId)
          } else {
            newFavorites = [...favorites, eventId]
          }
          setFavorites(newFavorites)
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
        }
      } catch (error) {
        console.error('즐겨찾기 토글 실패:', error)
        alert('즐겨찾기 처리 중 오류가 발생했습니다.')
      }
    },
    [user, isAuthenticated, favorites]
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
