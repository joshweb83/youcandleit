# 🔥 Firebase 백엔드 가이드

이 문서는 Firebase 백엔드 설정 및 사용에 대한 상세 가이드입니다.

---

## 📋 목차

1. [Firebase 개요](#1-firebase-개요)
2. [데이터베이스 구조](#2-데이터베이스-구조)
3. [보안 규칙](#3-보안-규칙)
4. [Firebase 서비스 설정](#4-firebase-서비스-설정)
5. [데이터 CRUD 예시](#5-데이터-crud-예시)
6. [실시간 데이터 동기화](#6-실시간-데이터-동기화)
7. [비용 최적화](#7-비용-최적화)

---

## 1. Firebase 개요

### 1.1 사용하는 Firebase 서비스

| 서비스 | 용도 | Phase |
|--------|------|-------|
| **Authentication** | Google 로그인 | Phase 2 |
| **Firestore** | 집회, 사용자, 댓글 데이터 | Phase 2 |
| **Realtime Database** | 실시간 촛불 위치 | Phase 3 |
| **Storage** | 이미지 저장 | Phase 4 |
| **Cloud Messaging** | 푸시 알림 | Phase 4 |
| **Hosting** | 웹 호스팅 (선택) | Phase 2 |

### 1.2 무료 플랜 제한 (Spark Plan)

- Firestore: 1GB 저장, 50K 읽기/일, 20K 쓰기/일
- Realtime Database: 1GB 저장, 10GB 다운로드/월
- Authentication: 무제한 (Google 로그인)
- Storage: 5GB 저장, 1GB 다운로드/일

**초기 개발에 충분합니다!**

---

## 2. 데이터베이스 구조

### 2.1 Firestore Collections

#### 📍 events (집회)

```typescript
// Collection: events
// Document ID: 자동 생성

{
  id: string                    // Firestore 문서 ID
  title: string                 // "기후정의를 위한 집회"
  description: string           // 상세 설명 (마크다운 지원)
  summary: string               // 한 줄 요약 (목록용)

  location: {
    address: string             // "서울시 종로구 청계천로 1"
    coordinates: {
      lat: number               // 37.5665
      lng: number               // 126.9780
    }
    radius: number              // GPS 인증 반경 (미터, 기본 100)
  }

  datetime: {
    start: Timestamp            // 시작 시간
    end: Timestamp              // 종료 시간
  }

  organizer: string             // 주최자 이름
  liveStreamUrl: string | null  // YouTube Live URL
  tags: string[]                // ["환경", "기후정의"]

  status: 'scheduled' | 'ongoing' | 'ended'

  // 통계 (자동 업데이트)
  participantCount: number      // 현장 참여자 수
  remoteCount: number           // 원격 참여자 수 (댓글 작성자)

  // 메타데이터
  createdAt: Timestamp
  createdBy: string             // 생성한 관리자 UID
  updatedAt: Timestamp
}
```

**인덱스 필요**:
- `status` + `datetime.start` (내림차순)
- `tags` + `datetime.start` (내림차순)

#### 👤 users (사용자)

```typescript
// Collection: users
// Document ID: Firebase Auth UID

{
  uid: string                   // Firebase Auth UID
  email: string                 // user@example.com
  displayName: string           // 사용자 설정 닉네임
  photoURL: string | null       // Google 프로필 사진 URL

  role: 'user' | 'admin'        // 권한

  settings: {
    autoEnableGPS: boolean      // 집회 상세 진입 시 GPS 자동 켜기
    language: 'ko' | 'en' | 'zh' | 'ja' | 'es'
    notifications: boolean      // 푸시 알림 동의
  }

  stats: {
    eventsAttended: number      // 참여한 집회 수
    commentsPosted: number      // 작성한 댓글 수
  }

  favorites: string[]           // 즐겨찾기한 집회 ID 배열

  // 메타데이터
  createdAt: Timestamp
  lastLoginAt: Timestamp
}
```

#### 💬 comments (댓글)

```typescript
// Collection: comments
// Document ID: 자동 생성

{
  id: string
  eventId: string               // 집회 ID (외래키)
  userId: string                // 작성자 UID
  userName: string              // 작성자 닉네임 (캐시, 성능 최적화)

  content: string               // 댓글 내용
  isRemote: boolean             // 원격 참여 여부
  isAIGenerated: boolean        // AI가 생성한 댓글인지

  likes: number                 // 공감 수

  createdAt: Timestamp
}
```

**인덱스 필요**:
- `eventId` + `createdAt` (내림차순)

### 2.2 Realtime Database 구조

```json
{
  "candles": {
    "{eventId}": {
      "{userId}": {
        "userId": "abc123",
        "eventId": "event456",
        "type": "onsite",        // or "remote"
        "location": {            // onsite만 해당
          "lat": 37.5665,
          "lng": 126.9780
        },
        "timestamp": 1698765432000,
        ".expires": 1698765732000  // TTL: 5분 후 자동 삭제
      }
    }
  }
}
```

**TTL 설정**: 촛불 데이터는 5분 후 자동 삭제되어 실시간성 유지

---

## 3. 보안 규칙

### 3.1 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 헬퍼 함수
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 집회 (events)
    match /events/{eventId} {
      // 모두 읽기 가능
      allow read: if true;

      // 관리자만 생성/수정/삭제
      allow create, update, delete: if isAdmin();
    }

    // 사용자 (users)
    match /users/{userId} {
      // 본인 또는 관리자만 읽기
      allow read: if isSignedIn();

      // 본인만 수정
      allow update: if isOwner(userId);

      // 회원가입 시 자동 생성
      allow create: if isSignedIn() && isOwner(userId);
    }

    // 댓글 (comments)
    match /comments/{commentId} {
      // 모두 읽기 가능
      allow read: if true;

      // 로그인 사용자만 생성
      allow create: if isSignedIn();

      // 작성자만 삭제
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```

### 3.2 Realtime Database Security Rules

```json
{
  "rules": {
    "candles": {
      "$eventId": {
        "$userId": {
          ".read": true,
          ".write": "$userId === auth.uid",
          ".validate": "newData.hasChildren(['userId', 'eventId', 'type', 'timestamp'])"
        }
      }
    }
  }
}
```

---

## 4. Firebase 서비스 설정

### 4.1 Firebase 초기화

```typescript
// src/services/firebase/config.ts

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
```

### 4.2 Authentication 서비스

```typescript
// src/services/firebase/auth.ts

import { auth } from './config'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Google 로그인 실패:', error)
    throw error
  }
}

export async function logout() {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('로그아웃 실패:', error)
    throw error
  }
}
```

---

## 5. 데이터 CRUD 예시

### 5.1 집회 조회

```typescript
// src/services/firebase/firestore.ts

import { db } from './config'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { Event } from '@/types/event.types'

export async function fetchEvents(status?: string): Promise<Event[]> {
  const eventsRef = collection(db, 'events')

  let q = query(eventsRef, orderBy('datetime.start', 'desc'))

  if (status) {
    q = query(q, where('status', '==', status))
  }

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    datetime: {
      start: doc.data().datetime.start.toDate(),
      end: doc.data().datetime.end.toDate(),
    },
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Event[]
}
```

### 5.2 집회 생성 (관리자만)

```typescript
import { addDoc, collection, Timestamp } from 'firebase/firestore'

export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
  const eventsRef = collection(db, 'events')

  const docRef = await addDoc(eventsRef, {
    ...eventData,
    datetime: {
      start: Timestamp.fromDate(eventData.datetime.start),
      end: Timestamp.fromDate(eventData.datetime.end),
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })

  return docRef.id
}
```

### 5.3 댓글 작성

```typescript
export async function createComment(commentData: {
  eventId: string
  userId: string
  userName: string
  content: string
  isRemote: boolean
}) {
  const commentsRef = collection(db, 'comments')

  await addDoc(commentsRef, {
    ...commentData,
    isAIGenerated: false,
    likes: 0,
    createdAt: Timestamp.now(),
  })
}
```

---

## 6. 실시간 데이터 동기화

### 6.1 실시간 촛불 업데이트

```typescript
// src/services/firebase/realtime.ts

import { rtdb } from './config'
import { ref, set, onValue, off } from 'firebase/database'

export function updateCandle(eventId: string, userId: string, data: {
  type: 'onsite' | 'remote'
  location?: { lat: number; lng: number }
}) {
  const candleRef = ref(rtdb, `candles/${eventId}/${userId}`)

  set(candleRef, {
    userId,
    eventId,
    ...data,
    timestamp: Date.now(),
    '.expires': Date.now() + 5 * 60 * 1000, // 5분 TTL
  })
}

export function subscribeToCandles(
  eventId: string,
  callback: (candles: any[]) => void
) {
  const candlesRef = ref(rtdb, `candles/${eventId}`)

  onValue(candlesRef, (snapshot) => {
    const data = snapshot.val()
    const candles = data ? Object.values(data) : []
    callback(candles)
  })

  // 클린업 함수 반환
  return () => off(candlesRef)
}
```

### 6.2 React Hook으로 사용

```typescript
// src/hooks/useCandles.ts

import { useState, useEffect } from 'react'
import { subscribeToCandles } from '@/services/firebase/realtime'

export function useCandles(eventId: string) {
  const [candles, setCandles] = useState([])

  useEffect(() => {
    const unsubscribe = subscribeToCandles(eventId, setCandles)
    return unsubscribe
  }, [eventId])

  return candles
}
```

---

## 7. 비용 최적화

### 7.1 읽기 최소화

```typescript
// ❌ 나쁜 예: 매번 전체 조회
function EventList() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents().then(setEvents) // 렌더링마다 조회
  })
}

// ✅ 좋은 예: 캐싱 사용
function EventList() {
  const { events } = useEvents() // 커스텀 훅에서 캐싱
}
```

### 7.2 복합 쿼리 대신 클라이언트 필터링

```typescript
// Firestore 복합 쿼리는 인덱스 필요 (비용 증가)
// 간단한 필터링은 클라이언트에서 처리

const events = await fetchEvents()
const filteredEvents = events.filter(e => e.tags.includes('환경'))
```

### 7.3 Pagination

```typescript
import { query, limit, startAfter, getDocs } from 'firebase/firestore'

let lastVisible = null

export async function fetchEventsPage(pageSize = 10) {
  let q = query(
    collection(db, 'events'),
    orderBy('datetime.start', 'desc'),
    limit(pageSize)
  )

  if (lastVisible) {
    q = query(q, startAfter(lastVisible))
  }

  const snapshot = await getDocs(q)
  lastVisible = snapshot.docs[snapshot.docs.length - 1]

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

---

## 8. 모니터링

Firebase Console에서 모니터링:

1. **Usage**: 읽기/쓰기/삭제 횟수 확인
2. **Performance**: 느린 쿼리 식별
3. **Realtime Database**: 동시 연결 수 확인

**알림 설정**: 무료 할당량 80% 도달 시 이메일 알림

---

## 9. 마이그레이션 (Firestore → PostgreSQL)

추후 사용자가 많아지면 PostgreSQL로 마이그레이션 고려:

- Supabase (PostgreSQL + Firebase 유사 기능)
- 비용 효율적
- SQL 쿼리 강력함

마이그레이션 도구: `firestore-to-postgres-sync`

---

**Firebase를 효과적으로 활용하여 빠르게 개발하세요!** 🔥
