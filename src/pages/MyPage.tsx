/**
 * 내 정보 페이지
 *
 * 사용자 프로필, 설정, 통계를 표시합니다.
 * TODO: Firebase Auth 통합, Google 로그인
 */

import { useTranslation } from 'react-i18next'
import { Settings, LogIn } from 'lucide-react'

export function MyPage() {
  const { t, i18n } = useTranslation()

  // TODO: 실제 사용자 정보는 Firebase Auth에서 가져오기
  const isLoggedIn = false

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(newLang)
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 로그인 전 화면 */}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-4">{t('auth.login')}</h2>
          <p className="text-gray-400 mb-8">로그인하여 더 많은 기능을 사용하세요</p>
          <button className="inline-flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            <LogIn className="w-5 h-5" />
            <span>{t('auth.googleLogin')}</span>
          </button>
        </div>

        {/* 언어 설정 (로그인 없이도 사용 가능) */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t('settings.title')}</span>
          </h3>
          <div className="flex items-center justify-between">
            <span>{t('settings.language')}</span>
            <button
              onClick={toggleLanguage}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {i18n.language === 'ko' ? 'English' : '한국어'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('nav.mypage')}</h1>
      {/* TODO: 로그인 후 프로필, 통계, 즐겨찾기 등 */}
    </div>
  )
}
