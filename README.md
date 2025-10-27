# 🕯️ Youcandle it

> "You can do it" - 촛불로 하나되는 시민 참여 플랫폼

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📌 프로젝트 소개

**Youcandle it**은 평화로운 집회 참여를 더 쉽고 의미 있게 만드는 위치 기반 소셜 플랫폼입니다.

### 핵심 기능

- 🗺️ **지도 기반 집회 시각화**: 실시간으로 진행 중인 집회 정보 확인
- 🕯️ **디지털 촛불**: GPS 기반 현장/원격 참여자 시각화
- 🤖 **AI 응원 시스템**: Gemini AI 기반 응원 메시지 및 조언 생성
- 📺 **실시간 방송**: 현장에 가지 못해도 실시간 참여 가능
- 💬 **커뮤니티**: 시민들의 응원 댓글 통합 피드
- 🌍 **다국어 지원**: 한국어, 영어 (중국어, 일본어, 스페인어 예정)

---

## 🚀 빠른 시작

### 필요 조건

- Node.js 18+
- npm 또는 yarn
- Git

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/youcandleit.git
cd youcandleit

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 Firebase 및 Gemini API 키를 입력하세요

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 을 열어 확인하세요!

---

## 📖 문서

상세한 문서는 다음 파일들을 참고하세요:

- [SETUP.md](./SETUP.md) - 개발 환경 세팅 가이드
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드 및 코드 규칙
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - 프로젝트 기획서
- [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md) - Firebase 백엔드 설정 가이드

---

## 🛠️ 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **React Router** - 라우팅
- **react-i18next** - 다국어

### Map & Location
- **Leaflet** - 지도 라이브러리
- **OpenStreetMap** - 지도 타일
- **Geolocation API** - GPS

### Backend & Database
- **Firebase Authentication** - 사용자 인증
- **Firebase Firestore** - 데이터베이스
- **Firebase Realtime Database** - 실시간 촛불 업데이트
- **Firebase Storage** - 파일 저장

### AI & External Services
- **Google Gemini API** - AI 기능
- **wttr.in** - 날씨 정보

---

## 📂 프로젝트 구조

```
youcandleit/
├── src/
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── pages/            # 페이지 컴포넌트 (라우트별)
│   ├── services/         # API 및 외부 서비스 로직
│   ├── hooks/            # 커스텀 React Hooks
│   ├── types/            # TypeScript 타입 정의
│   ├── utils/            # 유틸리티 함수
│   ├── i18n/             # 다국어 번역 파일
│   ├── assets/           # 이미지, 아이콘 등
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── main.tsx          # 엔트리 포인트
│   └── index.css         # 글로벌 스타일
├── public/               # 정적 파일
├── docs/                 # 추가 문서
├── .env.example          # 환경 변수 예시
├── package.json          # 프로젝트 의존성
├── tsconfig.json         # TypeScript 설정
├── vite.config.ts        # Vite 설정
├── tailwind.config.js    # Tailwind CSS 설정
└── README.md             # 이 파일
```

---

## 💻 개발 명령어

```bash
# 개발 서버 실행 (Hot Reload)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format
```

---

## 🤝 기여하기

**Youcandle it**은 오픈소스 프로젝트입니다! 기여를 환영합니다.

### 기여 방법

1. 이 저장소를 Fork합니다
2. Feature 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

자세한 기여 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고하세요.

---

## 🗺️ 로드맵

### Phase 1: 기반 구축 ✅ (완료)
- [x] 프로젝트 세팅
- [x] 다국어 시스템
- [x] 기본 문서화

### Phase 2: MVP (진행 중)
- [ ] 기본 UI 구현
- [ ] Firebase 백엔드 연동
- [ ] Google 로그인
- [ ] 집회 CRUD
- [ ] 베타 배포

### Phase 3: 고도화
- [ ] GPS 촛불 시각화
- [ ] Gemini AI 통합
- [ ] 실시간 스트리밍
- [ ] 성능 최적화

### Phase 4: 확장
- [ ] 다국어 확장
- [ ] 모바일 앱
- [ ] 게이미피케이션
- [ ] 공식 런칭

---

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE) 하에 배포됩니다.

---

## 📞 연락처

- **프로젝트 링크**: [https://github.com/your-username/youcandleit](https://github.com/your-username/youcandleit)
- **이슈 제보**: [GitHub Issues](https://github.com/your-username/youcandleit/issues)
- **이메일**: your-email@example.com

---

## 🙏 감사의 말

- [OpenStreetMap](https://www.openstreetmap.org/) - 무료 지도 타일
- [Firebase](https://firebase.google.com/) - 백엔드 서비스
- [Google Gemini](https://ai.google.dev/) - AI 기능
- 모든 기여자분들께 감사드립니다!

---

<p align="center">
  Made with ❤️ for Democracy and Solidarity
</p>
