/**
 * Firebase 초기화 설정
 *
 * 환경 변수에서 Firebase 설정을 가져와 초기화합니다.
 * .env 파일에 Firebase 프로젝트 설정을 입력해야 합니다.
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

// Firebase 초기화
export const app = initializeApp(firebaseConfig)

// 서비스 인스턴스
export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
