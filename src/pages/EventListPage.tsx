/**
 * 집회 목록 페이지
 *
 * 모든 집회를 카드 형태로 표시합니다.
 */

import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Heart, Calendar, MapPin, Users } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useFavorites } from '@/hooks/useFavorites'
import { SearchFilter, type FilterState } from '@/components/event/SearchFilter'

// 두 좌표 간 거리 계산 (Haversine formula, km 단위)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // 지구 반경 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function EventListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'date',
  })
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // 사용자 위치 가져오기
  useEffect(() => {
    if (filters.sortBy === 'distance' && !userLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.warn('위치 정보를 가져올 수 없습니다:', error)
            // 서울 시청을 기본 위치로 설정
            setUserLocation({ lat: 37.5665, lng: 126.978 })
          }
        )
      } else {
        // GPS를 지원하지 않으면 서울 시청 기본 위치
        setUserLocation({ lat: 37.5665, lng: 126.978 })
      }
    }
  }, [filters.sortBy, userLocation])

  // 필터 및 정렬 로직
  const filteredEvents = useMemo(() => {
    let result = events.filter((event) => {
      // 검색어 필터
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })

    // 정렬
    if (filters.sortBy === 'date') {
      result.sort((a, b) => {
        return new Date(b.datetime.start).getTime() - new Date(a.datetime.start).getTime()
      })
    } else if (filters.sortBy === 'participants') {
      result.sort((a, b) => b.participantCount - a.participantCount)
    } else if (filters.sortBy === 'distance' && userLocation) {
      result.sort((a, b) => {
        const distA = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          a.location.coordinates.lat,
          a.location.coordinates.lng
        )
        const distB = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          b.location.coordinates.lat,
          b.location.coordinates.lng
        )
        return distA - distB
      })
    }

    return result
  }, [events, searchTerm, filters, userLocation])

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t('event.list')}</h1>

          {/* 정렬 버튼 */}
          <SearchFilter
            filters={filters}
            onFilterChange={setFilters}
            isOpen={filterOpen}
            onToggle={() => setFilterOpen(!filterOpen)}
          />
        </div>

        {/* 검색 바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('event.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* 결과 카운트 */}
      <div className="mb-4 text-sm text-gray-400">
        총 {filteredEvents.length}개의 집회
      </div>

      {/* 집회 목록 */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors relative"
          >
            {/* 즐겨찾기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(event.id)
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
              aria-label="즐겨찾기 토글"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite(event.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }`}
              />
            </button>

            <div
              onClick={() => navigate(`/events/${event.id}`)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2 pr-12">
                <h3 className="text-xl font-bold flex-1">{event.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
              <p className="text-gray-400 mb-4">{event.summary}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.datetime.start).toLocaleString('ko-KR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location.address}</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Users className="w-4 h-4" />
                  <span>{event.participantCount.toLocaleString()}명</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400 mb-2">검색 결과가 없습니다</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-yellow-500 hover:text-yellow-400 text-sm underline"
            >
              검색 초기화
            </button>
          )}
        </div>
      )}

      {/* Floating Action Button - 새 집회 생성 */}
      <button
          onClick={() => navigate('/admin/events/create')}
          className="fixed bottom-20 md:bottom-6 right-6 md:right-8 lg:right-12 w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 flex items-center justify-center group z-50"
          aria-label="새 집회 생성"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            새 집회 생성
          </span>
      </button>
    </div>
  )
}
