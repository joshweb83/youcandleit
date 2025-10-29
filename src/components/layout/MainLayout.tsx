/**
 * 메인 레이아웃 컴포넌트
 *
 * 전체 앱의 레이아웃 구조를 정의합니다.
 * - 헤더
 * - 네비게이션 바 (모바일: 하단, 데스크탑: 좌측)
 * - 메인 콘텐츠 영역
 */

import { ReactNode, useState } from 'react'
import { Link } from 'react-router'
import { Menu } from 'lucide-react'
import { Navbar } from './Navbar'
import { MenuOverlay } from './MenuOverlay'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700 z-40 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 햄버거 메뉴 아이콘 */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* 로고 (중앙 정렬) */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-2xl" style={{ fontFamily: 'Pacifico, cursive' }}>youcandleit</h1>
          </Link>

          {/* 오른쪽 빈 공간 (대칭을 위해) */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* 오버레이 메뉴 */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 데스크탑 네비게이션 (좌측) */}
        <div className="hidden md:block flex-shrink-0">
          <Navbar />
        </div>

        {/* 콘텐츠 - 독립적으로 스크롤 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 모바일 네비게이션 (하단) */}
      <div className="md:hidden flex-shrink-0 z-50">
        <Navbar />
      </div>
    </div>
  )
}
