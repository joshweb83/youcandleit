# 🛠️ Youcandle it - 개발 환경 세팅 가이드

이 문서는 **비개발자도 따라할 수 있도록** 작성된 개발 환경 세팅 가이드입니다.

---

## 📋 목차

1. [필요한 프로그램 설치](#1-필요한-프로그램-설치)
2. [프로젝트 다운로드](#2-프로젝트-다운로드)
3. [의존성 패키지 설치](#3-의존성-패키지-설치)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [Firebase 설정](#5-firebase-설정)
6. [Gemini AI API 설정](#6-gemini-ai-api-설정)
7. [개발 서버 실행](#7-개발-서버-실행)
8. [문제 해결](#8-문제-해결)

---

## 1. 필요한 프로그램 설치

### 1.1 Node.js 설치

**Node.js란?** JavaScript를 컴퓨터에서 실행할 수 있게 해주는 프로그램입니다.

#### Windows
1. [Node.js 공식 사이트](https://nodejs.org/) 방문
2. **LTS 버전** (18.x 이상) 다운로드
3. 다운로드한 설치 파일 실행
4. 설치 마법사를 따라 진행 (모두 기본값으로 OK)

#### macOS
```bash
# Homebrew가 설치되어 있다면:
brew install node@18

# 또는 공식 사이트에서 다운로드
# https://nodejs.org/
```

#### Linux (Ubuntu/Debian)
```bash
# Node.js 18.x 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 설치 확인
터미널(명령 프롬프트)을 열고 다음 명령어를 입력:

```bash
node --version
# v18.x.x 같은 버전이 표시되면 성공!

npm --version
# 9.x.x 같은 버전이 표시되면 성공!
```

### 1.2 Git 설치

**Git이란?** 코드 버전 관리를 위한 프로그램입니다.

#### Windows
1. [Git 공식 사이트](https://git-scm.com/) 방문
2. Windows 버전 다운로드
3. 설치 (모두 기본값으로 OK)

#### macOS
```bash
# Homebrew로 설치
brew install git

# 또는 Xcode Command Line Tools 설치
xcode-select --install
```

#### Linux
```bash
sudo apt-get install git
```

#### 설치 확인
```bash
git --version
# git version 2.x.x가 표시되면 성공!
```

### 1.3 코드 에디터 설치 (선택사항)

**권장**: Visual Studio Code (VS Code)

1. [VS Code 공식 사이트](https://code.visualstudio.com/) 방문
2. 운영체제에 맞는 버전 다운로드 및 설치
3. 권장 확장 프로그램 설치:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - i18n Ally (다국어 지원)

---

## 2. 프로젝트 다운로드

### 방법 1: Git Clone (권장)

터미널을 열고 원하는 폴더로 이동 후:

```bash
# HTTPS 방식
git clone https://github.com/your-username/youcandleit.git

# 프로젝트 폴더로 이동
cd youcandleit
```

### 방법 2: ZIP 다운로드

1. GitHub 저장소 페이지 방문
2. 초록색 "Code" 버튼 클릭
3. "Download ZIP" 선택
4. 다운로드한 파일 압축 해제
5. 터미널에서 해당 폴더로 이동

---

## 3. 의존성 패키지 설치

**의존성 패키지란?** 프로젝트가 동작하는데 필요한 라이브러리들입니다.

터미널에서 프로젝트 폴더 안에서 실행:

```bash
npm install
```

**예상 소요 시간**: 2-5분 (인터넷 속도에 따라 다름)

**성공 메시지**:
```
added XXX packages, and audited XXX packages in XXs
```

---

## 4. 환경 변수 설정

### 4.1 환경 변수란?

API 키 같은 민감한 정보를 코드에 직접 작성하지 않고 별도 파일에 저장하는 방법입니다.

### 4.2 .env 파일 생성

```bash
# .env.example 파일을 .env로 복사
cp .env.example .env
```

**Windows에서는**:
```cmd
copy .env.example .env
```

### 4.3 .env 파일 열기

텍스트 에디터(VS Code, 메모장 등)로 `.env` 파일을 엽니다.

```env
# 이런 내용이 표시됩니다
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
...
```

다음 섹션에서 각 값을 채워넣습니다.

---

## 5. Firebase 설정

### 5.1 Firebase란?

Google에서 제공하는 백엔드 서비스입니다. 데이터베이스, 인증, 호스팅 등을 쉽게 사용할 수 있습니다.

### 5.2 Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭
4. 프로젝트 이름 입력: `youcandle-it` (또는 원하는 이름)
5. Google Analytics 설정 (선택사항, 초기에는 비활성화 가능)
6. "프로젝트 만들기" 클릭

### 5.3 Firebase 앱 등록

1. 프로젝트 대시보드에서 웹 아이콘 `</>` 클릭
2. 앱 닉네임 입력: `Youcandle it Web`
3. "Firebase 호스팅 설정" 체크 (선택사항)
4. "앱 등록" 클릭

### 5.4 Firebase 설정 복사

화면에 다음과 같은 코드가 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

이 값들을 `.env` 파일에 복사합니다:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxx
```

### 5.5 Firebase Authentication 활성화

1. Firebase Console 좌측 메뉴 > "Authentication" 클릭
2. "시작하기" 클릭
3. "로그인 방법" 탭 선택
4. "Google" 클릭
5. "사용 설정" 토글 ON
6. 프로젝트 지원 이메일 선택
7. "저장" 클릭

### 5.6 Firebase Firestore 활성화

1. 좌측 메뉴 > "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 위치 선택: `asia-northeast3 (Seoul)` 권장
4. "테스트 모드로 시작" 선택 (개발용)
5. "사용 설정" 클릭

⚠️ **중요**: 프로덕션 배포 시 보안 규칙을 반드시 수정해야 합니다!

---

## 6. Gemini AI API 설정

### 6.1 Gemini API란?

Google의 AI 모델인 Gemini를 사용하기 위한 API입니다. 응원 메시지 생성, 집회 요약 등에 사용됩니다.

### 6.2 API 키 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "API 키 가져오기" 클릭
4. "새 API 키 만들기" 선택
5. 생성된 API 키 복사

### 6.3 .env 파일에 추가

```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 6.4 무료 할당량

Gemini API는 **무료 할당량**을 제공합니다:
- 분당 15회 요청
- 일일 1,500회 요청

초기 개발과 테스트에 충분합니다!

---

## 7. 개발 서버 실행

모든 설정이 완료되었습니다! 이제 앱을 실행해봅시다.

```bash
npm run dev
```

**성공 메시지**:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

브라우저에서 `http://localhost:3000` 을 열면 앱이 실행됩니다!

### 7.1 Hot Reload

코드를 수정하고 저장하면 **자동으로 브라우저가 새로고침**됩니다. 별도로 서버를 재시작할 필요가 없습니다!

### 7.2 개발 서버 종료

터미널에서 `Ctrl + C` (Windows/Linux) 또는 `Cmd + C` (macOS)

---

## 8. 문제 해결

### 8.1 "npm: command not found"

**원인**: Node.js가 제대로 설치되지 않았습니다.

**해결**:
1. Node.js를 다시 설치합니다
2. 터미널을 재시작합니다
3. `node --version` 으로 확인합니다

### 8.2 "npm install" 실패

**원인 1**: 인터넷 연결 문제

**해결**:
```bash
# npm 캐시 삭제 후 재시도
npm cache clean --force
npm install
```

**원인 2**: 권한 문제 (Linux/macOS)

**해결**:
```bash
# sudo 없이 npm을 사용하도록 권한 변경
sudo chown -R $USER:$USER ~/.npm
npm install
```

### 8.3 "Port 3000 is already in use"

**원인**: 다른 프로그램이 3000번 포트를 사용 중입니다.

**해결**:
```bash
# 다른 포트로 실행
npm run dev -- --port 3001
```

### 8.4 Firebase 연결 오류

**증상**: `Firebase: Error (auth/invalid-api-key)`

**해결**:
1. `.env` 파일의 API 키를 다시 확인합니다
2. **따옴표 없이** 값만 입력했는지 확인합니다
3. `.env` 파일 저장 후 개발 서버를 재시작합니다

### 8.5 Tailwind CSS가 적용 안 됨

**해결**:
```bash
# 개발 서버 재시작
# Ctrl+C로 종료 후
npm run dev
```

### 8.6 TypeScript 오류

**증상**: 빨간색 밑줄이 많이 표시됩니다.

**해결**:
1. VS Code에서 TypeScript 서버 재시작:
   - `Cmd/Ctrl + Shift + P` 입력
   - "TypeScript: Restart TS Server" 선택

2. node_modules 재설치:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 9. 다음 단계

환경 설정이 완료되었습니다! 이제:

1. [DEVELOPMENT.md](./DEVELOPMENT.md)를 읽고 개발 가이드를 확인하세요
2. [PROJECT_BRIEF.md](./PROJECT_BRIEF.md)에서 전체 기획을 확인하세요
3. [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md)에서 백엔드 세부 설정을 확인하세요

---

## 10. 도움이 필요하신가요?

- GitHub Issues에 질문을 올려주세요
- 이메일: your-email@example.com
- Discord: [초대 링크]

**행복한 코딩 되세요!** 🕯️✨
