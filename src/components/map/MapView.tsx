/**
 * Leaflet 지도 컴포넌트
 *
 * 다양한 지도 타일 레이어를 선택할 수 있습니다.
 */

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Circle } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { Layers, Navigation, CloudSun } from 'lucide-react'
import type { Event } from '@/types/event.types'
import type { CheckIn } from '@/types/checkin.types'
import type { Comment } from '@/types/comment.types'
import { useCandles } from '@/hooks/useCandles'
import { db } from '@/services/firebase/config'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { WeatherPopup } from '@/components/weather/WeatherPopup'
import { getWeatherByCoordinates, type WeatherData } from '@/services/weather/api'
import 'leaflet/dist/leaflet.css'

// Leaflet 아이콘 수정 (Vite에서 기본 아이콘이 깨지는 문제 해결)
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

// 사용자 위치 마커를 위한 커스텀 아이콘
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" fill-opacity="0.2"/>
      <circle cx="12" cy="12" r="4" fill="#3b82f6"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

// 촛불 아이콘 색상 설정
const CANDLE_COLORS = {
  onsite: '#FCD34D', // yellow-400
  remote: '#60A5FA', // blue-400
}

// 지도 타일 레이어 옵션
const MAP_TILES = {
  dark: {
    name: 'Dark (기본)',
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

interface MapViewProps {
  events: Event[]
  center?: LatLngExpression
  zoom?: number
}

// 지도 중심 이동 컴포넌트
function ChangeView({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

// 지도 중심 이동을 위한 헬퍼 컴포넌트
function MapCenterController({ center }: { center: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true })
    }
  }, [center, map])

  return null
}

