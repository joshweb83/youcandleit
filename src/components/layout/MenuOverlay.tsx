/**
 * 오버레이 메뉴 컴포넌트
 *
 * 햄버거 메뉴 클릭 시 나타나는 사이드 메뉴
 * 로그인, 회원가입, 주요 메뉴 포함
 */

import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { X, LogIn, LogOut, User, Map, Calendar, MessageCircle, Radio, Languages } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const { user, isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const handleLogin = async () => {
    try {
      await login()
      onClose()
    } catch (error) {
      console.error('로그인 오류:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      onClose()
    } catch (error) {
      console.error('로그아웃 오류:', error)
      alert('로그아웃에 실패했습니다.')
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-[100]"
        onClick={onClose}
      />

      {/* 메뉴 패널 */}
      <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-gray-800 shadow-xl z-[101] overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">메뉴</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="메뉴 닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 사용자 정보 */}
          {isAuthenticated && user ? (
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center space-x-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || '사용자'}
                    className="w-12 h-12 rounded-full border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="font-semibold">{user.displayName || '사용자'}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-700 bg-gray-900">
              <p className="text-gray-400 text-sm">로그인하여 더 많은 기능을 이용하세요</p>
            </div>
          )}

          {/* 메뉴 목록 */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {/* 주요 메뉴 */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">메뉴</h3>
                <button
                  onClick={() => handleNavigation('/')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <Map className="w-5 h-5 text-gray-400" />
                  <span>지도</span>
                </button>
                <button
                  onClick={() => handleNavigation('/events')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span>집회 목록</span>
                </button>
                <button
                  onClick={() => handleNavigation('/live')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <Radio className="w-5 h-5 text-gray-400" />
                  <span>라이브</span>
                </button>
                <button
                  onClick={() => handleNavigation('/community')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <span>커뮤니티</span>
                </button>
              </div>

              {/* 계정 메뉴 */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">계정</h3>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleNavigation('/my')}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <User className="w-5 h-5 text-gray-400" />
                      <span>내 정보</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5 text-gray-400" />
                      <span>로그아웃</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left font-semibold"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Google 로그인</span>
                    </button>
                    <div className="mt-2 px-4 py-2 text-xs text-gray-400">
                      <p>현재는 Google 계정으로만 로그인할 수 있습니다.</p>
                    </div>
                  </>
                )}
              </div>

              {/* 설정 메뉴 */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">{t('settings.title')}</h3>

                {/* 언어 설정 */}
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Languages className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{t('settings.language')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleLanguageChange('ko')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          i18n.language === 'ko'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        한국어
                      </button>
                      <button
                        onClick={() => handleLanguageChange('en')}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          i18n.language === 'en'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* 푸터 */}
          <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-500">
            <p>&copy; 2025 youcandleit</p>
          </div>
        </div>
      </div>
    </>
  )
}
