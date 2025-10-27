/**
 * 지도 페이지
 *
 * Leaflet 지도를 사용하여 집회 위치를 표시합니다.
 */

import { useTranslation } from 'react-i18next'
import { useEvents } from '@/hooks/useEvents'
import { MapView } from '@/components/map/MapView'
import { AlertCircle } from 'lucide-react'

export function MapPage() {
  const { t } = useTranslation()
  const { events, loading, error } = useEvents()

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🕯️</div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Firebase 설정 오류 처리
  if (error) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-900">
        <div className="max-w-2xl mx-auto px-6 py-8 bg-gray-800 rounded-lg border-2 border-yellow-500">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-yellow-500">
                Firebase 설정이 필요합니다
              </h2>
              <p className="text-gray-300 mb-4">
                앱을 사용하려면 Firebase 프로젝트 설정이 필요합니다.
              </p>

              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-white mb-2">설정 방법:</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>
                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Firebase Console
                    </a>
                    에서 새 프로젝트 생성
                  </li>
                  <li>Authentication에서 Google 로그인 활성화</li>
                  <li>Firestore Database 생성</li>
                  <li>Realtime Database 생성</li>
                  <li>프로젝트 설정에서 웹 앱 추가 후 설정값 복사</li>
                  <li>프로젝트 루트에 <code className="bg-gray-800 px-2 py-1 rounded">.env</code> 파일 생성</li>
                  <li>
                    <code className="bg-gray-800 px-2 py-1 rounded">.env.example</code> 파일을 참고하여 환경변수 입력
                  </li>
                </ol>
              </div>

              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <p className="text-sm text-red-400">
                  <strong>오류:</strong> {error.message}
                </p>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>자세한 설정 가이드는 <code className="bg-gray-900 px-2 py-1 rounded">FIREBASE_GUIDE.md</code> 파일을 참고하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      {events.length > 0 ? (
        <MapView events={events} />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold mb-2">{t('map.title')}</h2>
            <p className="text-gray-400 mb-2">등록된 집회가 없습니다</p>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Firebase Console에서 Firestore의 <code className="bg-gray-900 px-2 py-1 rounded">events</code> 컬렉션에
              집회 데이터를 추가하면 여기에 표시됩니다.
            </p>
            <div className="mt-6">
              <a
                href="/events"
                className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
              >
                집회 목록 보기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
