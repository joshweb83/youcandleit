/**
 * useAuth 커스텀 훅
 *
 * Firebase Authentication 상태를 관리합니다.
 */

import { useState, useEffect } from 'react'
import { auth } from '@/services/firebase/config'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { signInWithGoogle, signOut, getUserData } from '@/services/firebase/auth'
import type { User } from '@/types/user.types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // Firestore에서 사용자 상세 정보 가져오기
        const userData = await getUserData(firebaseUser.uid)
        setUser(userData)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('로그아웃 실패:', error)
      throw error
    }
  }

  return {
    user,
    firebaseUser,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }
}
