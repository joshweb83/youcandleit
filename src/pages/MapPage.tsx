/**
 * 지도 페이지
 *
 * Leaflet 지도를 사용하여 집회 위치를 표시합니다.
 */

import { useTranslation } from 'react-i18next'
import { useEvents } from '@/hooks/useEvents'
import { MapView } from '@/components/map/MapView'

export function MapPage() {
  const { t } = useTranslation()
  const { events, loading } = useEvents()

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

  return (
    <div className="h-[calc(100vh-4rem)]">
      {events.length > 0 ? (
        <MapView events={events} />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold mb-2">{t('map.title')}</h2>
            <p className="text-gray-400">등록된 집회가 없습니다</p>
            <p className="text-sm text-gray-500 mt-2">
              Firebase에 집회를 추가하면 여기에 표시됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
