# 🚀 Youcandle it - 배포 가이드

이 문서는 GitHub Pages에 자동 배포하는 방법을 설명합니다.

---

## 📋 목차

1. [GitHub Pages 자동 배포 설정](#1-github-pages-자동-배포-설정)
2. [사이트 확인하기](#2-사이트-확인하기)
3. [배포 과정 이해하기](#3-배포-과정-이해하기)
4. [문제 해결](#4-문제-해결)

---

## 1. GitHub Pages 자동 배포 설정

### 1.1 GitHub 저장소 설정 (최초 1회만)

1. **GitHub 저장소 페이지로 이동**
   - `https://github.com/joshweb83/youcandleit`

2. **Settings 탭 클릭**

3. **좌측 메뉴에서 "Pages" 클릭**

4. **Source 설정**
   - Source: **GitHub Actions** 선택
   - (기존의 "Deploy from a branch" 아님!)

5. **저장 완료**

### 1.2 자동 배포 작동 방식

이제 **main 브랜치에 코드를 push할 때마다** 자동으로:

```
1. GitHub Actions 실행
2. 코드 빌드 (npm run build)
3. GitHub Pages에 배포
4. 사이트 업데이트 완료! 🎉
```

**예상 소요 시간**: 2-3분

---

## 2. 사이트 확인하기

### 2.1 배포된 사이트 URL

배포가 완료되면 다음 URL에서 확인 가능합니다:

**🔗 https://joshweb83.github.io/youcandleit**

### 2.2 배포 상태 확인

1. **GitHub 저장소 페이지 상단**의 **Actions 탭** 클릭

2. 최근 워크플로우 실행 내역 확인:
   - ✅ 녹색 체크: 배포 성공
   - ❌ 빨간 X: 배포 실패 (로그 확인 필요)
   - 🟡 노란 점: 배포 진행 중

3. 워크플로우 클릭 → 상세 로그 확인 가능

### 2.3 배포 과정 실시간 확인

```bash
# 터미널에서 실시간 확인 (선택사항)
git push origin main

# GitHub Actions 페이지에서 실시간 로그 확인
```

---

## 3. 배포 과정 이해하기

### 3.1 자동 배포 플로우

```
개발자 작업                GitHub Actions              GitHub Pages
─────────────────────────────────────────────────────────────────
   코드 수정
      ↓
   git commit
      ↓
   git push main ───────→  워크플로우 실행
                              ├─ Node.js 설정
                              ├─ npm ci (의존성 설치)
                              ├─ npm run build (빌드)
                              └─ 빌드 파일 업로드
                                    ↓
                                GitHub Pages 배포 ────→ 사이트 업데이트
                                                          ✅ 완료!
```

### 3.2 설정 파일 설명

#### `.github/workflows/deploy.yml`
- GitHub Actions 워크플로우 정의
- `main` 브랜치 push 시 자동 실행
- 빌드 및 배포 자동화

#### `vite.config.ts`
```typescript
base: process.env.NODE_ENV === 'production' ? '/youcandleit/' : '/'
```
- 로컬 개발: `/` 경로 사용
- 프로덕션: `/youcandleit/` 경로 사용 (GitHub Pages 규칙)

#### `public/.nojekyll`
- GitHub Pages의 Jekyll 처리 비활성화
- Vite 빌드 결과물 그대로 사용

---

## 4. 문제 해결

### 4.1 "404 Not Found" 오류

**원인**: GitHub Pages가 활성화되지 않았거나, 잘못된 경로

**해결**:
1. GitHub → Settings → Pages 확인
2. Source가 "GitHub Actions"로 설정되었는지 확인
3. 브라우저 캐시 삭제 후 재접속
4. 배포 완료까지 2-3분 대기

### 4.2 빌드 실패 (빨간 X)

**원인**: TypeScript 오류, 의존성 문제 등

**해결**:
1. Actions 탭에서 실패한 워크플로우 클릭
2. 로그에서 오류 메시지 확인
3. 로컬에서 `npm run build` 실행하여 동일한 오류 재현
4. 오류 수정 후 다시 push

### 4.3 CSS가 적용 안 됨

**원인**: 경로 문제

**해결**:
1. `vite.config.ts`의 `base` 설정 확인
2. 브라우저 개발자 도구(F12) → Console 탭에서 404 오류 확인
3. 경로가 `/youcandleit/assets/...`로 시작하는지 확인

### 4.4 배포가 너무 오래 걸림

**정상 소요 시간**: 2-3분

**5분 이상 소요 시**:
1. GitHub Status 페이지 확인: https://www.githubstatus.com/
2. Actions 탭에서 워크플로우 취소 후 재실행

---

## 5. 개발 워크플로우

### 5.1 일반적인 개발 과정

```bash
# 1. 기능 브랜치 생성
git checkout -b feature/new-feature

# 2. 코드 수정 및 로컬 테스트
npm run dev

# 3. 빌드 테스트
npm run build
npm run preview

# 4. 커밋
git add .
git commit -m "feat: Add new feature"

# 5. main 브랜치로 병합
git checkout main
git merge feature/new-feature

# 6. push → 자동 배포!
git push origin main

# 7. 2-3분 후 사이트 확인
# https://joshweb83.github.io/youcandleit
```

### 5.2 빠른 수정 & 배포

```bash
# 수정 후 바로 배포
git add .
git commit -m "fix: Quick fix"
git push origin main

# Actions 탭에서 배포 상태 확인
```

---

## 6. 고급 설정

### 6.1 커스텀 도메인 (선택사항)

GitHub Pages는 무료로 커스텀 도메인 사용 가능:

1. 도메인 구매 (예: `youcandle.it`)
2. DNS 설정에서 CNAME 레코드 추가:
   - `CNAME` → `joshweb83.github.io`
3. GitHub Settings → Pages → Custom domain 입력
4. HTTPS 자동 활성화 (Let's Encrypt)

### 6.2 환경 변수 설정

GitHub Pages는 환경 변수를 직접 지원하지 않으므로:

**방법 1**: 빌드 시 환경 변수 포함 (보안 주의!)
```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
```

**방법 2**: Vercel/Netlify로 마이그레이션 (추천)
- 환경 변수 관리 더 쉬움
- 무료 플랜 제공

---

## 7. Vercel로 마이그레이션 (나중에)

GitHub Pages로 시작했지만, Firebase API 키 등 환경 변수가 필요하면 Vercel로 이동:

### Vercel 장점:
- ✅ 환경 변수 GUI 관리
- ✅ 더 빠른 배포 (30초)
- ✅ 미리보기 배포 (PR마다 별도 URL)
- ✅ 분석 & 로그

### 마이그레이션 방법:
1. https://vercel.com 가입
2. "Import Git Repository" 클릭
3. GitHub 연동 후 저장소 선택
4. 환경 변수 입력
5. 배포 완료!

**비용**: 무료 (개인 프로젝트)

---

## 8. 체크리스트

배포 전 확인사항:

- [ ] `npm run build` 로컬에서 성공
- [ ] GitHub Settings → Pages → Source를 "GitHub Actions"로 설정
- [ ] `.github/workflows/deploy.yml` 파일 존재
- [ ] `public/.nojekyll` 파일 존재
- [ ] `vite.config.ts`에 올바른 `base` 설정
- [ ] main 브랜치에 push 완료
- [ ] Actions 탭에서 녹색 체크 확인
- [ ] https://joshweb83.github.io/youcandleit 접속 확인

---

## 9. 도움말

### 배포 관련 질문:
- GitHub Issues: https://github.com/joshweb83/youcandleit/issues
- GitHub Actions 문서: https://docs.github.com/en/actions
- Vite 배포 가이드: https://vitejs.dev/guide/static-deploy.html

### 긴급 롤백 (이전 버전으로 되돌리기):
```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main

# 또는 특정 커밋으로
git reset --hard <commit-hash>
git push -f origin main
```

---

**배포 설정이 완료되었습니다!** 🎉

이제 `main` 브랜치에 push하면 자동으로 사이트가 업데이트됩니다! 🚀
