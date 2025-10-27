# 🕯️ Youcandle it - 프로젝트 기획서

> "당신도 할 수 있습니다" - 촛불로 하나되는 시민 참여 플랫폼

## 📌 프로젝트 개요

### 프로젝트명
**Youcandle it** (유캔들잇)
- "You can do it" (당신도 할 수 있다) + "Candle" (촛불)의 합성어
- 시민 누구나 쉽게 집회에 참여하고 연대할 수 있다는 메시지

### 비전
평화로운 집회 참여를 더 쉽고 의미 있게 만드는 위치 기반 소셜 플랫폼

### 핵심 가치
- 🌍 **접근성**: 누구나 쉽게 집회 정보에 접근
- 🤝 **연대**: 현장/원격 참여자 모두를 포용
- 🔒 **안전**: 개인정보 보호 및 평화적 집회 지향
- 🌏 **글로벌**: 다국어 지원으로 전 세계 시민과 연결

---

## 🎯 타겟 사용자

### Primary (주요 타겟)
- 민주주의, 사회 문제에 관심 있는 20-40대 시민
- 집회에 참여하고 싶지만 정보를 찾기 어려운 사람
- 시간/거리 제약으로 현장 참여가 어려운 사람

### Secondary (부가 타겟)
- 집회 주최자 및 시민단체
- 언론 및 연구자
- 해외 거주 한인 및 국제 연대자

---

## 🚀 핵심 기능

### 1. 지도 기반 시각화 (Map View)
**목적**: 집회 정보를 직관적으로 표시

**기능**:
- 📍 진행 중/예정된 집회 위치 마커 표시
- 🌟 즐겨찾기한 집회 강조 표시
- 🌤️ 실시간 날씨 정보
- 🤖 Gemini AI 기반 날씨별 준비물 조언
- 📍 내 위치 표시 및 장소 검색

**차별화 포인트**:
- 실시간 GPS 기반 참여자 촛불 아이콘 시각화
- 현장 참여자와 원격 참여자를 다른 색상으로 구분 표시

### 2. 집회 목록 (Event List)
**목적**: 모든 집회 정보를 한눈에 파악

**기능**:
- 📅 시간순 정렬된 집회 목록
- 🔍 검색 기능 (키워드, 날짜, 지역)
- ⭐ 즐겨찾기 필터
- 📊 각 집회의 참여자 수 표시

### 3. 실시간 방송 (Live Page)
**목적**: 현장에 가지 못하는 사용자의 원격 참여 지원

**기능**:
- 📺 실시간 스트리밍 영상 (YouTube Live 임베드)
- 💬 실시간 댓글 스트림
- 🕯️ 원격 참여 시 촛불 아이콘 점등

### 4. 커뮤니티 (Community Page)
**목적**: 시민들 간 연대감 형성

**기능**:
- 💬 모든 집회의 응원 댓글 통합 피드
- 👍 댓글 공감 기능
- 🤖 AI 응원 메시지 생성 도우미

### 5. 내 정보 (My Page)
**목적**: 사용자 관리 및 개인화

**기능**:
- 🔐 Google 계정 로그인
- 👤 닉네임 설정
- ⚙️ 앱 설정 (GPS 자동 활성화 등)
- 📊 내 참여 통계 (참여한 집회 수, 작성한 댓글)
- 🏅 획득한 배지 (Phase 4)
- 🔑 관리자: 새 집회 등록 패널

---

## 🔥 차별화 기능 (Unique Features)

### 1. Digital Candlelight (디지털 촛불)
**현장 참여자**:
- GPS 인증으로 집회 반경 내 확인
- 지도에 노란색 촛불 🟡 아이콘 표시
- 실시간으로 군중 규모 시각화

**원격 참여자**:
- 응원 댓글 작성 시 하늘색 촛불 🔵 아이콘 표시
- "멀리서도 함께합니다" 메시지 전달

**효과**: 참여자에게 강한 소속감과 연대의식 제공

### 2. Gemini AI 통합
**AI 응원 메시지 생성**:
- 집회 주제에 맞는 격려 메시지 초안 제공
- 사용자는 수정하여 댓글 작성

**AI 집회 요약**:
- 각 집회의 의의와 배경을 AI가 요약
- 참여 독려 메시지 생성

**AI 날씨 조언**:
- 실시간 날씨 + 집회 시간을 분석
- "우산과 우비를 준비하세요" 같은 실용적 조언

**비용 절감 전략**:
- 응답 캐싱 (같은 질문 재사용)
- Rate Limiting (사용자당 일일 요청 제한)
- 템플릿 기반 응답 병행

