/**
 * 집회 상세 페이지
 *
 * 특정 집회의 상세 정보와 댓글을 표시합니다.
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Clock, ArrowLeft, Sparkles, Flame } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useComments } from '@/hooks/useComments'
import { useCandles } from '@/hooks/useCandles'
import { useAuth } from '@/hooks/useAuth'
import { CommentForm } from '@/components/comment/CommentForm'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { events, loading: eventsLoading } = useEvents()
  const { comments, loading: commentsLoading, refetch: refetchComments } = useComments(id)

  const event = events.find((e) => e.id === id)
  const { myCandle, onsiteCount, remoteCount, lightCandle, blowCandle, isLit } = useCandles({
    eventId: id,
    event,
  })

  const loading = eventsLoading || commentsLoading

  const handleToggleCandle = async () => {
    if (!id) return

    if (isLit) {
      await blowCandle(id)
    } else {
      // 원격 참여로 촛불 켜기 (GPS 없이)
      await lightCandle(id, false)
    }
  }

  // 이벤트를 찾지 못했을 때
  if (!eventsLoading && !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">집회를 찾을 수 없습니다</h2>
          <p className="text-gray-400 mb-6">요청하신 집회가 존재하지 않습니다</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>집회 목록으로</span>
          </button>
        </div>
      </div>
    )
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

  if (!event) return null

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 뒤로 가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뒤로 가기</span>
      </button>

      {/* 집회 정보 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold flex-1">{event.title}</h1>
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

        <p className="text-gray-300 mb-6 whitespace-pre-wrap">{event.description}</p>

        {/* 요약 정보 */}
        {event.summary && (
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">요약</h3>
            <p className="text-gray-300">{event.summary}</p>
          </div>
        )}

        {/* 상세 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-400">시작 시간</div>
              <div className="text-white">{formatDateTime(event.datetime.start)}</div>
            </div>
          </div>

          {event.datetime.end && (
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-400">종료 시간</div>
                <div className="text-white">{formatDateTime(event.datetime.end)}</div>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-400">장소</div>
              <div className="text-white">{event.location.address}</div>
              {event.location.details && (
                <div className="text-sm text-gray-400 mt-1">{event.location.details}</div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Flame className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <div className="text-sm text-gray-400">촛불 켜진 수</div>
              <div className="text-white">
                🕯️ 현장 {onsiteCount}개
                <span className="text-blue-400 ml-2">🌐 원격 {remoteCount}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* 촛불 켜기/끄기 버튼 */}
        {isAuthenticated && (
          <button
            onClick={handleToggleCandle}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              isLit
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/50'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Flame className={`w-6 h-6 ${isLit ? 'animate-pulse' : ''}`} />
              <span>{isLit ? '촛불 끄기' : '촛불 켜기 (원격 참여)'}</span>
            </div>
            {isLit && myCandle && (
              <div className="text-sm mt-2 opacity-90">
                {myCandle.type === 'onsite' ? '현장 참여 중' : '원격 참여 중'}
              </div>
            )}
          </button>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">
          응원 메시지 <span className="text-gray-400 text-lg">({comments.length})</span>
        </h2>

        {/* 댓글 작성 폼 */}
        <CommentForm
          eventId={event.id}
          eventTitle={event.title}
          onCommentCreated={refetchComments}
        />

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <span className="font-bold">{comment.userName}</span>
                      {comment.isRemote && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          🌐 원격 참여
                        </span>
                      )}
                      {comment.isAIGenerated && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI 생성</span>
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-white whitespace-pre-wrap break-words">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 댓글 없음 */}
        {comments.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-gray-400">첫 번째 응원 메시지를 남겨주세요!</p>
          </div>
        )}
      </div>
    </div>
  )
}
