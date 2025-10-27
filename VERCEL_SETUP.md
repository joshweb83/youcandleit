# 🚀 Vercel 자동 배포 설정 가이드

이 문서는 Vercel에 자동 배포하는 방법을 설명합니다. **GitHub Pages보다 훨씬 간단하고 빠릅니다!**

---

## 📋 목차

1. [Vercel이란?](#1-vercel이란)
2. [Vercel 자동 배포 설정 (5분)](#2-vercel-자동-배포-설정-5분)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [배포 확인](#4-배포-확인)
5. [도메인 설정](#5-도메인-설정-선택사항)
6. [문제 해결](#6-문제-해결)

---

## 1. Vercel이란?

**Vercel**은 프론트엔드 프로젝트를 위한 최고의 배포 플랫폼입니다.

### GitHub Pages vs Vercel 비교

| 항목 | GitHub Pages | Vercel |
|------|--------------|--------|
| **배포 속도** | 2-3분 | **30초** ⚡ |
| **환경 변수** | 복잡 | **매우 쉬움** ✅ |
| **미리보기 배포** | ❌ | **✅ PR마다 자동** |
| **커스텀 도메인** | ✅ | **✅ 더 쉬움** |
| **분석 & 로그** | ❌ | **✅ 무료 제공** |
| **가격** | 무료 | **무료** (개인) |

**결론**: Vercel이 모든 면에서 우수합니다! 🎉

---

## 2. Vercel 자동 배포 설정 (5분)

### Step 1: Vercel 가입

1. **Vercel 웹사이트 방문**
   ```
   https://vercel.com
   ```

2. **"Sign Up" 클릭**

3. **"Continue with GitHub" 선택** ✅
   - GitHub 계정으로 로그인
   - Vercel에 GitHub 저장소 접근 권한 허용

### Step 2: 프로젝트 Import

1. **대시보드에서 "Add New..." → "Project" 클릭**

2. **"Import Git Repository" 섹션에서**:
   - GitHub 저장소 검색: `youcandleit`
   - "Import" 클릭

3. **프로젝트 설정**:
   ```
   Project Name: youcandleit (기본값 사용)
   Framework Preset: Vite (자동 감지됨)
   Root Directory: ./ (기본값)
   Build Command: npm run build (자동 설정됨)
   Output Directory: dist (자동 설정됨)
   Install Command: npm install (자동 설정됨)
   ```

4. **"Deploy" 클릭** 🚀

### Step 3: 배포 완료!

30초~1분 후 배포가 완료됩니다! 🎉

**배포 URL**:
```
https://youcandleit.vercel.app
```

또는 Vercel이 생성한 랜덤 URL:
```
https://youcandleit-xxxxx.vercel.app
```

---

## 3. 환경 변수 설정

Firebase, Gemini API 등 환경 변수를 설정합니다.

### Step 1: 환경 변수 페이지로 이동

1. Vercel 대시보드 → 프로젝트 선택
2. 상단 메뉴에서 **"Settings"** 클릭
3. 좌측 메뉴에서 **"Environment Variables"** 클릭

### Step 2: 환경 변수 추가

다음 환경 변수들을 추가하세요:

#### Firebase 설정

| Variable Name | Value |
|---------------|-------|
| `VITE_FIREBASE_API_KEY` | Firebase Console에서 복사한 API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:xxxxx` |
| `VITE_FIREBASE_DATABASE_URL` | `https://your-project.firebaseio.com` |

#### Gemini AI API

| Variable Name | Value |
|---------------|-------|
| `VITE_GEMINI_API_KEY` | Google AI Studio에서 발급받은 API Key |

#### 기타

| Variable Name | Value |
|---------------|-------|
| `VITE_ENVIRONMENT` | `production` |

### Step 3: 환경 적용

모든 환경을 선택하세요:
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save" 클릭**

### Step 4: 재배포

환경 변수를 추가한 후에는 재배포가 필요합니다:

1. "Deployments" 탭으로 이동
2. 최신 배포의 "..." 메뉴 클릭
3. "Redeploy" 선택
4. 30초 후 완료!

---

## 4. 배포 확인

### 자동 배포 작동 방식

이제부터 **Git push할 때마다 자동 배포**됩니다!

```
코드 수정
   ↓
git commit & push
   ↓
Vercel이 자동 감지 ⚡
   ↓
30초 후 배포 완료! 🎉
```

### 배포 상태 확인

1. **Vercel 대시보드** → **"Deployments"** 탭

2. 배포 상태:
   - 🟡 **Building**: 빌드 중
   - ✅ **Ready**: 배포 완료
   - ❌ **Error**: 빌드 실패 (로그 확인)

3. **실시간 로그 보기**:
   - 배포 항목 클릭
   - "Building" 또는 "Function Logs" 탭에서 확인

### PR 미리보기 배포

Vercel의 강력한 기능! **Pull Request마다 별도 URL**이 생성됩니다:

1. GitHub에서 PR 생성
2. Vercel이 자동으로 미리보기 배포
3. PR 댓글에 미리보기 URL 추가
4. 팀원들이 실제 동작 확인 가능!

예시:
```
https://youcandleit-git-feature-branch.vercel.app
```

---

## 5. 도메인 설정 (선택사항)

### 무료 Vercel 도메인 사용

기본적으로 제공되는 도메인:
```
https://youcandleit.vercel.app
```

### 커스텀 도메인 연결

1. **도메인 구매** (예: `youcandle.it`)

2. **Vercel 대시보드**:
   - Settings → Domains
   - "Add" 클릭
   - 도메인 입력: `youcandle.it`

3. **DNS 설정**:
   - 도메인 제공업체(가비아, GoDaddy 등)에서
   - CNAME 레코드 추가:
     ```
     Type: CNAME
     Name: @
     Value: cname.vercel-dns.com
     ```

4. **SSL 자동 적용** (Let's Encrypt, 무료)

5. **완료!**
   ```
   https://youcandle.it
   ```

---

## 6. 문제 해결

### 6.1 빌드 실패 (Error)

**증상**: 배포 상태가 빨간색 ❌

**해결**:
1. Vercel 대시보드 → 실패한 배포 클릭
2. "Building" 탭에서 오류 로그 확인
3. 로컬에서 `npm run build` 실행하여 동일한 오류 재현
4. 오류 수정 후 다시 push

**일반적인 오류**:
- TypeScript 타입 오류
- 의존성 설치 실패
- 환경 변수 누락

### 6.2 환경 변수가 작동 안 함

**증상**: `import.meta.env.VITE_FIREBASE_API_KEY`가 `undefined`

**해결**:
1. Settings → Environment Variables 확인
2. 변수 이름이 `VITE_` 접두사로 시작하는지 확인
3. 모든 환경(Production, Preview, Development)에 적용했는지 확인
4. 재배포 필요 (Redeploy)

### 6.3 배포가 너무 오래 걸림

**정상 소요 시간**: 30초~1분

**5분 이상 소요 시**:
1. Vercel Status 페이지 확인: https://www.vercel-status.com/
2. 배포 취소 후 재시도

### 6.4 페이지가 404 오류

**원인**: SPA 라우팅 문제

**해결**: `vercel.json` 파일이 올바른지 확인:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 7. Vercel CLI (선택사항)

터미널에서 직접 배포하려면:

### 설치

```bash
npm install -g vercel
```

### 로그인

```bash
vercel login
```

### 배포

```bash
# 미리보기 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 8. 고급 기능

### 8.1 Analytics (무료)

방문자 통계 확인:
1. Settings → Analytics → Enable

### 8.2 Speed Insights (무료)

성능 모니터링:
1. Settings → Speed Insights → Enable

### 8.3 로그 & 모니터링

- 실시간 Function Logs
- 오류 추적
- 성능 메트릭

---

## 9. GitHub Pages와 Vercel 동시 사용

현재 설정으로 **두 플랫폼 모두 자동 배포**됩니다!

| 플랫폼 | URL | 용도 |
|--------|-----|------|
| **Vercel** | https://youcandleit.vercel.app | **메인** (빠르고 기능 많음) ✅ |
| **GitHub Pages** | https://joshweb83.github.io/youcandleit | 백업 |

**추천**: Vercel을 메인으로 사용하세요! 💪

---

## 10. 체크리스트

Vercel 배포 설정 완료 확인:

- [ ] Vercel 가입 완료
- [ ] GitHub 저장소 연동
- [ ] 프로젝트 Import 및 배포
- [ ] 환경 변수 설정 (Firebase, Gemini API)
- [ ] 재배포 실행
- [ ] 사이트 접속: https://youcandleit.vercel.app
- [ ] 촛불 아이콘과 기능이 정상 작동하는지 확인

---

## 11. 비교표: GitHub Pages vs Vercel

| 기능 | GitHub Pages | Vercel |
|------|--------------|--------|
| 배포 속도 | 2-3분 | **30초** ⚡ |
| 자동 배포 | ✅ GitHub Actions | **✅ 자동** (별도 설정 불필요) |
| 환경 변수 | 복잡 (Secrets + Workflow) | **✅ GUI에서 간단** |
| PR 미리보기 | ❌ | **✅ 자동 생성** |
| 빌드 로그 | Actions 탭에서 확인 | **✅ 실시간 로그** |
| 도메인 연결 | ✅ | **✅ 더 쉬움** |
| Analytics | ❌ | **✅ 무료 제공** |
| 롤백 | 복잡 | **✅ 원클릭** |
| 가격 | 무료 | **무료** (개인) |

**결론**: Vercel이 압도적으로 우수합니다! 🏆

---

## 12. 도움말

### Vercel 관련 문서
- 공식 문서: https://vercel.com/docs
- Vite 배포 가이드: https://vercel.com/guides/deploying-vite-with-vercel
- 환경 변수: https://vercel.com/docs/concepts/projects/environment-variables

### 질문/이슈
- Vercel Community: https://github.com/vercel/vercel/discussions
- 프로젝트 Issues: https://github.com/joshweb83/youcandleit/issues

---

**Vercel 배포 설정이 완료되었습니다!** 🎉

이제 Git push만 하면 **30초 만에 자동 배포**됩니다! 🚀✨
