/**
 * 커뮤니티 페이지
 *
 * 모든 집회의 응원 댓글을 통합하여 표시합니다.
 * TODO: Firebase에서 댓글 데이터 가져오기
 */

import { useTranslation } from 'react-i18next'

export function CommunityPage() {
  const { t } = useTranslation()

  // TODO: 실제 데이터는 Firebase에서 가져오기
  const mockComments = [
    {
      id: '1',
      userName: '홍길동',
      eventTitle: '기후정의를 위한 집회',
      content: '함께해요! 우리의 미래를 위해 💪',
      isRemote: true,
      timestamp: '5분 전',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">{t('nav.community')}</h1>

      {/* 댓글 피드 */}
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold">{comment.userName}</span>
                  {comment.isRemote && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                      원격 참여
                    </span>
                  )}
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">→ {comment.eventTitle}</p>
                <p className="text-white">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {mockComments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-400">아직 작성된 댓글이 없습니다</p>
        </div>
      )}
    </div>
  )
}
