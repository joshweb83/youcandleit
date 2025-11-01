/**
 * EventCardCompact 컴포넌트
 *
 * BottomSheet에 표시되는 컴팩트한 집회 카드
 */

import { MapPin, Calendar, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Event } from '@/types/event.types'

interface EventCardCompactProps {
  event: Event
  onCardClick?: (event: Event) => void
}

export function EventCardCompact({ event, onCardClick }: EventCardCompactProps) {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onCardClick) {
      onCardClick(event)
    }
  }

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/events/${event.id}`)
  }

  const getStatusBadge = () => {
    switch (event.status) {
      case 'ongoing':
        return (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
            🔴 진행중
          </span>
        )
      case 'scheduled':
        return (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
            예정
          </span>
        )
      case 'ended':
        return (
          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-semibold rounded-full border border-gray-500/30">
            종료
          </span>
        )
    }
  }

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800 hover:bg-gray-750 rounded-xl p-4 mb-3 cursor-pointer transition-all duration-200 border border-gray-700 hover:border-yellow-500/50"
    >
      <div className="flex items-start space-x-3">
        {/* 아이콘 */}
        <div className="flex-shrink-0 text-4xl">
          {event.icon || '🕯️'}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          {/* 제목 & 상태 */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-bold text-base line-clamp-2 flex-1 pr-2">
              {event.title}
            </h3>
            {getStatusBadge()}
          </div>

          {/* 요약 */}
          {event.summary && (
            <p className="text-gray-400 text-sm mb-2 line-clamp-1">
              {event.summary}
            </p>
          )}

          {/* 메타 정보 */}
          <div className="space-y-1.5">
            {/* 시간 */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {new Date(event.datetime.start).toLocaleString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* 장소 */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{event.location.address}</span>
            </div>

            {/* 참여자 수 */}
            <div className="flex items-center space-x-2 text-xs">
              <Users className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
              <span className="text-yellow-400 font-semibold">
                현장 {event.participantCount}명
              </span>
              {event.remoteCount > 0 && (
                <span className="text-blue-400 font-semibold">
                  · 원격 {event.remoteCount}명
                </span>
              )}
            </div>
          </div>

          {/* 상세보기 버튼 */}
          <button
            onClick={handleDetailClick}
            className="mt-3 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-bold rounded-lg transition-colors"
          >
            상세보기
          </button>
        </div>
      </div>
    </div>
  )
}