export function MapView({ events, center = [37.5665, 126.978], zoom = 13 }: MapViewProps) {
  const navigate = useNavigate()
  const { candles } = useCandles()
  const [selectedTile, setSelectedTile] = useState<MapTileType>('dark')
  const [showTileSelector, setShowTileSelector] = useState(false)
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  // 지도 관련 상태
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showWeatherPopup, setShowWeatherPopup] = useState(false)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)

  // 모든 이벤트의 댓글 데이터를 실시간으로 가져오기 (위치 정보가 있는 것만)
  useEffect(() => {
    if (!db || events.length === 0) {
      setComments([])
      return
    }

    const unsubscribes: (() => void)[] = []

    events.forEach((event) => {
      const commentsRef = collection(db!, 'comments')
      const q = query(commentsRef, where('eventId', '==', event.id), orderBy('createdAt', 'desc'))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const eventComments: Comment[] = snapshot.docs
            .map((doc) => {
              const data = doc.data()
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt,
              } as Comment
            })
            .filter((comment) => comment.location) // 위치 정보가 있는 것만

          setComments((prev) => {
            const filtered = prev.filter((c) => c.eventId !== event.id)
            return [...filtered, ...eventComments]
          })
        },
        (error) => {
          console.error('댓글 실시간 업데이트 실패:', error)
        }
      )

      unsubscribes.push(unsubscribe)
    })

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [events])

  // 모든 이벤트의 체크인 데이터를 실시간으로 가져오기
  useEffect(() => {
    if (!db || events.length === 0) {
      setCheckIns([])
      return
    }

    // 각 이벤트에 대한 실시간 리스너 설정
    const unsubscribes: (() => void)[] = []

    events.forEach((event) => {
      const checkInsRef = collection(db!, 'checkIns')
      const q = query(
        checkInsRef,
        where('eventId', '==', event.id),
        orderBy('checkedInAt', 'desc')
      )

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const eventCheckIns: CheckIn[] = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              checkedInAt: data.checkedInAt.toDate(),
            } as CheckIn
          })

          // 기존 체크인 데이터에서 현재 이벤트의 것만 제거하고 새 데이터 추가
          setCheckIns((prev) => {
            const filtered = prev.filter((c) => c.eventId !== event.id)
            return [...filtered, ...eventCheckIns]
          })
        },
        (error) => {
          console.error('체크인 실시간 업데이트 실패:', error)
        }
      )

      unsubscribes.push(unsubscribe)
    })

    // 컴포넌트 언마운트 시 모든 리스너 정리
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [events])

  // 위치 정보가 있는 촛불만 필터링 (onsite candles)
  const candlesWithLocation = candles.filter(
    (candle) => candle.location && candle.location.lat && candle.location.lng
  )

  // 현재 위치로 지도 이동
  const handleGoToCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setUserLocation({ lat, lng })
        setMapCenter([lat, lng])
      },
      (error) => {
        console.error('위치 가져오기 실패:', error)
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
        }
        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // 날씨 정보 가져오기
  const handleShowWeather = async () => {
    if (!('geolocation' in navigator)) {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.')
      return
    }

    setShowWeatherPopup(true)
    setWeatherLoading(true)
    setWeatherError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        try {
          const weather = await getWeatherByCoordinates(lat, lng)
          setWeatherData(weather)
          setWeatherLoading(false)
        } catch (error) {
          console.error('날씨 정보 가져오기 실패:', error)
          setWeatherError('날씨 정보를 가져오는데 실패했습니다. 다시 시도해주세요.')
          setWeatherLoading(false)
        }
      },
      (error) => {
        console.error('위치 가져오기 실패:', error)
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.'
        }
        setWeatherError(errorMessage)
        setWeatherLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분간 캐시
      }
    )
  }

  const currentTile = MAP_TILES[selectedTile]

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <ChangeView center={center} zoom={zoom} />

        {/* 선택된 타일 레이어 */}
        <TileLayer
          key={selectedTile}
          attribution={currentTile.attribution}
          url={currentTile.url}
        />

        {/* 집회 마커 */}
        {events.map((event) => {
          // 커스텀 아이콘 생성
          const customIcon = L.divIcon({
            html: `<div style="font-size: 32px; text-align: center;">${event.icon || '🕯️'}</div>`,
            className: 'custom-emoji-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          })

          return (
            <Marker
              key={event.id}
              position={[event.location.coordinates.lat, event.location.coordinates.lng]}
              icon={customIcon}
            >
            <Popup maxWidth={300}>
              <div className="text-gray-900 p-2">
                {/* 포스터 이미지 */}
                {event.posterImage && (
                  <div className="mb-3">
                    <img
                      src={event.posterImage}
                      alt={`${event.title} 포스터`}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* 상태 배지 */}
                <div className="mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      event.status === 'ongoing'
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'scheduled'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {event.status === 'ongoing'
                      ? '진행중'
                      : event.status === 'scheduled'
                        ? '예정'
                        : '종료'}
                  </span>
                </div>

                {/* 제목 */}
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>

                {/* 요약 */}
                {event.summary && <p className="text-sm text-gray-600 mb-3">{event.summary}</p>}

                {/* 세부 정보 */}
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <div className="flex items-start space-x-1">
                    <span>📅</span>
                    <span>{new Date(event.datetime.start).toLocaleString('ko-KR')}</span>
                  </div>
                  <div className="flex items-start space-x-1">
                    <span>📍</span>
                    <span>{event.location.address}</span>
                  </div>
                  {event.organizer && (
                    <div className="flex items-start space-x-1">
                      <span>👥</span>
                      <span>주최: {event.organizer}</span>
                    </div>
                  )}
                </div>

                {/* 참여자 수 */}
                <div className="text-xs mb-3 pb-3 border-b border-gray-200">
                  <span className="text-yellow-600 font-semibold">
                    🕯️ 현장 {event.participantCount}명
                  </span>
                  {event.remoteCount > 0 && (
                    <span className="ml-2 text-blue-600 font-semibold">
                      🌐 원격 {event.remoteCount}명
                    </span>
                  )}
                </div>

                {/* 상세보기 버튼 */}
                <button
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded transition-colors"
                >
                  상세보기
                </button>
              </div>
            </Popup>
          </Marker>
        )
        })}

        {/* 이벤트 반경 원 표시 */}
        {events.map((event) => (
          <Circle
            key={`radius-${event.id}`}
            center={[event.location.coordinates.lat, event.location.coordinates.lng]}
            radius={event.location.radius || 500}
            pathOptions={{
              color: '#FCD34D',
              fillColor: '#FCD34D',
              fillOpacity: 0.1,
              weight: 2,
              opacity: 0.5,
            }}
          />
        ))}

        {/* 촛불 마커 (현장 참여자) */}
        {candlesWithLocation.map((candle, index) => (
          <CircleMarker
            key={`candle-${candle.userId}-${candle.eventId}-${index}`}
            center={[candle.location!.lat, candle.location!.lng]}
            radius={8}
            pathOptions={{
              fillColor: CANDLE_COLORS[candle.type],
              fillOpacity: 0.8,
              color: candle.type === 'onsite' ? '#F59E0B' : '#3B82F6',
              weight: 2,
              opacity: 1,
            }}
          >
            <Popup>
              <div className="text-gray-900">
                <div className="text-2xl mb-1">🕯️</div>
                <div className="text-sm font-semibold">
                  {candle.type === 'onsite' ? '현장 참여' : '원격 참여'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(candle.timestamp).toLocaleTimeString('ko-KR')}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 체크인 마커 (현장 인증 참여자) */}
        {checkIns.map((checkIn, index) => (
          <CircleMarker
            key={`checkin-${checkIn.userId}-${checkIn.eventId}-${index}`}
            center={[checkIn.location.lat, checkIn.location.lng]}
            radius={10}
            pathOptions={{
              fillColor: '#FCD34D', // yellow-400
              fillOpacity: 0.9,
              color: '#F59E0B', // orange-500
              weight: 3,
              opacity: 1,
            }}
          >
            <Popup>
              <div className="text-gray-900">
                <div className="text-3xl mb-2">🕯️</div>
                <div className="text-sm font-bold mb-1">
                  {checkIn.userName}
                </div>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block mb-1">
                  현장 인증 완료
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(checkIn.checkedInAt).toLocaleString('ko-KR')}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 댓글 작성자 마커 (온라인 참여자) */}
        {comments.map((comment, index) => (
          <CircleMarker
            key={`comment-${comment.userId}-${comment.id}-${index}`}
            center={[comment.location!.lat, comment.location!.lng]}
            radius={5}
            pathOptions={{
              fillColor: '#60A5FA', // blue-400
              fillOpacity: 0.7,
              color: '#3B82F6', // blue-500
              weight: 1,
              opacity: 0.8,
            }}
          >
            <Popup>
              <div className="text-gray-900">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-sm font-bold mb-1">
                  {comment.userName}
                </div>
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block mb-2">
                  온라인 참여
                </div>
                <div className="text-xs text-gray-700 mb-2 max-w-[200px] break-words">
                  {comment.content}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString('ko-KR')}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold mb-1">내 위치</div>
                <div className="text-gray-600 text-xs">
                  {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 지도 중심 컨트롤러 */}
        <MapCenterController center={mapCenter} />
      </MapContainer>

      {/* 지도 컨트롤 버튼들 */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        {/* 현재 위치 버튼 */}
        <button
          onClick={handleGoToCurrentLocation}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow-lg transition-colors"
          aria-label="현재 위치 보기"
          title="현재 위치 보기"
        >
          <Navigation className="w-5 h-5" />
        </button>

        {/* 날씨 보기 버튼 */}
        <button
          onClick={handleShowWeather}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow-lg transition-colors"
          aria-label="날씨 보기"
          title="날씨 보기"
        >
          <CloudSun className="w-5 h-5" />
        </button>

        {/* 지도 타일 선택 버튼 */}
        <button
          onClick={() => setShowTileSelector(!showTileSelector)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow-lg transition-colors"
          aria-label="지도 타일 선택"
          title="지도 스타일 변경"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* 타일 선택 메뉴 */}
        {showTileSelector && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-2 min-w-[150px] mt-2">
            {(Object.keys(MAP_TILES) as MapTileType[]).map((tileKey) => (
              <button
                key={tileKey}
                onClick={() => {
                  setSelectedTile(tileKey)
                  setShowTileSelector(false)
                }}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
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

      {/* 날씨 팝업 */}
      <WeatherPopup
        isOpen={showWeatherPopup}
        onClose={() => setShowWeatherPopup(false)}
        weather={weatherData}
        loading={weatherLoading}
        error={weatherError}
      />
    </div>
  )
}
