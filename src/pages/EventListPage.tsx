/**
 * 집회 목록 페이지
 *
 * 모든 집회를 카드 형태로 표시합니다.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Calendar, MapPin, Users, Plus } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useAuth } from '@/hooks/useAuth'

export function EventListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const { isAdmin } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/events/create')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>새 집회 생성</span>
            </button>
          )}
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

      {/* 집회 목록 */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
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
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {searchTerm ? '🔍' : '📋'}
          </div>
          <p className="text-gray-400">
            {searchTerm ? '검색 결과가 없습니다' : '등록된 집회가 없습니다'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Firebase에 집회를 추가하면 여기에 표시됩니다
          </p>
        </div>
      )}
    </div>
  )
}
