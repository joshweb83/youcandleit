/**
 * 메인 레이아웃 컴포넌트
 *
 * 전체 앱의 레이아웃 구조를 정의합니다.
 * - 헤더
 * - 네비게이션 바 (모바일: 하단, 데스크탑: 좌측)
 * - 메인 콘텐츠 영역
 */

import { ReactNode } from 'react'
import { Link } from 'react-router'
import { LogIn, LogOut, User } from 'lucide-react'
import { Navbar } from './Navbar'
import { useAuth } from '@/hooks/useAuth'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isAuthenticated, login, logout, loading } = useAuth()

  const handleLogin = async () => {
    try {
      await login()
    } catch (error) {
      console.error('로그인 오류:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert('로그아웃에 실패했습니다.')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700 z-40 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <h1 className="text-2xl" style={{ fontFamily: 'Pacifico, cursive' }}>youcandleit</h1>
          </Link>

          {/* 로그인/로그아웃 버튼 */}
          {!loading && (
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* 사용자 정보 */}
                  <div className="flex items-center space-x-2">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || '사용자'}
                        className="w-8 h-8 rounded-full border-2 border-gray-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm text-gray-300">
                      {user?.displayName || '사용자'}
                    </span>
                  </div>

                  {/* 로그아웃 버튼 */}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">로그아웃</span>
                  </button>
                </>
              ) : (
                /* 로그인 버튼 */
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Google 로그인</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

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
