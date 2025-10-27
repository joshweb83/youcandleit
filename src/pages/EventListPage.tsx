/**
 * 집회 목록 페이지
 *
 * 모든 집회를 카드 형태로 표시합니다.
 * TODO: Firebase에서 집회 데이터 가져오기, 검색/필터 기능
 */

import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

export function EventListPage() {
  const { t } = useTranslation()

  // TODO: 실제 데이터는 Firebase에서 가져오기
  const mockEvents = [
    {
      id: '1',
      title: '기후정의를 위한 집회',
      summary: '기후 위기에 대응하기 위한 시민 행동',
      date: '2025-11-15 14:00',
      location: '광화문 광장',
      participants: 1234,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{t('event.list')}</h1>

        {/* 검색 바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t('event.search')}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* 집회 목록 */}
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer"
          >
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-400 mb-4">{event.summary}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div>
                📅 {event.date} · 📍 {event.location}
              </div>
              <div className="text-yellow-500">👥 {event.participants.toLocaleString()}명</div>
            </div>
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {mockEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-400">등록된 집회가 없습니다</p>
        </div>
      )}
    </div>
  )
}
