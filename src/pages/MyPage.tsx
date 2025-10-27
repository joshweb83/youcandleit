/**
 * 내 정보 페이지
 *
 * 사용자 프로필, 설정, 통계를 표시합니다.
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Settings, LogIn, LogOut, Star, Calendar, MapPin, Bell, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useNotifications } from '@/hooks/useNotifications'

export function MyPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, loading, login, logout, isAuthenticated } = useAuth()
  const { favoriteEvents, loadFavoriteEvents, loading: favoritesLoading } = useFavorites()
  const {
    permission,
    scheduledNotifications,
    requestPermission,
    cancelNotification,
    sendTest,
    hasPermission,
    isSupported,
  } = useNotifications()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(newLang)
  }

  // 즐겨찾기 집회 목록 로드
  useEffect(() => {
    if (isAuthenticated && user?.favorites && user.favorites.length > 0) {
      loadFavoriteEvents()
    }
  }, [isAuthenticated, user?.favorites, loadFavoriteEvents])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🕯️</div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 로그인 전 화면 */}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-4">{t('auth.login')}</h2>
          <p className="text-gray-400 mb-8">로그인하여 더 많은 기능을 사용하세요</p>
          <button
            onClick={login}
            className="inline-flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
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

      {/* 프로필 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
              👤
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
            <p className="text-gray-400">{user.email}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                관리자
              </span>
            )}
          </div>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('auth.logout')}</span>
        </button>
      </div>

      {/* 통계 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">참여 통계</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{user.stats.eventsAttended}</div>
            <div className="text-sm text-gray-400">참여한 집회</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{user.stats.commentsPosted}</div>
            <div className="text-sm text-gray-400">작성한 댓글</div>
          </div>
        </div>
      </div>

      {/* 즐겨찾기 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>즐겨찾기 ({user.favorites.length})</span>
        </h3>

        {favoritesLoading ? (
          <p className="text-gray-400">로딩 중...</p>
        ) : favoriteEvents.length > 0 ? (
          <div className="space-y-3">
            {favoriteEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-lg">{event.title}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      event.status === 'ongoing'
                        ? 'bg-green-500/20 text-green-400'
                        : event.status === 'scheduled'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {t(`event.${event.status}`)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{event.summary}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(event.datetime.start).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">즐겨찾기한 집회가 없습니다</p>
        )}
      </div>

      {/* 알림 설정 */}
      {isSupported && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <span>알림 설정</span>
          </h3>

          {/* 알림 권한 상태 */}
          <div className="mb-4 pb-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">알림 권한</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  hasPermission
                    ? 'bg-green-500/20 text-green-400'
                    : permission === 'denied'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {hasPermission ? '허용됨' : permission === 'denied' ? '거부됨' : '대기중'}
              </span>
            </div>

            {!hasPermission && permission !== 'denied' && (
              <button
                onClick={requestPermission}
                className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                알림 권한 요청
              </button>
            )}

            {permission === 'denied' && (
              <p className="text-xs text-gray-500 mt-2">
                브라우저 설정에서 알림을 허용해주세요.
              </p>
            )}

            {hasPermission && (
              <button
                onClick={sendTest}
                className="w-full mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                테스트 알림 보내기
              </button>
            )}
          </div>

          {/* 예약된 알림 목록 */}
          <div>
            <h4 className="font-semibold mb-3">
              예약된 알림 ({scheduledNotifications.length})
            </h4>
            {scheduledNotifications.length > 0 ? (
              <div className="space-y-2">
                {scheduledNotifications.map((notification) => (
                  <div
                    key={notification.eventId}
                    className="bg-gray-900 rounded-lg p-3 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">
                        {notification.eventTitle}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(notification.eventDate).toLocaleString('ko-KR')}
                      </div>
                      <div className="text-xs text-blue-400 mt-1">
                        알림: {new Date(notification.notificationTime).toLocaleString('ko-KR')}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        cancelNotification(notification.eventId)
                        alert('알림이 취소되었습니다.')
                      }}
                      className="p-1 hover:bg-gray-800 rounded transition-colors"
                      aria-label="알림 취소"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">
                예약된 알림이 없습니다
              </p>
            )}
          </div>
        </div>
      )}

      {/* 설정 */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>{t('settings.title')}</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>{t('settings.language')}</span>
            <button
              onClick={toggleLanguage}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {i18n.language === 'ko' ? 'English' : '한국어'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span>{t('settings.autoGPS')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user.settings.autoEnableGPS}
                className="sr-only peer"
                readOnly
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
