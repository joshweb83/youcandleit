/**
 * Firebase Authentication 서비스
 *
 * Google 로그인 및 로그아웃 기능을 제공합니다.
 */

import { auth, db } from './config'
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import type { User, UserInput } from '@/types/user.types'

const googleProvider = new GoogleAuthProvider()

/**
 * Google 로그인
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Firestore에 사용자 정보 저장/업데이트
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // 신규 사용자 - 기본 정보 생성
      const newUser: UserInput = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '익명',
        photoURL: user.photoURL || undefined,
        role: 'user',
        settings: {
          autoEnableGPS: false,
          language: 'ko',
          notifications: false,
        },
        favorites: [],
      }

      await setDoc(userRef, {
        ...newUser,
        stats: {
          eventsAttended: 0,
          commentsPosted: 0,
        },
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      })
    } else {
      // 기존 사용자 - 마지막 로그인 시간 업데이트
      await setDoc(
        userRef,
        {
          lastLoginAt: Timestamp.now(),
        },
        { merge: true }
      )
    }

    return user
  } catch (error) {
    console.error('Google 로그인 실패:', error)
    throw error
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('로그아웃 실패:', error)
    throw error
  }
}

/**
 * 사용자 정보 가져오기
 */
export async function getUserData(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const data = userSnap.data()
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        lastLoginAt: data.lastLoginAt.toDate(),
      } as User
    }

    return null
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error)
    return null
  }
}
