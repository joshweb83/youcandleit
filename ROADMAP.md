# 🗺️ Youcandleit 개발 로드맵

**작성일**: 2025-10-30
**버전**: 0.1.0

---

## 🎯 단기 목표 (1-2주)

### 🔥 긴급 (High Priority)

#### 1. PR 생성 및 배포
- [ ] **PR 생성**
  - [ ] GitHub PR 생성: [링크](https://github.com/joshweb83/youcandleit/pull/new/claude/bottom-sheet-and-sample-data-011CUbS6qeasYgmgvzX53B6J)
  - [ ] PR 리뷰 요청
  - [ ] CI/CD 체크 통과 확인

- [ ] **Vercel 배포**
  - [ ] Vercel 프로젝트 연결
  - [ ] 환경 변수 설정 (Firebase)
  - [ ] 프리뷰 배포 확인
  - [ ] 프로덕션 배포 (PR 머지 후)

#### 2. Firebase 설정 완료
- [ ] **Firestore 규칙 설정**
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // 이벤트: 읽기는 모두, 쓰기는 인증된 사용자만
      match /events/{eventId} {
        allow read: if true;
        allow write: if request.auth != null;
      }

      // 댓글: 읽기는 모두, 쓰기는 인증된 사용자만
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.userId;
      }

      // 체크인: 읽기는 모두, 쓰기는 본인만
      match /checkIns/{checkInId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth.uid == resource.data.userId;
      }
    }
  }
  ```

- [ ] **Realtime Database 규칙 설정**
  ```json
  {
    "rules": {
      "candles": {
        "$eventId": {
          ".read": true,
          ".write": "auth != null"
        }
      }
    }
  }
  ```

- [ ] **Firebase Authentication 설정**
  - [ ] Google 로그인 활성화
  - [ ] 승인된 도메인 추가 (Vercel URL)

#### 3. 샘플 데이터 준비
- [ ] **Firebase에 샘플 이벤트 추가**
  - [ ] `SAMPLE_DATA.md`의 5개 샘플 이벤트를 Firestore에 추가
  - [ ] 실제 이벤트 ID 확인

- [ ] **샘플 참여자 생성**
  - [ ] `generateSampleParticipants.ts`의 `SAMPLE_EVENTS` 배열 수정
  - [ ] `/dev-tools` 페이지에서 샘플 참여자 추가
  - [ ] 지도에서 마커 표시 확인

---

## 📈 중기 목표 (1-2개월)

### 💡 기능 개선

#### 1. 성능 최적화 ⚡
- [ ] **번들 크기 최적화**
  - [ ] Dynamic import로 코드 스플리팅 강화
  - [ ] Leaflet을 별도 청크로 분리
  - [ ] Firebase SDK를 lazy load
  - [ ] 목표: 메인 번들 < 500KB

- [ ] **이미지 최적화**
  - [ ] 이미지 압축 (TinyPNG, ImageOptim)
  - [ ] WebP 포맷 지원
  - [ ] Lazy loading 구현
  - [ ] CDN 사용 고려

- [ ] **캐싱 전략**
  - [ ] Service Worker 구현
  - [ ] PWA 지원
  - [ ] 오프라인 모드

#### 2. 실시간 통계 대시보드 📊
- [ ] **히트맵 시각화**
  - [ ] 시간대별 참여자 밀집도
  - [ ] 지역별 참여 분포
  - [ ] 색상 그라데이션으로 표시

- [ ] **참여 트렌드 그래프**
  - [ ] Chart.js 또는 Recharts 사용
  - [ ] 실시간 업데이트
  - [ ] 시간별/일별 비교

- [ ] **통계 페이지 생성**
  - [ ] `/stats` 라우트 추가
  - [ ] 대시보드 컴포넌트
  - [ ] 데이터 내보내기 (CSV)

#### 3. 알림 시스템 🔔
- [ ] **푸시 알림 구현**
  - [ ] Firebase Cloud Messaging 설정
  - [ ] 브라우저 알림 권한 요청
  - [ ] 백그라운드 알림

- [ ] **알림 종류**
  - [ ] 새 집회 등록
  - [ ] 집회 시작 30분 전
  - [ ] 집회 장소/시간 변경
  - [ ] 친구 참여 알림 (향후)

- [ ] **알림 설정 페이지**
  - [ ] 알림 on/off
  - [ ] 관심 주제 선택
  - [ ] 알림 시간대 설정

#### 4. 참여 뱃지 시스템 🏆
- [ ] **뱃지 디자인**
  - [ ] 연속 참여 (3회, 5회, 10회)
  - [ ] 현장 참여 인증
  - [ ] 주제별 참여 (환경, 평화, 교육 등)
  - [ ] 얼리버드 (집회 시작 전 참여)

- [ ] **뱃지 데이터베이스**
  - [ ] Firestore에 `badges` 컬렉션
  - [ ] 사용자별 뱃지 목록
  - [ ] 획득 조건 검증 로직

- [ ] **프로필에 표시**
  - [ ] 마이페이지에 뱃지 목록
  - [ ] 진행률 표시
  - [ ] 공유 기능

#### 5. 소셜 기능 🤝
- [ ] **친구/팔로우 시스템**
  - [ ] 사용자 검색
  - [ ] 팔로우/언팔로우
  - [ ] 팔로워 목록

- [ ] **참여 인증샷 공유**
  - [ ] 이미지 업로드 (Firebase Storage)
  - [ ] 갤러리 뷰
  - [ ] 좋아요/댓글

- [ ] **그룹 참여**
  - [ ] 단체/조직 생성
  - [ ] 그룹 단위 참여 표명
  - [ ] 그룹 통계

---

## 🎨 UI/UX 개선

### 단기
- [ ] **모바일 최적화**
  - [ ] 터치 제스처 개선
  - [ ] 스와이프 네비게이션
  - [ ] 하단 탭 네비게이션 고려

- [ ] **접근성 개선**
  - [ ] ARIA 레이블 추가
  - [ ] 키보드 네비게이션
  - [ ] 색상 대비 확인
  - [ ] 스크린 리더 지원

### 중기
- [ ] **다크/라이트 모드 토글**
  - [ ] 사용자 설정 저장
  - [ ] 시스템 설정 감지
  - [ ] 부드러운 전환 애니메이션

- [ ] **테마 커스터마이징**
  - [ ] 프라이머리 컬러 선택
  - [ ] 폰트 크기 조정
  - [ ] 레이아웃 밀도 설정

---

## 🔒 보안 및 안정성

### 단기
- [ ] **입력 검증 강화**
  - [ ] XSS 방지
  - [ ] SQL Injection 방지 (N/A, Firebase 사용)
  - [ ] CSRF 토큰

- [ ] **에러 핸들링**
  - [ ] Error Boundary 구현
  - [ ] 사용자 친화적 에러 메시지
  - [ ] Sentry 연동 (에러 트래킹)

### 중기
- [ ] **레이트 리미팅**
  - [ ] API 호출 제한
  - [ ] Firebase Functions로 구현
  - [ ] 스팸 방지

- [ ] **개인정보 보호**
  - [ ] 익명 참여 강화
  - [ ] 위치 정보 암호화
  - [ ] GDPR 준수

---

## 🧪 테스트

### 단기
- [ ] **단위 테스트**
  - [ ] Jest 설정
  - [ ] React Testing Library
  - [ ] 주요 컴포넌트 테스트
  - [ ] 목표: 50% 커버리지

- [ ] **통합 테스트**
  - [ ] Firebase 연동 테스트
  - [ ] API 모킹
  - [ ] 목표: 30% 커버리지

### 중기
- [ ] **E2E 테스트**
  - [ ] Playwright 또는 Cypress
  - [ ] 주요 사용자 플로우
  - [ ] 시나리오:
    - 집회 목록 → 상세 → 참여
    - 로그인 → 댓글 작성
    - 지도 → 카드 클릭 → 이동

- [ ] **성능 테스트**
  - [ ] Lighthouse CI
  - [ ] 목표 점수:
    - Performance: 90+
    - Accessibility: 95+
    - Best Practices: 95+
    - SEO: 90+

---

## 📱 모바일 앱

### 장기 (3-6개월)
- [ ] **PWA 고도화**
  - [ ] App manifest
  - [ ] Service Worker
  - [ ] 홈 화면 추가
  - [ ] 오프라인 지원

- [ ] **네이티브 앱 고려**
  - [ ] React Native 전환 검토
  - [ ] 앱스토어 배포
  - [ ] 푸시 알림 강화

---

## 🌐 다국어 및 국제화

### 중기
- [ ] **추가 언어 지원**
  - [ ] 일본어 (ja)
  - [ ] 중국어 간체 (zh-CN)
  - [ ] 영어 번역 개선

- [ ] **지역화**
  - [ ] 날짜/시간 포맷
  - [ ] 통화 단위
  - [ ] 주소 포맷

---

## 📊 데이터 분석

### 중기
- [ ] **Google Analytics 연동**
  - [ ] 페이지뷰 추적
  - [ ] 이벤트 추적
  - [ ] 사용자 플로우 분석

- [ ] **사용자 행동 분석**
  - [ ] Hotjar 또는 Mixpanel
  - [ ] 히트맵
  - [ ] 세션 리플레이

- [ ] **대시보드**
  - [ ] 관리자 대시보드
  - [ ] 실시간 통계
  - [ ] 리포트 생성

---

## 🔧 개발자 경험

### 단기
- [ ] **문서화**
  - [x] PROJECT_STATUS.md
  - [x] ROADMAP.md
  - [ ] API 문서
  - [ ] 컴포넌트 Storybook

- [ ] **개발 환경 개선**
  - [ ] Husky (Git hooks)
  - [ ] Lint-staged
  - [ ] Commitlint
  - [ ] GitHub Actions (CI/CD)

### 중기
- [ ] **코드 품질**
  - [ ] SonarQube 연동
  - [ ] Code review 가이드라인
  - [ ] Pull request 템플릿
  - [ ] Issue 템플릿

---

## 🎯 마일스톤

### v0.2.0 (2주 내)
- [x] 하단 슬라이드 패널
- [x] 샘플 참여자 데이터 생성
- [ ] Vercel 배포
- [ ] Firebase 규칙 설정
- [ ] 샘플 데이터 추가

### v0.3.0 (1개월 내)
- [ ] 실시간 통계 대시보드
- [ ] 알림 시스템
- [ ] 번들 크기 최적화
- [ ] 단위 테스트 50% 커버리지

### v0.4.0 (2개월 내)
- [ ] 참여 뱃지 시스템
- [ ] 소셜 기능 (팔로우)
- [ ] PWA 지원
- [ ] E2E 테스트

### v1.0.0 (3개월 내)
- [ ] 모든 핵심 기능 완성
- [ ] 80% 테스트 커버리지
- [ ] Lighthouse 점수 90+
- [ ] 프로덕션 배포

---

## 📋 작업 우선순위

### P0 - 긴급 (이번 주)
1. ✅ PR 생성
2. ✅ Vercel 배포
3. ✅ Firebase 설정
4. ✅ 샘플 데이터 추가

### P1 - 높음 (다음 주)
1. 번들 크기 최적화
2. 에러 핸들링 개선
3. 단위 테스트 시작
4. 실시간 통계 프로토타입

### P2 - 중간 (2-4주)
1. 알림 시스템
2. 참여 뱃지
3. PWA 구현
4. E2E 테스트

### P3 - 낮음 (1-3개월)
1. 소셜 기능
2. 네이티브 앱
3. 다국어 확장
4. 고급 분석

---

## 🤝 기여 가이드

향후 오픈소스화를 고려하여:
- [ ] CONTRIBUTING.md 작성
- [ ] CODE_OF_CONDUCT.md 작성
- [ ] 이슈 템플릿
- [ ] PR 템플릿
- [ ] 라이센스 확정

---

**마지막 업데이트**: 2025-10-30
**다음 리뷰 예정**: 2025-11-13
