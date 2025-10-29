/**
 * 이벤트 아이콘 선택 컴포넌트
 *
 * 기본 촛불 이모지 또는 커스텀 이미지를 선택할 수 있습니다.
 */

import { useState } from 'react'
import { Check } from 'lucide-react'

interface IconSelectorProps {
  selectedIcon?: string
  onChange: (icon: string) => void
}

// 기본 제공 촛불 아이콘들
const PRESET_ICONS = [
  '🕯️', // 기본 촛불
  '🔥', // 불꽃
  '💡', // 전구
  '✨', // 반짝임
  '⭐', // 별
  '🌟', // 빛나는 별
  '💫', // 회오리
  '🎆', // 불꽃놀이
  '🎇', // 폭죽
  '🏮', // 제등
  '🪔', // 기름 램프
  '🔆', // 밝은 태양
]

export function IconSelector({ selectedIcon, onChange }: IconSelectorProps) {
  const [customIcon, setCustomIcon] = useState('')

  const handlePresetSelect = (icon: string) => {
    onChange(icon)
    setCustomIcon('')
  }

  const handleCustomIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomIcon(value)
    if (value.trim()) {
      onChange(value.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          집회 아이콘 선택
        </label>
        <p className="text-xs text-gray-400 mb-3">
          지도에 표시될 아이콘을 선택하세요 (기본: 🕯️)
        </p>

        {/* 기본 아이콘 그리드 */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {PRESET_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => handlePresetSelect(icon)}
              className={`relative aspect-square flex items-center justify-center text-3xl rounded-lg border-2 transition-all ${
                selectedIcon === icon
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-900'
              }`}
            >
              {icon}
              {selectedIcon === icon && (
                <div className="absolute top-1 right-1 bg-yellow-500 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-gray-900" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 커스텀 이모지 입력 */}
        <div>
          <label htmlFor="customIcon" className="block text-xs font-medium text-gray-400 mb-2">
            또는 커스텀 이모지/아이콘 입력
          </label>
          <input
            id="customIcon"
            type="text"
            value={customIcon}
            onChange={handleCustomIconChange}
            placeholder="예: 🎉 또는 이미지 URL"
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            이모지를 직접 입력하거나 이미지 URL을 입력할 수 있습니다
          </p>
        </div>

        {/* 선택된 아이콘 미리보기 */}
        {selectedIcon && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">선택된 아이콘:</p>
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{selectedIcon}</div>
              <div className="text-sm text-gray-300">
                지도에 이 아이콘이 표시됩니다
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
