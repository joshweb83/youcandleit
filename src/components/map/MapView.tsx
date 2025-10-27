/**
 * Leaflet 지도 컴포넌트
 *
 * OpenStreetMap을 사용하여 집회 위치를 표시합니다.
 */

import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import type { Event } from '@/types/event.types'
import { useCandles } from '@/hooks/useCandles'
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

// 촛불 아이콘 색상 설정
const CANDLE_COLORS = {
  onsite: '#FCD34D', // yellow-400
  remote: '#60A5FA', // blue-400
}

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

export function MapView({ events, center = [37.5665, 126.978], zoom = 13 }: MapViewProps) {
  const { candles } = useCandles()

  // 위치 정보가 있는 촛불만 필터링 (onsite candles)
  const candlesWithLocation = candles.filter(
    (candle) => candle.location && candle.location.lat && candle.location.lng
  )

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <ChangeView center={center} zoom={zoom} />

      {/* OpenStreetMap 타일 레이어 */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 집회 마커 */}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.location.coordinates.lat, event.location.coordinates.lng]}
        >
          <Popup>
            <div className="text-gray-900">
              <h3 className="font-bold text-lg mb-1">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{event.summary}</p>
              <div className="text-xs text-gray-500">
                <div>📅 {new Date(event.datetime.start).toLocaleString('ko-KR')}</div>
                <div>📍 {event.location.address}</div>
                <div className="mt-2">
                  <span className="text-yellow-600">👥 {event.participantCount}명</span>
                  {event.remoteCount > 0 && (
                    <span className="ml-2 text-blue-600">🌐 {event.remoteCount}명 원격</span>
                  )}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* 촛불 마커 (현장 참여자) */}
      {candlesWithLocation.map((candle, index) => (
        <CircleMarker
          key={`${candle.userId}-${candle.eventId}-${index}`}
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
    </MapContainer>
  )
}
