# ✅ 빠른 체크리스트

**생성일**: 2025-10-30

---

## 🚀 즉시 해야 할 일 (오늘)

### 1. PR 생성 및 리뷰
- [ ] GitHub PR 생성
  ```
  https://github.com/joshweb83/youcandleit/pull/new/claude/bottom-sheet-and-sample-data-011CUbS6qeasYgmgvzX53B6J
  ```
- [ ] PR 제목: `feat: Add bottom sheet with event list and sample participant data`
- [ ] PR 본문 작성 (PROJECT_STATUS.md 참고)
- [ ] 리뷰 요청

### 2. Vercel 배포
- [ ] [Vercel 대시보드](https://vercel.com/new) 접속
- [ ] Import Git Repository 클릭
- [ ] `joshweb83/youcandleit` 저장소 선택
- [ ] 브랜치: `claude/bottom-sheet-and-sample-data-011CUbS6qeasYgmgvzX53B6J`
- [ ] Deploy 클릭

### 3. Firebase 환경 변수 설정
Vercel → Project Settings → Environment Variables에 추가:
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_FIREBASE_DATABASE_URL`

---

## 📋 내일 할 일

### 1. Firebase 설정
- [ ] Firestore 규칙 설정
  - Firebase Console → Firestore Database → Rules
  - ROADMAP.md의 규칙 복사
- [ ] Realtime Database 규칙 설정
  - Firebase Console → Realtime Database → Rules
  - ROADMAP.md의 규칙 복사
- [ ] Authentication 설정
  - Google 로그인 활성화
  - Vercel URL을 승인된 도메인에 추가

### 2. 샘플 데이터 준비
- [ ] Firebase Console에서 Firestore 열기
- [ ] `events` 컬렉션 생성
- [ ] SAMPLE_DATA.md의 5개 샘플 이벤트 추가
- [ ] 각 이벤트의 ID 복사

### 3. 샘플 참여자 생성
- [ ] `src/scripts/generateSampleParticipants.ts` 열기
- [ ] `SAMPLE_EVENTS` 배열의 ID를 실제 이벤트 ID로 수정
- [ ] 빌드: `npm run build`
- [ ] Vercel에 배포된 사이트 열기
- [ ] `/dev-tools` 페이지 이동
- [ ] "샘플 참여자 추가" 버튼 클릭
- [ ] 지도 페이지에서 마커 확인

---

## 🔍 이번 주 할 일

### 성능 최적화
- [ ] 번들 크기 분석
  ```bash
  npm run build -- --mode production --sourcemap
  ```
- [ ] Dynamic import 추가
- [ ] 이미지 최적화

### 테스트 시작
- [ ] Jest 설치 및 설정
  ```bash
  npm install -D jest @testing-library/react @testing-library/jest-dom
  ```
- [ ] 첫 번째 테스트 작성 (BottomSheet)
- [ ] CI에서 테스트 실행

### 문서화
- [ ] README.md 업데이트
- [ ] API 문서 시작
- [ ] 스크린샷 추가

---

## 📊 진행 상황 확인

### 완료 ✅
- ✅ 하단 슬라이드 패널 구현
- ✅ 샘플 참여자 데이터 생성 스크립트
- ✅ 개발자 도구 페이지
- ✅ EventCardCompact 컴포넌트
- ✅ 지도 연동 (카드 클릭 → 지도 이동)
- ✅ GitHub에 푸시
- ✅ PROJECT_STATUS.md 작성
- ✅ ROADMAP.md 작성

### 진행 중 🔄
- 🔄 PR 생성
- 🔄 Vercel 배포
- 🔄 Firebase 설정
- 🔄 샘플 데이터 추가

### 대기 중 ⏳
- ⏳ 성능 최적화
- ⏳ 테스트 작성
- ⏳ 실시간 통계 대시보드
- ⏳ 알림 시스템

---

## 🐛 알려진 이슈

### 높음 🔴
- 번들 크기 947KB (목표: <500KB)

### 중간 🟡
- TODO 항목: Juso API → 카카오/Google Geocoding 검토

### 낮음 🟢
- 없음

---

## 💡 팁

### 개발 환경
```bash
# 개발 서버 시작
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview

# 린트
npm run lint
```

### Git 워크플로우
```bash
# 새 브랜치 생성
git checkout -b feature/new-feature

# 커밋
git add .
git commit -m "feat: Add new feature"

# 푸시
git push -u origin feature/new-feature
```

### Firebase Console
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT/firestore
- **Realtime DB**: https://console.firebase.google.com/project/YOUR_PROJECT/database
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT/authentication

### Vercel
- **대시보드**: https://vercel.com/dashboard
- **배포**: `vercel` 또는 GitHub 자동 배포

---

## 📞 도움이 필요할 때

1. **빌드 실패**:
   - `npm install`로 의존성 재설치
   - `node_modules` 삭제 후 재설치
   - `.env` 파일 확인

2. **Firebase 오류**:
   - 환경 변수 확인
   - Firebase Console에서 프로젝트 상태 확인
   - 규칙 설정 확인

3. **지도 표시 안 됨**:
   - Leaflet CSS 로드 확인
   - 이벤트 데이터 확인 (Firestore)
   - 콘솔 에러 확인

---

**마지막 업데이트**: 2025-10-30
