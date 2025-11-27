# 📊 Youcandleit 프로젝트 현황 보고서

**생성일**: 2025-10-30
**브랜치**: `claude/bottom-sheet-and-sample-data-011CUbS6qeasYgmgvzX53B6J`
**마지막 커밋**: `20abefc`

---

## 🎯 프로젝트 개요

**Youcandleit**는 촛불집회와 시민 참여를 지원하는 웹 플랫폼입니다.
- 실시간 지도 기반 집회 정보 제공
- GPS 기반 현장 참여 인증
- 온라인/오프라인 참여자 연결
- 라이브 스트리밍 및 댓글 기능

---

## ✅ 완료된 주요 기능

### 1. 핵심 기능 ⭐
- ✅ **Firebase 통합**: Authentication, Firestore, Realtime Database
- ✅ **지도 시각화**: Leaflet 기반 인터랙티브 지도
- ✅ **GPS 위치 추적**: 현장 참여자 실시간 위치 표시
- ✅ **실시간 데이터**: Firebase Realtime Database로 참여자 수 실시간 업데이트
- ✅ **다국어 지원**: i18next 기반 (한국어, 영어)

### 2. 지도 기능 🗺️
- ✅ **4가지 지도 타일**: Dark, Light, Standard, Voyager
- ✅ **참여자 마커**:
  - 체크인 (GPS 인증) - 노란색 큰 마커
  - 촛불 (현장/원격) - 노란색/파란색 중간 마커
  - 댓글 (온라인) - 파란색 작은 마커
- ✅ **이벤트 반경 표시**: GPS 인증 범위 시각화
- ✅ **하단 슬라이드 패널**: 드래그 가능한 집회 목록
  - 3단계: Collapsed (8vh) → Peek (35vh) → Expanded (85vh)
  - 카드 클릭 시 지도 이동 & 줌

### 3. 이벤트 상세 페이지 📺
- ✅ **포스터 이미지**: 집회 홍보 이미지 표시
- ✅ **YouTube 라이브**: 실시간 스트리밍 임베드
- ✅ **라이브 채팅**: YouTube 채팅 임베드
- ✅ **위치 지도**: 소형 지도로 위치 표시
- ✅ **참여 버튼**: 현장/원격 참여 선택
- ✅ **댓글 시스템**: 실시간 댓글 업데이트

### 4. UI/UX 개선 ✨
- ✅ **햄버거 메뉴**: 오버레이 네비게이션
- ✅ **FAB 버튼**: 모바일 최적화 크기
- ✅ **언어 선택**: 메뉴에서 언어 변경
- ✅ **반응형 디자인**: 모바일/데스크톱 대응
- ✅ **다크 모드 테마**: Tailwind CSS 기반

### 5. 개발자 도구 🛠️
- ✅ **샘플 데이터 생성**: GPS 좌표 자동 생성
- ✅ **개발자 도구 페이지**: `/dev-tools`
- ✅ **주소 검색**: Juso API 연동
- ✅ **테스트 스크립트**: 수동 테스트용

---

## 📦 프로젝트 구조

```
youcandleit/
├── src/
│   ├── components/          # UI 컴포넌트
│   │   ├── map/            # 지도 관련 (MapView, BottomSheet, EventCardCompact)
│   │   ├── layout/         # 레이아웃 (MainLayout, MenuOverlay)
│   │   ├── common/         # 공통 컴포넌트
│   │   ├── comment/        # 댓글 시스템
│   │   └── address/        # 주소 검색
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── MapPage.tsx            # 메인 지도 페이지
│   │   ├── EventDetailPage.tsx    # 이벤트 상세
│   │   ├── EventListPage.tsx      # 집회 목록
│   │   ├── LivePage.tsx           # 라이브 페이지
│   │   ├── CommunityPage.tsx      # 커뮤니티
│   │   ├── MyPage.tsx             # 마이 페이지
│   │   ├── AdminEventCreatePage.tsx  # 집회 생성
│   │   └── DevToolsPage.tsx       # 개발자 도구
│   ├── hooks/              # Custom Hooks
│   │   ├── useAuth.ts             # 인증
│   │   ├── useEvents.ts           # 이벤트 데이터
│   │   ├── useCandles.ts          # 참여자 데이터
│   │   ├── useComments.ts         # 댓글
│   │   ├── useGeolocation.ts      # GPS 위치
│   │   └── useFavorites.ts        # 즐겨찾기
│   ├── services/           # 외부 서비스
│   │   ├── firebase/       # Firebase 설정 및 API
│   │   ├── gemini/         # Google Gemini AI
│   │   ├── juso/           # 주소 검색 API
│   │   └── weather/        # 날씨 API
│   ├── scripts/            # 유틸리티 스크립트
│   │   ├── generateSampleParticipants.ts
│   │   └── addSampleDataToFirebase.ts
│   ├── types/              # TypeScript 타입 정의
│   ├── i18n/               # 다국어 설정
│   └── App.tsx             # 메인 앱
├── public/                 # 정적 파일
├── dist/                   # 빌드 결과물
├── vercel.json             # Vercel 설정
├── package.json            # 의존성
└── tsconfig.json           # TypeScript 설정
```

