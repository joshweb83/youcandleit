# 👨‍💻 Youcandle it - 개발 가이드

이 문서는 프로젝트에 기여하거나 유지보수하는 개발자를 위한 가이드입니다.

---

## 📋 목차

1. [코드 규칙](#1-코드-규칙)
2. [폴더 구조](#2-폴더-구조)
3. [컴포넌트 작성 가이드](#3-컴포넌트-작성-가이드)
4. [상태 관리](#4-상태-관리)
5. [타입 정의](#5-타입-정의)
6. [다국어 추가](#6-다국어-추가)
7. [Git 워크플로우](#7-git-워크플로우)
8. [테스트](#8-테스트)
9. [배포](#9-배포)

---

## 1. 코드 규칙

### 1.1 코딩 스타일

프로젝트는 **ESLint**와 **Prettier**를 사용합니다.

#### 자동 포맷팅

코드 저장 시 자동으로 포맷팅되도록 VS Code 설정:

`.vscode/settings.json` 생성:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### 수동 포맷팅

```bash
# 코드 린팅 (오류 확인)
npm run lint

# 코드 포맷팅 (자동 수정)
npx prettier --write .
```

### 1.2 명명 규칙

#### 파일명
- **컴포넌트**: PascalCase (예: `EventCard.tsx`)
- **유틸리티**: camelCase (예: `formatDate.ts`)
- **타입**: PascalCase (예: `Event.types.ts`)
- **훅**: camelCase, use로 시작 (예: `useAuth.ts`)

#### 변수/함수명
```typescript
// 변수: camelCase
const userName = 'John'
const eventList = []

// 상수: UPPER_SNAKE_CASE
const MAX_CANDLES = 1000
const API_BASE_URL = 'https://api.example.com'

// 함수: camelCase, 동사로 시작
function fetchEvents() {}
function handleClick() {}

// 컴포넌트: PascalCase
function EventCard() {}

// 타입/인터페이스: PascalCase, I 접두사 사용 안 함
interface Event {}
type UserRole = 'admin' | 'user'
```

### 1.3 주석 규칙

```typescript
/**
 * 집회 데이터를 Firestore에서 가져옵니다.
 * @param eventId - 집회 ID
 * @returns 집회 객체
 */
async function fetchEvent(eventId: string): Promise<Event> {
  // TODO: 에러 핸들링 추가
  const doc = await db.collection('events').doc(eventId).get()
  return doc.data() as Event
}

// FIXME: 성능 개선 필요
// NOTE: 이 로직은 Phase 3에서 리팩토링 예정
```

---

## 2. 폴더 구조

```
src/
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── common/          # 공통 컴포넌트 (Button, Input 등)
│   ├── event/           # 집회 관련 컴포넌트
│   ├── map/             # 지도 관련 컴포넌트
│   ├── candle/          # 촛불 관련 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트
│
├── pages/               # 페이지 컴포넌트 (라우트별)
│   ├── MapPage.tsx      # 지도 페이지
│   ├── EventListPage.tsx
│   ├── EventDetailPage.tsx
│   ├── LivePage.tsx
│   ├── CommunityPage.tsx
│   └── MyPage.tsx
│
├── services/            # API 및 외부 서비스
│   ├── firebase/       # Firebase 관련
│   │   ├── config.ts   # Firebase 초기화
│   │   ├── auth.ts     # 인증 서비스
│   │   ├── firestore.ts # Firestore 서비스
│   │   └── realtime.ts # Realtime Database
│   ├── gemini/         # Gemini AI
│   │   └── api.ts
│   └── weather/        # 날씨 API
│       └── api.ts
│
├── hooks/               # 커스텀 React Hooks
│   ├── useAuth.ts      # 인증 상태
│   ├── useEvents.ts    # 집회 데이터
│   ├── useLocation.ts  # GPS 위치
│   └── useCandles.ts   # 실시간 촛불
│
├── types/               # TypeScript 타입 정의
│   ├── event.types.ts
│   ├── user.types.ts
│   ├── comment.types.ts
│   └── candle.types.ts
│
├── utils/               # 유틸리티 함수
│   ├── date.ts         # 날짜 포맷팅
│   ├── location.ts     # 위치 계산
│   └── constants.ts    # 상수 정의
│
├── i18n/                # 다국어
│   ├── config.ts       # i18n 설정
│   └── locales/        # 번역 파일
│       ├── ko.json
│       └── en.json
│
├── assets/              # 정적 리소스
│   ├── images/
│   └── icons/
│
├── App.tsx              # 메인 앱
├── main.tsx             # 엔트리 포인트
└── index.css            # 글로벌 스타일
```

---

## 3. 컴포넌트 작성 가이드

### 3.1 기본 템플릿

```typescript
// src/components/event/EventCard.tsx

import { useTranslation } from 'react-i18next'
import { Event } from '@/types/event.types'

interface EventCardProps {
  event: Event
  onFavorite?: (eventId: string) => void
}

/**
 * 집회 카드 컴포넌트
 *
 * 집회 목록에서 사용되는 카드 UI를 렌더링합니다.
 */
export function EventCard({ event, onFavorite }: EventCardProps) {
  const { t } = useTranslation()

  const handleFavoriteClick = () => {
    onFavorite?.(event.id)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
      <h3 className="text-lg font-bold text-white">{event.title}</h3>
      <p className="text-gray-300 mt-2">{event.summary}</p>
      <button
        onClick={handleFavoriteClick}
        className="mt-4 text-yellow-500 hover:text-yellow-400"
      >
        {t('event.favorite')}
      </button>
    </div>
  )
}
```

### 3.2 컴포넌트 작성 원칙

1. **단일 책임 원칙**: 한 컴포넌트는 한 가지 일만 합니다
2. **재사용성**: 공통 컴포넌트는 `components/common/` 에 위치
3. **Props 타입 정의**: 모든 props에 TypeScript 타입 지정
4. **다국어**: 모든 텍스트는 `t()` 함수 사용
5. **접근성**: ARIA 속성 추가

### 3.3 Hooks 사용 예시

```typescript
// src/hooks/useEvents.ts

import { useState, useEffect } from 'react'
import { Event } from '@/types/event.types'
import { fetchEvents } from '@/services/firebase/firestore'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await fetchEvents()
        setEvents(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  return { events, loading, error }
}
```

---

## 4. 상태 관리

### 4.1 로컬 상태 (useState)

간단한 UI 상태는 `useState` 사용:

```typescript
const [isOpen, setIsOpen] = useState(false)
const [count, setCount] = useState(0)
```

### 4.2 전역 상태 (Context API)

인증, 다국어 등 전역 상태는 Context 사용:

```typescript
// src/contexts/AuthContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react'
import { User } from '@/types/user.types'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (user: User) => setUser(user)
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## 5. 타입 정의

### 5.1 타입 파일 예시

```typescript
// src/types/event.types.ts

export type EventStatus = 'scheduled' | 'ongoing' | 'ended'

export interface EventLocation {
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  radius: number
}

export interface Event {
  id: string
  title: string
  description: string
  summary: string
  location: EventLocation
  datetime: {
    start: Date
    end: Date
  }
  organizer: string
  liveStreamUrl?: string
  tags: string[]
  status: EventStatus
  participantCount: number
  remoteCount: number
  createdAt: Date
  createdBy: string
  updatedAt: Date
}
```

### 5.2 타입 재사용

```typescript
// Partial 사용 (일부 필드만 필요할 때)
type EventUpdate = Partial<Event>

// Pick 사용 (특정 필드만 선택)
type EventSummary = Pick<Event, 'id' | 'title' | 'datetime'>

// Omit 사용 (특정 필드 제외)
type EventInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
```

---

## 6. 다국어 추가

### 6.1 번역 파일 수정

`src/i18n/locales/ko.json`:

```json
{
  "newFeature": {
    "title": "새로운 기능",
    "description": "멋진 새 기능입니다"
  }
}
```

`src/i18n/locales/en.json`:

```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is an awesome new feature"
  }
}
```

### 6.2 컴포넌트에서 사용

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('newFeature.title')}</h1>
      <p>{t('newFeature.description')}</p>
    </div>
  )
}
```

### 6.3 변수 포함

```json
{
  "greeting": "안녕하세요, {{name}}님!"
}
```

```typescript
t('greeting', { name: '홍길동' })
// 결과: "안녕하세요, 홍길동님!"
```

---

## 7. Git 워크플로우

### 7.1 브랜치 전략

```
main (프로덕션)
  ├── develop (개발 통합)
  │    ├── feature/map-view
  │    ├── feature/ai-integration
  │    └── feature/candle-visualization
  │
  └── hotfix/critical-bug
```

### 7.2 브랜치 네이밍

- `feature/기능명`: 새 기능 개발
- `bugfix/버그명`: 버그 수정
- `hotfix/긴급수정`: 프로덕션 긴급 수정
- `docs/문서명`: 문서 작업
- `refactor/리팩토링명`: 코드 리팩토링

### 7.3 커밋 메시지

```
type(scope): subject

body (선택)

footer (선택)
```

**타입**:
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 설정 변경

**예시**:
```
feat(map): Add real-time weather display

- Integrate wttr.in API
- Show weather icon on map
- Add Gemini AI weather advice

Closes #42
```

### 7.4 Pull Request

1. 기능 브랜치에서 개발
2. 커밋 및 푸시
3. GitHub에서 PR 생성
4. 코드 리뷰 후 `develop`에 병합

---

## 8. 테스트

### 8.1 테스트 라이브러리 설치 (Phase 2)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 8.2 테스트 작성 예시

```typescript
// src/components/event/EventCard.test.tsx

import { render, screen } from '@testing-library/react'
import { EventCard } from './EventCard'

describe('EventCard', () => {
  it('renders event title', () => {
    const mockEvent = {
      id: '1',
      title: '테스트 집회',
      summary: '설명',
      // ... 기타 필드
    }

    render(<EventCard event={mockEvent} />)

    expect(screen.getByText('테스트 집회')).toBeInTheDocument()
  })
})
```

---

## 9. 배포

### 9.1 Vercel 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 9.2 Firebase Hosting 배포

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 빌드
npm run build

# 배포
firebase deploy --only hosting
```

### 9.3 환경 변수 설정

Vercel Dashboard에서:
1. 프로젝트 > Settings > Environment Variables
2. 모든 `VITE_*` 환경 변수 추가

---

## 10. 성능 최적화

### 10.1 Code Splitting

```typescript
import { lazy, Suspense } from 'react'

const EventDetailPage = lazy(() => import('./pages/EventDetailPage'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventDetailPage />
    </Suspense>
  )
}
```

### 10.2 이미지 최적화

- 이미지는 WebP 포맷 사용
- `loading="lazy"` 속성 추가
- 적절한 크기로 리사이징

### 10.3 Lighthouse 점수 목표

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## 11. 도움이 필요하신가요?

- 📚 [React 공식 문서](https://react.dev/)
- 📘 [TypeScript 공식 문서](https://www.typescriptlang.org/)
- 🎨 [Tailwind CSS 공식 문서](https://tailwindcss.com/)
- 🔥 [Firebase 공식 문서](https://firebase.google.com/docs)

**Happy coding!** 🕯️✨
