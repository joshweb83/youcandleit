/**
 * SearchFilter 컴포넌트
 *
 * 정렬 옵션을 제공하는 오버레이 모달
 */

import { ArrowUpDown, X, Clock, Users, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface FilterState {
  sortBy: string // 'date' | 'participants' | 'distance'
}

interface SearchFilterProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  isOpen: boolean
  onToggle: () => void
}

export function SearchFilter({
  filters,
  onFilterChange,
  isOpen,
  onToggle,
}: SearchFilterProps) {
  const { i18n } = useTranslation()
  const isKorean = i18n.language === 'ko'

  const handleSortChange = (sortBy: string) => {
    onFilterChange({ sortBy })
    onToggle() // 선택 후 모달 닫기
  }

  const sortOptions = [
    {
      value: 'date',
      icon: Clock,
      labelKo: '최신순',
      labelEn: 'Latest',
      descKo: '최신 집회부터 표시',
      descEn: 'Show newest events first',
    },
    {
      value: 'participants',
      icon: Users,
      labelKo: '인원순',
      labelEn: 'Participants',
      descKo: '참여자가 많은 순서',
      descEn: 'Most participants first',
    },
    {
      value: 'distance',
      icon: MapPin,
      labelKo: '거리순',
      labelEn: 'Distance',
      descKo: '가까운 집회부터 표시',
      descEn: 'Nearest events first',
    },
  ]

  return (
    <>
      {/* 정렬 버튼 */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gray-800 hover:bg-gray-700 text-gray-300"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>{isKorean ? '정렬' : 'Sort'}</span>
      </button>

      {/* 오버레이 모달 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-[100]"
            onClick={onToggle}
          />

          {/* 모달 컨텐츠 */}
          <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-[101] px-4">
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
              {/* 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-bold">
                  {isKorean ? '정렬 기준' : 'Sort By'}
                </h3>
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 정렬 옵션 */}
              <div className="p-3 space-y-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = filters.sortBy === option.value

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isSelected
                          ? 'bg-yellow-600 text-white shadow-lg'
                          : 'bg-gray-900 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold">
                            {isKorean ? option.labelKo : option.labelEn}
                          </div>
                          <div className={`text-sm ${isSelected ? 'text-yellow-100' : 'text-gray-400'}`}>
                            {isKorean ? option.descKo : option.descEn}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