### 3. 프라이버시 우선 설계
- 익명 참여 옵션
- 정확한 위치 대신 100m 반경으로 표시
- 위치 정보 실시간만 사용, 저장 안 함 옵션
- GDPR 및 개인정보보호법 준수

---

## 🛠️ 기술 스택

### Frontend
```
- React 18+ (UI 라이브러리)
- TypeScript (타입 안정성)
- Vite (빌드 도구, 빠른 개발 서버)
- Tailwind CSS (스타일링, 다크 테마)
- React Router (라우팅)
- react-i18next (다국어)
```

### 지도 & 위치
```
- Leaflet + React-Leaflet (무료 지도)
- OpenStreetMap (지도 타일)
- Geolocation API (GPS)
```

### 백엔드 & 데이터베이스
```
- Firebase Authentication (Google 로그인)
- Firebase Firestore (데이터베이스)
- Firebase Realtime Database (실시간 촛불 업데이트)
- Firebase Storage (이미지 저장, Phase 4)
- Firebase Cloud Messaging (푸시 알림, Phase 4)
```

### AI & 외부 서비스
```
- Google Gemini API (@google/genai)
- wttr.in (날씨 API, 무료)
- ip-api.com (IP 기반 위치 정보)
```

### 배포 & 호스팅
```
- Vercel 또는 Netlify (프론트엔드)
- Firebase Hosting (대안)
- GitHub Actions (CI/CD, Phase 3)
```

### 개발 도구
```
- ESLint (코드 품질)
- Prettier (코드 포맷팅)
- Git (버전 관리)
- VS Code (권장 에디터)
```

---

## 📊 데이터베이스 스키마 (Firebase Firestore)

### Collections

#### 1. events (집회)
```typescript
{
  id: string;                    // 자동 생성 ID
  title: string;                 // 집회명
  description: string;           // 상세 설명
  summary: string;               // 요약 (목록용)
  location: {
    address: string;             // 주소
    coordinates: {
      lat: number;
      lng: number;
    };
    radius: number;              // GPS 인증 반경 (미터)
  };
  datetime: {
    start: Timestamp;            // 시작 시간
    end: Timestamp;              // 종료 시간
  };
  organizer: string;             // 주최자
  liveStreamUrl?: string;        // 실시간 스트리밍 URL (옵션)
  tags: string[];                // 태그 (예: "환경", "노동")
  status: 'scheduled' | 'ongoing' | 'ended';
  participantCount: number;      // 현장 참여자 수 (실시간)
  remoteCount: number;           // 원격 참여자 수
  createdAt: Timestamp;
  createdBy: string;             // 생성한 관리자 UID
  updatedAt: Timestamp;
}
```

#### 2. users (사용자)
```typescript
{
  uid: string;                   // Firebase Auth UID
  email: string;
  displayName: string;           // 닉네임
  photoURL?: string;
  role: 'user' | 'admin';
  settings: {
    autoEnableGPS: boolean;
    language: 'ko' | 'en' | 'zh' | 'ja' | 'es';
    notifications: boolean;
  };
  stats: {
    eventsAttended: number;      // 참여한 집회 수
    commentsPosted: number;      // 작성한 댓글 수
  };
  favorites: string[];           // 즐겨찾기한 집회 ID 배열
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

#### 3. comments (댓글)
```typescript
{
  id: string;
  eventId: string;               // 집회 ID (외래키)
  userId: string;                // 작성자 UID
  userName: string;              // 작성자 닉네임 (캐시)
  content: string;               // 댓글 내용
  isRemote: boolean;             // 원격 참여 여부
  isAIGenerated: boolean;        // AI 생성 여부
  likes: number;                 // 공감 수
  createdAt: Timestamp;
}
```

#### 4. candles (촛불 - Realtime Database)
```typescript
// realtime-database/candles/{eventId}/{userId}
{
  userId: string;
  eventId: string;
  type: 'onsite' | 'remote';     // 현장 or 원격
  location?: {                   // 현장만 해당
    lat: number;
    lng: number;
  };
  timestamp: number;             // 마지막 업데이트 시간
  // TTL: 5분 (자동 삭제)
}
```

---

## 🎨 디자인 시스템

### 컬러 팔레트 (다크 테마)
```css
Primary (촛불):
- Yellow: #FCD34D (현장 참여 촛불)
- Blue: #60A5FA (원격 참여 촛불)

Background:
- Dark: #111827 (메인 배경)
- Card: #1F2937 (카드 배경)

Text:
- Primary: #F9FAFB (주요 텍스트)
- Secondary: #9CA3AF (부가 텍스트)

