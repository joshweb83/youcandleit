/**
 * 지도 페이지
 *
 * Leaflet 지도를 사용하여 집회 위치를 표시합니다.
 * TODO: Leaflet 지도 통합, 실시간 촛불 표시
 */

import { useTranslation } from 'react-i18next'

export function MapPage() {
  const { t } = useTranslation()

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      {/* 지도 컨테이너 */}
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">{t('map.title')}</h2>
          <p className="text-gray-400">Leaflet 지도가 여기에 표시됩니다</p>
          <p className="text-sm text-gray-500 mt-4">
            Phase 3에서 구현 예정: 집회 마커, 촛불 아이콘, 날씨 정보
          </p>
        </div>
      </div>
    </div>
  )
}
