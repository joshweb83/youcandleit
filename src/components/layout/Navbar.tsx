/**
 * 네비게이션 바 컴포넌트
 *
 * 5개 탭: 지도, 목록, 실시간 방송, 커뮤니티, 내 정보
 * - 모바일: 하단 고정
 * - 데스크탑: 좌측 사이드바
 */

import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Map, List, Radio, MessageCircle, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Map, labelKey: 'nav.map' },
  { path: '/events', icon: List, labelKey: 'nav.events' },
  { path: '/live', icon: Radio, labelKey: 'nav.live' },
  { path: '/community', icon: MessageCircle, labelKey: 'nav.community' },
  { path: '/my', icon: User, labelKey: 'nav.mypage' },
]

export function Navbar() {
  const { t } = useTranslation()

  return (
    <>
      {/* 모바일 네비게이션 (하단) */}
      <nav className="md:hidden bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, labelKey }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-yellow-500'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{t(labelKey)}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* 데스크탑 네비게이션 (좌측) */}
      <nav className="hidden md:block w-64 bg-gray-800 border-r border-gray-700 min-h-screen sticky top-16">
        <div className="p-4 space-y-2">
          {navItems.map(({ path, icon: Icon, labelKey }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-yellow-500'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
