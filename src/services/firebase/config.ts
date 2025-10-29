/**
 * Firebase 초기화 설정
 *
 * 환경 변수에서 Firebase 설정을 가져와 초기화합니다.
 * .env 파일에 Firebase 프로젝트 설정을 입력해야 합니다.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getDatabase, Database } from 'firebase/database'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

// Firebase 설정 검증
function validateFirebaseConfig() {
  const required = ['apiKey', 'authDomain', 'projectId', 'appId']
  const missing = required.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

  if (missing.length > 0) {
    console.warn('⚠️ Firebase 설정이 완전하지 않습니다. 누락된 항목:', missing.join(', '))
    return false
  }

  return true
}

// Firebase 앱 초기화
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let rtdb: Database | null = null
let storage: FirebaseStorage | null = null

try {
  const isValid = validateFirebaseConfig()

  if (isValid) {
    // 이미 초기화된 앱이 있는지 확인
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
      console.log('✅ Firebase 초기화 성공')
    } else {
      app = getApps()[0]
      console.log('✅ 기존 Firebase 앱 사용')
    }

    // 서비스 인스턴스 생성
    auth = getAuth(app)
    db = getFirestore(app)
    rtdb = getDatabase(app)
    storage = getStorage(app)
  } else {
    console.warn('⚠️ Firebase가 초기화되지 않았습니다. .env 파일을 확인하세요.')
  }
} catch (error) {
  console.error('❌ Firebase 초기화 실패:', error)
}

// 안전한 내보내기 (null 가능)
export { app, auth, db, rtdb, storage }

// Firebase 사용 가능 여부 확인 함수
export function isFirebaseAvailable(): boolean {
  return app !== null && auth !== null && db !== null
}
