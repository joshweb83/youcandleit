/**
 * 관리자 이벤트 생성 페이지
 *
 * 관리자가 새로운 집회를 생성할 수 있습니다.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Calendar, MapPin, Video, Search, Upload, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createEvent } from '@/services/firebase/firestore'
import { uploadPosterImage } from '@/services/firebase/storage'
import { IconSelector } from '@/components/event/IconSelector'
import { AddressSearchModal } from '@/components/address/AddressSearchModal'
import { getCoordinatesFromAddress } from '@/services/juso/api'
import type { EventInput } from '@/types/event.types'
import type { JusoAddress } from '@/services/juso/api'

export function AdminEventCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [formData, setFormData] = useState<EventInput>({
    title: '',
    description: '',
    summary: '',
    posterImage: '',
    icon: '🕯️',
    location: {
      address: '',
      details: '',
      coordinates: {
        lat: 37.5665,
        lng: 126.978,
      },
      radius: 500,
    },
    datetime: {
      start: '',
      end: '',
    },
    organizer: '',
    liveStreamUrl: '',
    tags: [],
    status: 'scheduled',
    createdBy: user?.uid || '',
  })

  const [tagInput, setTagInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.datetime.start) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const eventId = await createEvent({
        ...formData,
        createdBy: user?.uid || '',
      })

      if (eventId) {
        alert('집회가 성공적으로 생성되었습니다!')
        navigate(`/events/${eventId}`)
      } else {
        alert('집회 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('집회 생성 오류:', error)
      alert('집회 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleSelectAddress = async (address: JusoAddress) => {
    // 좌표 변환 시도 (실제로는 카카오 맵 API 등을 사용해야 함)
    const coordinates = await getCoordinatesFromAddress(address.roadAddr)

    setFormData({
      ...formData,
      location: {
        ...formData.location,
        address: address.roadAddr,
        coordinates: coordinates || formData.location.coordinates,
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>뒤로 가기</span>
        </button>
        <h1 className="text-3xl font-bold">새 집회 생성</h1>
        <p className="text-gray-400 mt-2">집회 정보를 입력하여 새로운 집회를 등록하세요</p>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Calendar className="w-6 h-6" />
            <span>기본 정보</span>
          </h2>

          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              집회 제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 기후정의를 위한 촛불집회"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              required
            />
          </div>

          {/* 요약 */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium mb-2">
              한 줄 요약 <span className="text-gray-400 text-xs">(목록 표출용)</span>
            </label>
            <input
              id="summary"
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="집회를 한 문장으로 설명하세요 (집회 목록에만 표시됩니다)"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              ℹ️ 이 요약은 집회 목록 페이지에만 표시되며, 상세 페이지에는 표시되지 않습니다.
            </p>
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              상세 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="집회의 목적과 내용을 자세히 설명하세요..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white resize-none"
              required
            />
          </div>

          {/* 주최자 */}
          <div>
            <label htmlFor="organizer" className="block text-sm font-medium mb-2">
              주최 단체
            </label>
            <input
              id="organizer"
              type="text"
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="예: 시민환경연대"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            />
          </div>

          {/* 포스터 이미지 URL */}
          <div>
            <label htmlFor="posterImage" className="block text-sm font-medium mb-2">
              포스터 이미지 URL
            </label>
            <input
              id="posterImage"
              type="url"
              value={formData.posterImage}
              onChange={(e) => setFormData({ ...formData, posterImage: e.target.value })}
              placeholder="https://example.com/poster.jpg"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              포스터 이미지 URL을 입력하세요. 집회 상세 페이지에 표시됩니다.
            </p>
            {formData.posterImage && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">미리보기:</p>
                <img
                  src={formData.posterImage}
                  alt="포스터 미리보기"
                  className="max-w-xs rounded-lg border border-gray-700"
                  onError={(e) => {
                    e.currentTarget.src = ''
                    e.currentTarget.alt = '이미지를 불러올 수 없습니다'
                  }}
                />
              </div>
            )}
          </div>

          {/* 아이콘 선택 */}
          <IconSelector
            selectedIcon={formData.icon}
            onChange={(icon) => setFormData({ ...formData, icon })}
          />
        </div>

        {/* 일시 */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Calendar className="w-6 h-6" />
            <span>일시</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 시작 시간 */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                시작 시간 <span className="text-red-500">*</span>
              </label>
              <input
                id="startTime"
                type="datetime-local"
                value={formData.datetime.start}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    datetime: { ...formData.datetime, start: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                required
              />
            </div>

            {/* 종료 시간 */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                종료 시간 (선택)
              </label>
              <input
                id="endTime"
                type="datetime-local"
                value={formData.datetime.end}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    datetime: { ...formData.datetime, end: e.target.value },
                  })
                }
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              />
            </div>
          </div>
        </div>

        {/* 장소 */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <MapPin className="w-6 h-6" />
            <span>장소</span>
          </h2>

          {/* 주소 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              주소 <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                id="address"
                type="text"
                value={formData.location.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value },
                  })
                }
                placeholder="예: 서울특별시 중구 태평로1가 31"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setIsAddressSearchOpen(true)}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
              >
                <Search className="w-5 h-5" />
                <span>주소 검색</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              주소 검색 버튼을 클릭하여 도로명주소를 검색할 수 있습니다.
            </p>
          </div>

          {/* 상세 주소 */}
          <div>
            <input
              id="details"
              type="text"
              value={formData.location.details}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, details: e.target.value },
                })
              }
              placeholder="상세주소 예: 서울시청역 5번 출구 앞"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            />
          </div>

          {/* 인증 반경 */}
          <div>
            <label htmlFor="radius" className="block text-sm font-medium mb-2">
              현장 인증 반경 <span className="text-red-500">*</span>
            </label>
            <select
              id="radius"
              value={formData.location.radius}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    radius: parseInt(e.target.value),
                  },
                })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              required
            >
              <option value="100">100m</option>
              <option value="200">200m</option>
              <option value="300">300m</option>
              <option value="500">500m</option>
              <option value="1000">1km</option>
              <option value="2000">2km</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              이 반경 내에 있는 참여자만 현장 인증을 할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Video className="w-6 h-6" />
            <span>추가 정보</span>
          </h2>

          {/* 라이브 스트리밍 URL */}
          <div>
            <label htmlFor="liveStreamUrl" className="block text-sm font-medium mb-2">
              YouTube 라이브 URL (선택)
            </label>
            <input
              id="liveStreamUrl"
              type="url"
              value={formData.liveStreamUrl}
              onChange={(e) => setFormData({ ...formData, liveStreamUrl: e.target.value })}
              placeholder="https://youtube.com/live/..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            />
          </div>

          {/* 태그 */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              태그
            </label>
            <div className="flex space-x-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="태그 입력 후 Enter"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                추가
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-gray-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 상태 */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              집회 상태
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            >
              <option value="scheduled">예정됨</option>
              <option value="ongoing">진행 중</option>
              <option value="ended">종료됨</option>
            </select>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/events')}
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? '생성 중...' : '집회 생성'}</span>
          </button>
        </div>
      </form>

      {/* 주소 검색 모달 */}
      <AddressSearchModal
        isOpen={isAddressSearchOpen}
        onClose={() => setIsAddressSearchOpen(false)}
        onSelect={handleSelectAddress}
      />
    </div>
  )
}
