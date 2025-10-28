/**
 * 메인 레이아웃 컴포넌트
 *
 * 전체 앱의 레이아웃 구조를 정의합니다.
 * - 헤더
 * - 네비게이션 바 (모바일: 하단, 데스크탑: 좌측)
 * - 메인 콘텐츠 영역
 */

import { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🕯️</span>
            <h1 className="text-xl font-bold">Youcandle it</h1>
          </div>
          {/* 추후: 알림, 언어 선택, 프로필 추가 */}
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex">
        {/* 데스크탑 네비게이션 (좌측) */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* 콘텐츠 */}
        <main className="flex-1 pb-24 md:pb-0">
          {children}
        </main>
      </div>

      {/* 모바일 네비게이션 (하단) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <Navbar />
      </div>
    </div>
  )
}
