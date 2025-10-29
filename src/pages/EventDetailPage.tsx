/**
 * 집회 상세 페이지
 *
 * 특정 집회의 상세 정보와 댓글을 표시합니다.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Clock, ArrowLeft, Sparkles, Flame, Heart, Bell, BellOff, Layers, Video, MapPinCheck } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useEvents } from '@/hooks/useEvents'
import { useComments } from '@/hooks/useComments'
import { useCandles } from '@/hooks/useCandles'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useNotifications } from '@/hooks/useNotifications'
import { createCheckIn, getUserCheckIn } from '@/services/firebase/firestore'
import { CommentForm } from '@/components/comment/CommentForm'
import { NotificationPrompt } from '@/components/notification/NotificationPrompt'
import 'leaflet/dist/leaflet.css'

// 익명 사용자 ID 생성
function generateAnonymousId(): string {
  return `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 두 지점 간의 거리 계산 (Haversine formula) - km 단위
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// YouTube URL을 임베드 URL로 변환
function getYouTubeEmbedUrl(url: string): string {
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (match1) {
    return `https://www.youtube.com/embed/${match1[1]}`
  }
  const match2 = url.match(/youtube\.com\/live\/([^&\s]+)/)
  if (match2) {
    return `https://www.youtube.com/embed/${match2[1]}`
  }
  if (url.includes('youtube.com/embed/')) {
    return url
  }
  return url
}

// 지도 타일 레이어 옵션
const MAP_TILES = {
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  light: {
    name: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  standard: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  voyager: {
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

type MapTileType = keyof typeof MAP_TILES

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const { events, loading: eventsLoading } = useEvents()
  const { comments, loading: commentsLoading, refetch: refetchComments } = useComments(id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const {
    hasPermission,
    isSupported,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    isScheduled,
  } = useNotifications()

  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)
  const [selectedTile, setSelectedTile] = useState<MapTileType>('dark')
  const [showTileSelector, setShowTileSelector] = useState(false)

  // 현장 인증 관련 상태
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkInError, setCheckInError] = useState<string | null>(null)

  const event = events.find((e) => e.id === id)
  const { myCandle, onsiteCount, remoteCount, lightCandle, blowCandle, isLit } = useCandles({
    eventId: id,
    event,
  })

  const loading = eventsLoading || commentsLoading

  // 사용자가 이미 인증했는지 확인
  useEffect(() => {
    const checkUserCheckIn = async () => {
      if (!id) return

      const userId = isAuthenticated ? user?.uid : localStorage.getItem('anonymousUserId')
      if (!userId) return

      const checkIn = await getUserCheckIn(id, userId)
      setIsCheckedIn(!!checkIn)
    }

    checkUserCheckIn()
  }, [id, isAuthenticated, user])

  // 현장 인증 핸들러
  const handleCheckIn = async () => {
    if (!id || !event) return

    setIsCheckingIn(true)
    setCheckInError(null)

    try {
      // 위치 권한 요청 및 현재 위치 가져오기
      if (!('geolocation' in navigator)) {
        setCheckInError('이 브라우저는 위치 서비스를 지원하지 않습니다.')
        setIsCheckingIn(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude

          // 행사 위치와의 거리 계산
          const distance = calculateDistance(
            userLat,
            userLng,
            event.location.coordinates.lat,
            event.location.coordinates.lng
          )

          // 500m 이내에 있는지 확인
          const maxDistance = event.location.radius ? event.location.radius / 1000 : 0.5 // km 단위
          if (distance > maxDistance) {
            setCheckInError(
              `현장에서 ${Math.round(maxDistance * 1000)}m 이내에 있어야 인증할 수 있습니다. (현재 거리: ${Math.round(distance * 1000)}m)`
            )
            setIsCheckingIn(false)
            return
          }

          // 사용자 정보 준비
          let userId = user?.uid
          let userName = user?.displayName || '사용자'
          let isAnonymous = false

          if (!isAuthenticated) {
            // 익명 사용자
            isAnonymous = true
            const storedUserId = localStorage.getItem('anonymousUserId')
            if (storedUserId) {
              userId = storedUserId
            } else {
              userId = generateAnonymousId()
              localStorage.setItem('anonymousUserId', userId)
            }
            userName = localStorage.getItem('anonymousUserName') || '익명'
          }

          // userId가 없으면 에러
          if (!userId) {
            setCheckInError('사용자 정보를 확인할 수 없습니다.')
            setIsCheckingIn(false)
            return
          }

          // Firebase에 인증 저장
          const checkInId = await createCheckIn({
            eventId: id,
            userId,
            userName,
            location: {
              lat: userLat,
              lng: userLng,
            },
            isAnonymous,
          })

          if (checkInId) {
            setIsCheckedIn(true)
            setCheckInError(null)
            alert('현장 참여 인증이 완료되었습니다! 🎉')
          } else {
            setCheckInError('인증 처리 중 오류가 발생했습니다.')
          }

          setIsCheckingIn(false)
        },
        (error) => {
          console.error('위치 가져오기 실패:', error)
          let errorMessage = '위치 정보를 가져올 수 없습니다.'

          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = '위치 정보를 사용할 수 없습니다.'
          } else if (error.code === error.TIMEOUT) {
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.'
          }

          setCheckInError(errorMessage)
          setIsCheckingIn(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    } catch (error) {
      console.error('인증 처리 실패:', error)
      setCheckInError('인증 처리 중 오류가 발생했습니다.')
      setIsCheckingIn(false)
    }
  }

  const handleToggleCandle = async () => {
    if (!id) return

    if (isLit) {
      await blowCandle(id)
    } else {
      // 원격 참여로 촛불 켜기 (GPS 없이)
      await lightCandle(id, false)
    }
  }

  const handleToggleNotification = async () => {
    if (!id || !event) return

    // 권한이 없으면 요청
    if (!hasPermission) {
      setShowNotificationPrompt(true)
      return
    }

    // 이미 예약되어 있으면 취소
    if (isScheduled(id)) {
      cancelNotification(id)
      alert('알림이 취소되었습니다.')
    } else {
      // 새로 예약
      const success = scheduleNotification(id, event.title, event.datetime.start)
      if (success) {
        alert('알림이 예약되었습니다! 집회 시작 30분 전에 알림을 받습니다.')
      } else {
        alert('알림 예약에 실패했습니다. 이미 시작 시간이 지났거나 30분 이내입니다.')
      }
    }
  }

  const handleAllowNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      setShowNotificationPrompt(false)
      // 권한 획득 후 바로 예약
      if (id && event) {
        scheduleNotification(id, event.title, event.datetime.start)
        alert('알림이 예약되었습니다!')
      }
    } else {
      alert('알림 권한이 거부되었습니다. 브라우저 설정에서 알림을 허용해주세요.')
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

      {/* 알림 권한 요청 프롬프트 */}
      {showNotificationPrompt && isSupported && (
        <NotificationPrompt
          onAllow={handleAllowNotifications}
          onDismiss={() => setShowNotificationPrompt(false)}
        />
      )}

      {/* 집회 정보 */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold flex-1 pr-4">{event.title}</h1>
          <div className="flex items-center space-x-3">
            {/* 즐겨찾기 버튼 */}
            <button
              onClick={() => toggleFavorite(event.id)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="즐겨찾기 토글"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite(event.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }`}
              />
            </button>
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
        </div>

        {/* 포스터 이미지 */}
        {event.posterImage && (
          <div className="mb-6">
            <img
              src={event.posterImage}
              alt={`${event.title} 포스터`}
              className="w-full rounded-lg object-cover max-h-96"
              onError={(e) => {
                // 이미지 로드 실패시 숨김
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

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

        {/* 실시간 방송 */}
        {event.liveStreamUrl && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span>실시간 방송</span>
            </h3>
            <div className="aspect-video rounded-lg overflow-hidden border border-gray-700 bg-black">
              <iframe
                src={getYouTubeEmbedUrl(event.liveStreamUrl)}
                title={`${event.title} 실시간 방송`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* 장소 지도 */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>집회 장소</span>
          </h3>
          <div className="h-64 rounded-lg overflow-hidden border border-gray-700 relative">
            <MapContainer
              center={[event.location.coordinates.lat, event.location.coordinates.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                key={selectedTile}
                attribution={MAP_TILES[selectedTile].attribution}
                url={MAP_TILES[selectedTile].url}
              />
              <Marker position={[event.location.coordinates.lat, event.location.coordinates.lng]}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold mb-1">{event.title}</div>
                    <div className="text-gray-600">{event.location.address}</div>
                    {event.location.details && (
                      <div className="text-gray-500 text-xs mt-1">{event.location.details}</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* 지도 타일 선택 버튼 */}
            <div className="absolute top-2 right-2 z-[1000]">
              <button
                onClick={() => setShowTileSelector(!showTileSelector)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded shadow-lg transition-colors"
                aria-label="지도 타일 선택"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* 타일 선택 메뉴 */}
              {showTileSelector && (
                <div className="absolute top-10 right-0 bg-gray-800 rounded-lg shadow-xl p-2 min-w-[120px]">
                  {(Object.keys(MAP_TILES) as MapTileType[]).map((tileKey) => (
                    <button
                      key={tileKey}
                      onClick={() => {
                        setSelectedTile(tileKey)
                        setShowTileSelector(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        selectedTile === tileKey
                          ? 'bg-yellow-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {MAP_TILES[tileKey].name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 현장 참여 인증 버튼 */}
        <button
          onClick={handleCheckIn}
          disabled={isCheckedIn || isCheckingIn}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all mb-3 ${
            isCheckedIn
              ? 'bg-green-600 text-white cursor-not-allowed'
              : isCheckingIn
                ? 'bg-gray-700 text-gray-400 cursor-wait'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <MapPinCheck className={`w-6 h-6 ${isCheckingIn ? 'animate-pulse' : ''}`} />
            <span>
              {isCheckedIn ? '현장 참여 인증 완료 ✓' : isCheckingIn ? '위치 확인 중...' : '현장 참여 인증하기'}
            </span>
          </div>
          {isCheckedIn && (
            <div className="text-sm mt-2 opacity-90">
              지도에 내 위치가 표시됩니다
            </div>
          )}
        </button>

        {/* 인증 에러 메시지 */}
        {checkInError && (
          <div className="mb-3 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
            {checkInError}
          </div>
        )}

        {/* 촛불 켜기/끄기 버튼 */}
        {isAuthenticated && (
          <>
            <button
              onClick={handleToggleCandle}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all mb-3 ${
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

            {/* 알림 받기 버튼 */}
            {isSupported && event.status === 'scheduled' && (
              <button
                onClick={handleToggleNotification}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isScheduled(event.id)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isScheduled(event.id) ? (
                    <>
                      <Bell className="w-5 h-5" />
                      <span>알림 설정됨 (30분 전)</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-5 h-5" />
                      <span>알림 받기 (30분 전)</span>
                    </>
                  )}
                </div>
              </button>
            )}
          </>
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
