/**
 * 댓글 작성 폼 컴포넌트
 *
 * 사용자가 집회에 응원 메시지를 작성할 수 있습니다.
 * AI 생성 메시지 옵션도 제공합니다.
 */

import { useState } from 'react'
import { Send, Sparkles, MapPin } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createComment } from '@/services/firebase/firestore'
import { generateSupportMessage } from '@/services/gemini/api'

interface CommentFormProps {
  eventId: string
  eventTitle: string
  onCommentCreated?: () => void
}

export function CommentForm({ eventId, eventTitle, onCommentCreated }: CommentFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [content, setContent] = useState('')
  const [isRemote, setIsRemote] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user || !content.trim()) return

    setIsSubmitting(true)
    try {
      await createComment({
        eventId,
        userId: user.uid,
        userName: user.displayName,
        content: content.trim(),
        isRemote,
        isAIGenerated: false,
      })
      setContent('')
      setIsRemote(false)
      onCommentCreated?.()
    } catch (error) {
      console.error('Failed to create comment:', error)
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!isAuthenticated || !user) return

    setIsGenerating(true)
    try {
      const aiMessage = await generateSupportMessage(eventTitle)
      setContent(aiMessage)
    } catch (error) {
      console.error('Failed to generate AI message:', error)
      alert('AI 메시지 생성에 실패했습니다.')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">로그인 후 댓글을 작성할 수 있습니다</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 댓글 입력 */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
            응원 메시지
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="집회에 참여하는 분들을 응원해주세요..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none"
            disabled={isSubmitting || isGenerating}
          />
        </div>

        {/* 옵션 */}
        <div className="flex items-center justify-between">
          {/* 원격 참여 체크박스 */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting || isGenerating}
            />
            <span className="text-sm text-gray-300 flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>원격으로 참여 중</span>
            </span>
          </label>

          {/* AI 생성 버튼 */}
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isSubmitting || isGenerating}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'AI 생성 중...' : 'AI 메시지 생성'}</span>
          </button>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || isGenerating || !content.trim()}
          className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-lg transition-colors"
        >
          <Send className="w-5 h-5" />
          <span>{isSubmitting ? '전송 중...' : '댓글 작성'}</span>
        </button>
      </form>
    </div>
  )
}
