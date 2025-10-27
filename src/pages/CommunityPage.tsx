/**
 * 커뮤니티 페이지
 *
 * 모든 집회의 응원 댓글을 통합하여 표시합니다.
 */

import { useTranslation } from 'react-i18next'
import { MessageSquare, Sparkles } from 'lucide-react'
import { useComments } from '@/hooks/useComments'
import { useEvents } from '@/hooks/useEvents'

export function CommunityPage() {
  const { t } = useTranslation()
  const { comments, loading: commentsLoading } = useComments()
  const { events, loading: eventsLoading } = useEvents()

  const loading = commentsLoading || eventsLoading

  // 댓글과 이벤트 데이터를 결합
  const enrichedComments = comments.map((comment) => {
    const event = events.find((e) => e.id === comment.eventId)
    return {
      ...comment,
      eventTitle: event?.title || '알 수 없는 집회',
    }
  })

  // 최신순으로 정렬
  const sortedComments = enrichedComments.sort((a, b) => b.createdAt - a.createdAt)

  // 상대 시간 계산
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        <MessageSquare className="w-8 h-8" />
        <span>{t('nav.community')}</span>
      </h1>

      {/* 댓글 피드 */}
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1 flex-wrap">
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
                    {getRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2 truncate">→ {comment.eventTitle}</p>
                <p className="text-white whitespace-pre-wrap break-words">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {sortedComments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-400">아직 작성된 댓글이 없습니다</p>
          <p className="text-sm text-gray-500 mt-2">
            집회에 응원 메시지를 남겨보세요!
          </p>
        </div>
      )}
    </div>
  )
}
