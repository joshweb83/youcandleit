# 🚀 빠른 배포 가이드

이 문서는 Youcandle it을 최대한 빠르게 배포하고 실행하는 방법을 안내합니다.

## 📋 체크리스트

배포 전에 다음 항목을 확인하세요:

- [ ] Firebase 프로젝트 생성
- [ ] Firebase 서비스 활성화 (Auth, Firestore, Realtime DB)
- [ ] `.env` 파일 생성 (로컬용)
- [ ] Vercel 환경변수 설정 (배포용)
- [ ] 초기 데이터 입력 (선택)

---

## 1️⃣ Firebase 프로젝트 설정 (5분)

### 1.1 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `youcandleit` (원하는 이름)
4. Google Analytics: 선택사항
5. "프로젝트 만들기" 클릭

### 1.2 Authentication 설정

1. 왼쪽 메뉴 → **Authentication** 클릭
2. "시작하기" 클릭
3. **Sign-in method** 탭 선택
4. **Google** 활성화
   - 공개용 프로젝트 이름 입력
   - 프로젝트 지원 이메일 선택
   - "저장" 클릭

### 1.3 Firestore Database 생성

1. 왼쪽 메뉴 → **Firestore Database** 클릭
2. "데이터베이스 만들기" 클릭
3. **프로덕션 모드**로 시작 선택
4. 위치: `asia-northeast3 (Seoul)` 선택 (한국)
5. "사용 설정" 클릭

### 1.4 Realtime Database 생성

1. 왼쪽 메뉴 → **Realtime Database** 클릭
2. "데이터베이스 만들기" 클릭
3. 위치: `asia-southeast1 (Singapore)` (서울 미지원)
4. **잠금 모드로 시작** 선택
5. "사용 설정" 클릭

### 1.5 보안 규칙 설정

#### Firestore 규칙
1. Firestore Database → **규칙** 탭
2. 프로젝트의 `firestore.rules` 파일 내용 복사
3. Firebase Console에 붙여넣기
4. "게시" 클릭

#### Realtime Database 규칙
1. Realtime Database → **규칙** 탭
2. 프로젝트의 `database.rules.json` 파일 내용 복사
3. Firebase Console에 붙여넣기
4. "게시" 클릭

### 1.6 웹 앱 추가

1. 프로젝트 개요 → ⚙️ 설정 아이콘 클릭
2. "웹" 아이콘 `</>` 클릭
3. 앱 닉네임: `youcandleit-web`
4. Firebase Hosting 설정: **체크 해제**
5. "앱 등록" 클릭
6. **firebaseConfig 값 복사** (다음 단계에서 사용)

---

## 2️⃣ 로컬 환경 설정 (2분)

### 2.1 환경 변수 파일 생성

```bash
# 프로젝트 루트에서
cp .env.example .env
```

### 2.2 Firebase 설정값 입력

`.env` 파일을 열고 복사한 firebaseConfig 값을 입력:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=yourcandleit.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourcandleit
VITE_FIREBASE_STORAGE_BUCKET=yourcandleit.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
VITE_FIREBASE_DATABASE_URL=https://yourcandleit.firebaseio.com

# Google Gemini AI API (선택사항)
VITE_GEMINI_API_KEY=

# 환경 설정
VITE_ENVIRONMENT=development
```

### 2.3 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 확인!

---

## 3️⃣ Vercel 배포 (3분)

### 3.1 Vercel 계정 연결

이미 GitHub에 푸시했다면 Vercel이 자동으로 배포했을 것입니다.

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 `youcandleit` 찾기

### 3.2 환경변수 설정

**중요**: Vercel에서도 Firebase 환경변수를 설정해야 합니다!

1. Vercel 프로젝트 → **Settings** 탭
2. 왼쪽 메뉴 → **Environment Variables**
3. 다음 변수들을 하나씩 추가:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Firebase에서 복사한 값 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase에서 복사한 값 |
| `VITE_FIREBASE_PROJECT_ID` | Firebase에서 복사한 값 |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase에서 복사한 값 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase에서 복사한 값 |
| `VITE_FIREBASE_APP_ID` | Firebase에서 복사한 값 |
| `VITE_FIREBASE_DATABASE_URL` | Firebase에서 복사한 값 |
| `VITE_GEMINI_API_KEY` | (선택) Gemini API 키 |

4. **Save** 클릭

### 3.3 재배포

1. Vercel 프로젝트 → **Deployments** 탭
2. 최신 배포 → ⋯ 메뉴 → **Redeploy**
3. "Redeploy" 버튼 클릭

환경변수가 적용된 새 배포가 시작됩니다!

---

## 4️⃣ 초기 데이터 입력 (선택)

앱을 테스트하려면 샘플 집회 데이터가 필요합니다.

### 4.1 관리자 계정 설정

1. 앱에서 Google 로그인
2. Firebase Console → Firestore Database
3. `users` 컬렉션 → 내 계정 문서 열기
4. `role` 필드를 `admin`으로 변경

### 4.2 샘플 집회 추가

Firebase Console → Firestore → `events` 컬렉션에 문서 추가:

```json
{
  "title": "기후정의를 위한 촛불집회",
  "description": "지구를 위한 시민들의 목소리",
  "summary": "기후위기 대응을 촉구하는 평화로운 시민집회",
  "location": {
    "address": "서울시청 앞 광장",
    "coordinates": {
      "lat": 37.5665,
      "lng": 126.9780
    },
    "radius": 500
  },
  "datetime": {
    "start": "2025-11-01T18:00:00+09:00",
    "end": "2025-11-01T21:00:00+09:00"
  },
  "organizer": "시민환경연대",
  "liveStreamUrl": "https://youtube.com/live/example",
  "tags": ["환경", "기후", "정의"],
  "status": "scheduled",
  "participantCount": 0,
  "remoteCount": 0,
  "createdAt": [현재 timestamp],
  "createdBy": "admin-uid",
  "updatedAt": [현재 timestamp]
}
```

---

## 5️⃣ 배포 확인

### ✅ 확인 사항

- [ ] Vercel 배포 성공: https://youcandleit.vercel.app
- [ ] GitHub Pages 배포 성공: https://joshweb83.github.io/youcandleit
- [ ] Google 로그인 작동
- [ ] 지도에 집회 표시
- [ ] 촛불 켜기/끄기 작동
- [ ] 댓글 작성 가능

### 🐛 문제 해결

#### "Firebase 설정이 필요합니다" 화면이 보일 때
→ Vercel 환경변수가 올바르게 설정되었는지 확인 후 재배포

#### Google 로그인 실패
→ Firebase Authentication에서 승인된 도메인 확인:
- `localhost` (로컬 개발)
- `youcandleit.vercel.app` (Vercel)
- `joshweb83.github.io` (GitHub Pages)

#### 집회가 표시되지 않음
→ Firestore에 `events` 컬렉션과 문서가 있는지 확인

---

## 🎉 완료!

축하합니다! Youcandle it이 성공적으로 배포되었습니다.

### 다음 단계

1. **테스트**: 모든 기능이 정상 작동하는지 확인
2. **샘플 데이터**: 더 많은 집회 추가
3. **커스터마이징**: 색상, 텍스트 등 수정
4. **홍보**: 사용자에게 공유!

### 도움이 필요하신가요?

- 📖 [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md) - 상세 Firebase 가이드
- 📖 [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드
- 🐛 [GitHub Issues](https://github.com/joshweb83/youcandleit/issues) - 버그 제보

---

Made with ❤️ for Democracy
