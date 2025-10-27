/**
 * 실시간 방송 페이지
 *
 * 실시간 스트리밍이 있는 집회만 표시합니다.
 */

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'

// YouTube URL을 임베드 URL로 변환
function getYouTubeEmbedUrl(url: string): string {
  // 일반 YouTube URL
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (match1) {
    return `https://www.youtube.com/embed/${match1[1]}`
  }

  // YouTube Live URL
  const match2 = url.match(/youtube\.com\/live\/([^&\s]+)/)
  if (match2) {
    return `https://www.youtube.com/embed/${match2[1]}`
  }

  // 이미 임베드 URL인 경우
  if (url.includes('youtube.com/embed/')) {
    return url
  }

  return url
}

export function LivePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { events, loading } = useEvents()

  // 실시간 방송이 있는 집회만 필터링
  const liveEvents = events.filter(
    (event) => event.liveStreamUrl && event.status === 'ongoing'
  )

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-2">🕯️</div>
          <p className="text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        <span>📺</span>
        <span>{t('nav.live')}</span>
        {liveEvents.length > 0 && (
          <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </h1>

      {/* 실시간 방송 목록 */}
      {liveEvents.length > 0 ? (
        <div className="space-y-8">
          {liveEvents.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {/* YouTube 임베드 */}
              {event.liveStreamUrl && (
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(event.liveStreamUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={event.title}
                  />
                </div>
              )}

              {/* 집회 정보 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold flex-1">{event.title}</h2>
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    LIVE
                  </span>
                </div>

                <p className="text-gray-300 mb-4">{event.summary}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.datetime.start).toLocaleString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-500">
                    <Users className="w-4 h-4" />
                    <span>{event.participantCount.toLocaleString()}명</span>
                  </div>
                </div>

                {/* 버튼 그룹 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
                  >
                    집회 상세보기
                  </button>
                  {event.liveStreamUrl && (
                    <a
                      href={event.liveStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>YouTube에서 보기</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 빈 상태 */
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <p className="text-gray-400">현재 실시간 방송 중인 집회가 없습니다</p>
          <p className="text-sm text-gray-500 mt-2">
            집회 주최자가 실시간 스트리밍을 시작하면 여기에 표시됩니다
          </p>
          <button
            onClick={() => navigate('/events')}
            className="mt-6 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
          >
            예정된 집회 보기
          </button>
        </div>
      )}
    </div>
  )
}
