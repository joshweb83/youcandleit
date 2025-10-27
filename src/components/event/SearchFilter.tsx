/**
 * SearchFilter 컴포넌트
 *
 * 집회 검색 및 필터링 UI를 제공합니다.
 */

import { Filter, X, Calendar, Tag } from 'lucide-react'

export interface FilterState {
  dateFrom: string
  dateTo: string
  status: string // 'all' | 'scheduled' | 'ongoing' | 'ended'
  tags: string
  sortBy: string // 'date' | 'participants'
}

interface SearchFilterProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
}

export function SearchFilter({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onToggle,
}: SearchFilterProps) {
  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const hasActiveFilters =
    filters.dateFrom ||
    filters.dateTo ||
    filters.status !== 'all' ||
    filters.tags ||
    filters.sortBy !== 'date'

  return (
    <div className="mb-6">
      {/* 필터 토글 버튼 */}
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          hasActiveFilters
            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>필터</span>
        {hasActiveFilters && (
          <span className="bg-white text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">
            활성
          </span>
        )}
      </button>

      {/* 필터 패널 */}
      {isOpen && (
        <div className="mt-4 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">검색 필터</h3>
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                <span>초기화</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 날짜 범위 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>날짜 범위</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">시작일</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">종료일</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-semibold mb-2">상태</label>
              <select
                value={filters.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              >
                <option value="all">전체</option>
                <option value="scheduled">예정</option>
                <option value="ongoing">진행중</option>
                <option value="ended">종료</option>
              </select>
            </div>

            {/* 정렬 */}
            <div>
              <label className="block text-sm font-semibold mb-2">정렬</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              >
                <option value="date">날짜순</option>
                <option value="participants">참여자순</option>
              </select>
            </div>

            {/* 태그 검색 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span>태그 검색</span>
              </label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="태그로 검색 (쉼표로 구분)"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                예: 민주주의, 정의, 평화
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