**총 파일 수**: 47개의 TypeScript/TSX 파일

---

## 🔧 기술 스택

### Frontend
- **Framework**: React 19.2.0 + TypeScript 5.9.3
- **Build Tool**: Vite 7.1.12
- **Styling**: Tailwind CSS 3.4.18
- **Routing**: React Router DOM 7.9.4
- **State Management**: React Hooks

### Backend Services
- **Firebase**:
  - Authentication (Google 로그인)
  - Firestore (이벤트, 댓글, 체크인)
  - Realtime Database (촛불 실시간 데이터)
- **Google Gemini AI**: AI 기반 기능
- **Juso API**: 도로명 주소 검색

### 지도 & 위치
- **Leaflet** 1.9.4: 지도 라이브러리
- **React Leaflet** 5.0.0: React 래퍼
- **Geolocation API**: 브라우저 GPS

### 다국어
- **i18next** 25.6.0
- **react-i18next** 16.2.0
- **i18next-browser-languagedetector** 8.2.0

### UI 라이브러리
- **lucide-react** 0.548.0: 아이콘

---

## 🐛 알려진 이슈 및 제한사항

### 경고 ⚠️
1. **번들 크기**: index.js가 947KB로 500KB 제한 초과
   - 권장: dynamic import()로 코드 스플리팅
   - 권장: rollupOptions.output.manualChunks 설정

2. **TODO 항목**:
   - `src/services/juso/api.ts:108`: 카카오 맵/Google Geocoding API 연동 검토

### 제한사항 🚫
1. **Firebase 설정 필요**:
   - `.env` 파일에 Firebase 환경 변수 설정 필수
   - Vercel 배포 시 환경 변수 추가 필요

2. **샘플 데이터**:
   - `generateSampleParticipants.ts`의 `SAMPLE_EVENTS` 배열을 실제 이벤트 ID로 수정 필요

3. **API 키**:
   - Juso API 키 필요
   - Google Gemini API 키 필요 (선택)

---

## 🔍 코드 품질

### 빌드 상태
- ✅ **TypeScript 컴파일**: 성공
- ✅ **Vite 빌드**: 성공
- ⚠️ **번들 크기**: 경고 (947KB)

### 코드 스타일
- ✅ ESLint 설정
- ✅ Prettier 설정
- ✅ TypeScript strict 모드

### 테스트
- ⚠️ 단위 테스트 미구현
- ⚠️ E2E 테스트 미구현
- ✅ 수동 테스트 스크립트 제공

---

## 📈 성능 최적화

### 완료 ✅
- Code splitting (React.lazy)
- 이미지 최적화 (onError 핸들링)
- Firebase 실시간 리스너 정리
- Memoization (일부 컴포넌트)

### 필요 ⚠️
- Bundle size 최적화
- 이미지 압축 및 WebP 변환
- Service Worker (PWA)
- 더 많은 컴포넌트 memoization

---

## 🚀 배포 상태

### 현재 상황
- ✅ GitHub에 푸시 완료
- ✅ Vercel 설정 파일 준비
- ⏳ PR 생성 대기 중
- ⏳ Vercel 배포 대기 중

### 배포 준비사항
1. **GitHub PR 생성**:
   ```
   https://github.com/joshweb83/youcandleit/pull/new/claude/bottom-sheet-and-sample-data-011CUbS6qeasYgmgvzX53B6J
   ```

2. **Vercel 환경 변수 설정**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_URL`

3. **도메인 설정** (선택):
   - 커스텀 도메인 연결

---

## 📊 프로젝트 통계

- **총 커밋**: 20+
- **총 파일**: 47개 (TypeScript/TSX)
- **총 라인**: ~15,000줄 (추정)
- **빌드 시간**: ~10초
- **번들 크기**:
  - CSS: 44.22 KB (gzip: 12.19 KB)
  - JS: 947.24 KB (gzip: 248.10 KB)

---

## 👥 기여자

- **Claude Code** (AI Assistant)
- **joshweb83** (프로젝트 소유자)

---

## 📄 라이센스

ISC License

---

**마지막 업데이트**: 2025-10-30
**버전**: 0.1.0
