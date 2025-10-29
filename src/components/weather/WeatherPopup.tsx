/**
 * 날씨 정보 팝업 컴포넌트
 *
 * 현재 위치의 날씨 정보를 모달 형태로 표시합니다.
 */

import { X, Wind, Droplets, Eye, Gauge } from 'lucide-react'
import { WeatherData, getWeatherIconUrl, getWindDirection } from '@/services/weather/api'

interface WeatherPopupProps {
  isOpen: boolean
  onClose: () => void
  weather: WeatherData | null
  loading: boolean
  error: string | null
}

export function WeatherPopup({ isOpen, onClose, weather, loading, error }: WeatherPopupProps) {
  if (!isOpen) return null

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/70 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* 팝업 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md pointer-events-auto border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">현재 날씨</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 내용 */}
          <div className="p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌤️</div>
                <p className="text-gray-400">날씨 정보를 가져오는 중...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {weather && !loading && !error && (
              <div className="space-y-6">
                {/* 위치 */}
                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    {weather.name}, {weather.country}
                  </p>
                </div>

                {/* 메인 날씨 정보 */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <img
                      src={getWeatherIconUrl(weather.weather.icon)}
                      alt={weather.weather.description}
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="text-5xl font-bold mb-2">
                    {weather.temp}°C
                  </div>
                  <div className="text-lg text-gray-300 mb-1">
                    {weather.weather.description}
                  </div>
                  <div className="text-sm text-gray-400">
                    체감 온도: {weather.feels_like}°C
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 습도 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Droplets className="w-4 h-4" />
                      <span className="text-sm">습도</span>
                    </div>
                    <div className="text-xl font-bold">{weather.humidity}%</div>
                  </div>

                  {/* 풍속 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Wind className="w-4 h-4" />
                      <span className="text-sm">바람</span>
                    </div>
                    <div className="text-xl font-bold">{weather.wind.speed}m/s</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getWindDirection(weather.wind.deg)}풍
                    </div>
                  </div>

                  {/* 가시거리 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">가시거리</span>
                    </div>
                    <div className="text-xl font-bold">{(weather.visibility / 1000).toFixed(1)}km</div>
                  </div>

                  {/* 기압 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Gauge className="w-4 h-4" />
                      <span className="text-sm">기압</span>
                    </div>
                    <div className="text-xl font-bold">{weather.pressure}hPa</div>
                  </div>
                </div>

                {/* 안내 메시지 */}
                <div className="text-xs text-gray-500 text-center">
                  ℹ️ OpenWeatherMap API 제공
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
