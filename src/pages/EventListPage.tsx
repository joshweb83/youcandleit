/**
 * 집회 목록 페이지
 *
 * 모든 집회를 카드 형태로 표시합니다.
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Calendar, MapPin, Users, Plus, Heart } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { SearchFilter, type FilterState } from '@/components/event/SearchFilter'

export function EventListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const { isAdmin } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    tags: '',
    sortBy: 'date',
  })

  // 필터 및 정렬 로직
  const filteredEvents = useMemo(() => {
    let result = events.filter((event) => {
      // 검색어 필터
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      // 날짜 범위 필터
      if (filters.dateFrom) {
        const eventDate = new Date(event.datetime.start)
        const fromDate = new Date(filters.dateFrom)
        if (eventDate < fromDate) return false
      }

      if (filters.dateTo) {
        const eventDate = new Date(event.datetime.start)
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // 종료일의 끝까지
        if (eventDate > toDate) return false
      }

      // 상태 필터
      if (filters.status !== 'all' && event.status !== filters.status) {
        return false
      }

      // 태그 필터
      if (filters.tags) {
        const searchTags = filters.tags
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0)

        const hasMatchingTag = searchTags.some((searchTag) =>
          event.tags.some((eventTag) =>
            eventTag.toLowerCase().includes(searchTag)
          )
        )

        if (!hasMatchingTag) return false
      }

      return true
    })

    // 정렬
    if (filters.sortBy === 'date') {
      result.sort((a, b) => {
        return new Date(b.datetime.start).getTime() - new Date(a.datetime.start).getTime()
      })
    } else if (filters.sortBy === 'participants') {
      result.sort((a, b) => b.participantCount - a.participantCount)
    }

    return result
  }, [events, searchTerm, filters])

  const handleResetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: 'all',
      tags: '',
      sortBy: 'date',
    })
  }

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
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t('event.list')}</h1>
        </div>

        {/* 검색 바 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('event.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400"
          />
        </div>

        {/* 검색 필터 */}
        <SearchFilter
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          isOpen={filterOpen}
          onToggle={() => setFilterOpen(!filterOpen)}
        />
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
          {(searchTerm || filters.dateFrom || filters.dateTo || filters.status !== 'all' || filters.tags) && (
            <button
              onClick={() => {
                setSearchTerm('')
                handleResetFilters()
              }}
              className="text-yellow-500 hover:text-yellow-400 text-sm underline"
            >
              검색 및 필터 초기화
            </button>
          )}
        </div>
      )}

      {/* Floating Action Button - 새 집회 생성 (관리자 전용) */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin/events/create')}
          className="fixed bottom-20 right-6 md:right-8 lg:right-12 w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 flex items-center justify-center group z-50"
          aria-label="새 집회 생성"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            새 집회 생성
          </span>
        </button>
      )}
    </div>
  )
}
