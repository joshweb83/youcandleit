/**
 * NotificationPrompt 컴포넌트
 *
 * 알림 권한 요청 UI를 제공합니다.
 */

import { Bell, X } from 'lucide-react'

interface NotificationPromptProps {
  onAllow: () => void
  onDismiss: () => void
}

export function NotificationPrompt({ onAllow, onDismiss }: NotificationPromptProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 mb-6 relative">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-black/20 rounded-full transition-colors"
        aria-label="닫기"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-1">알림 받기</h3>
          <p className="text-sm mb-3 opacity-90">
            집회 시작 30분 전에 알림을 받아보세요!
          </p>
          <button
            onClick={onAllow}
            className="bg-white text-yellow-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
          >
            알림 허용하기
          </button>
        </div>
      </div>
    </div>
  )
}
