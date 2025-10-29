/**
 * 주소 검색 모달 컴포넌트
 *
 * 도로명주소 API를 사용하여 주소를 검색하고 선택할 수 있습니다.
 */

import { useState } from 'react'
import { X, Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { searchAddress, type JusoAddress } from '@/services/juso/api'

interface AddressSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (address: JusoAddress) => void
}

export function AddressSearchModal({ isOpen, onClose, onSelect }: AddressSearchModalProps) {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<JusoAddress[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const countPerPage = 10

  const handleSearch = async (page: number = 1) => {
    if (!keyword.trim()) {
      setErrorMessage('검색어를 입력해주세요.')
      return
    }

    setIsSearching(true)
    setErrorMessage('')

    try {
      const result = await searchAddress(keyword, page, countPerPage)

      if (result.results.common.errorCode !== '0') {
        setErrorMessage(result.results.common.errorMessage || '주소 검색에 실패했습니다.')
        setSearchResults([])
        setTotalCount(0)
      } else {
        setSearchResults(result.results.juso || [])
        setTotalCount(parseInt(result.results.common.totalCount))
        setCurrentPage(page)

        if (result.results.juso.length === 0) {
          setErrorMessage('검색 결과가 없습니다. 다른 키워드로 검색해보세요.')
        }
      }
    } catch (error) {
      console.error('주소 검색 오류:', error)
      setErrorMessage('주소 검색 중 오류가 발생했습니다.')
      setSearchResults([])
      setTotalCount(0)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(1)
    }
  }

  const handleSelectAddress = (address: JusoAddress) => {
    onSelect(address)
    onClose()
  }

  const totalPages = Math.ceil(totalCount / countPerPage)

  if (!isOpen) return null

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/70 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">주소 검색</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 검색 입력 */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="도로명, 건물명 또는 지번을 입력하세요 (예: 세종대로, 광화문)"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-400"
                  disabled={isSearching}
                />
              </div>
              <button
                onClick={() => handleSearch(1)}
                disabled={isSearching}
                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
              >
                {isSearching ? '검색 중...' : '검색'}
              </button>
            </div>

            {/* 안내 메시지 */}
            <p className="mt-2 text-sm text-gray-400">
              💡 도로명, 건물명, 지번 등으로 검색할 수 있습니다.
            </p>
          </div>

          {/* 검색 결과 */}
          <div className="flex-1 overflow-y-auto p-6">
            {errorMessage && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm mb-4">
                {errorMessage}
              </div>
            )}

            {searchResults.length > 0 && (
              <>
                <div className="mb-4 text-sm text-gray-400">
                  총 <span className="text-yellow-500 font-semibold">{totalCount.toLocaleString()}</span>개의 주소가 검색되었습니다.
                </div>

                <div className="space-y-3">
                  {searchResults.map((address, index) => (
                    <button
                      key={`${address.bdMgtSn}-${index}`}
                      onClick={() => handleSelectAddress(address)}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white mb-1 group-hover:text-yellow-500 transition-colors">
                            {address.roadAddr}
                          </div>
                          <div className="text-sm text-gray-400">
                            지번: {address.jibunAddr}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            우편번호: {address.zipNo}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <button
                      onClick={() => handleSearch(currentPage - 1)}
                      disabled={currentPage === 1 || isSearching}
                      className="p-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                      aria-label="이전 페이지"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-sm text-gray-400">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => handleSearch(currentPage + 1)}
                      disabled={currentPage === totalPages || isSearching}
                      className="p-2 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                      aria-label="다음 페이지"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 초기 상태 */}
            {searchResults.length === 0 && !errorMessage && !isSearching && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  주소를 검색하려면 검색어를 입력하고<br />
                  검색 버튼을 클릭하세요.
                </p>
              </div>
            )}

            {/* 로딩 상태 */}
            {isSearching && (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400">주소를 검색하고 있습니다...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