Accent:
- Success: #34D399 (성공)
- Warning: #FBBF24 (경고)
- Error: #F87171 (에러)
```

### 타이포그래피
```
- Heading: Pretendard Bold (한글), Inter Bold (영문)
- Body: Pretendard Regular, Inter Regular
- Code: Fira Code (개발 문서용)
```

### 아이콘
- 촛불: Custom SVG (노란색/파란색 그라데이션)
- UI 아이콘: Heroicons 또는 Lucide React

---

## 📱 반응형 디자인

### Breakpoints
```
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
```

### 화면별 레이아웃
**Mobile**:
- 하단 네비게이션 바 (5개 탭)
- 단일 컬럼 레이아웃

**Tablet**:
- 좌측 사이드바 네비게이션
- 2컬럼 레이아웃 (목록 + 상세)

**Desktop**:
- 좌측 사이드바
- 3컬럼 레이아웃 (네비게이션 + 지도 + 상세)

---

## 🔐 보안 & 법적 고려사항

### 보안
1. **Firebase Security Rules**:
   - 사용자는 자신의 데이터만 수정 가능
   - 관리자만 집회 생성 가능
   - 댓글 작성은 로그인 사용자만

2. **환경 변수**:
   - API 키는 .env에 저장, Git에 커밋 금지
   - 프로덕션과 개발 환경 분리

3. **Rate Limiting**:
   - Firebase App Check로 봇 방지
   - API 요청 제한 (Gemini AI)

### 법적 준수
1. **개인정보보호**:
   - GDPR 준수 (유럽 사용자)
   - 개인정보보호법 준수 (한국)
   - 위치 정보 수집 시 명시적 동의

2. **콘텐츠 관리**:
   - 이용약관: 평화적 집회만 등록 가능
   - 신고 시스템: 불법/폭력 콘텐츠 차단
   - 관리자 검토: 집회 등록 시 사전 승인 (옵션)

3. **면책 조항**:
   - 플랫폼은 정보 제공만, 집회 주최 책임 없음
   - 사용자가 올린 콘텐츠는 사용자 책임

---

## 📅 개발 로드맵

### Phase 1: 기반 구축 (2-3주)
✅ 프로젝트 세팅 (React, TypeScript, Tailwind)
✅ 다국어 시스템 (한/영)
✅ Firebase 백엔드 설정
✅ 문서화 (README, SETUP, DEVELOPMENT)

### Phase 2: MVP (1-2개월)
✅ 기본 UI (지도, 목록, 상세)
✅ Google 로그인
✅ 집회 CRUD (관리자)
✅ 기본 댓글 시스템
✅ 베타 배포

### Phase 3: 고도화 (2-3개월)
✅ GPS 촛불 시각화
✅ Gemini AI 통합
✅ 실시간 스트리밍
✅ 성능 최적화
✅ 보안 강화

### Phase 4: 확장 (3-6개월)
✅ 다국어 확장 (중/일/스페인어)
✅ 모바일 앱 (React Native)
✅ 푸시 알림
✅ 게이미피케이션
✅ 파트너십 & 공식 런칭

---

## 💰 예산 및 비용

### 무료 티어 활용
- Firebase: 무료 Spark 플랜 (초기 충분)
- Vercel/Netlify: 무료 호스팅
- Gemini API: 무료 할당량 활용
- wttr.in: 완전 무료

### 예상 월 비용 (성장 시)
- Firebase Blaze 플랜: $25-50/월 (1만 사용자 기준)
- Gemini API: $50-100/월 (캐싱 적용 시)
- 도메인: $12/년

**총 예상 비용**: $100-200/월 (1만 사용자 시)

### 수익화 전략
- 후원 모델 ("커피 한 잔" $3-5)
- 목표: 월 사용자 1%가 후원 시 수익 중립 달성

---

## 📈 성공 지표 (KPI)

### Phase 2 (MVP)
- 베타 테스터 100명 모집
- 집회 등록 10개
- 일평균 활성 사용자 50명

### Phase 3 (고도화)
- 월간 활성 사용자 1,000명
- 집회 등록 50개
- GPS 촛불 점등 500회

### Phase 4 (확장)
- 월간 활성 사용자 10,000명
- 다국어 사용자 20% 이상
- 모바일 앱 다운로드 5,000회

---

## 🤝 기여 및 협업

### 오픈소스 정책
- MIT License (검토 중)
- GitHub Public Repository
- 이슈 및 PR 환영

### 협업 대상
- 시민단체: 집회 정보 제공 파트너십
- 개발자: 오픈소스 기여자
- 디자이너: UI/UX 개선
- 번역가: 다국어 크라우드소싱

---

## 📞 연락처 및 링크

- **GitHub**: [추가 예정]
- **이메일**: [추가 예정]
- **Discord**: [추가 예정]

---

**작성일**: 2025-10-27
**버전**: 1.0.0
**작성자**: Claude Code
**최종 수정**: 2025-10-27
