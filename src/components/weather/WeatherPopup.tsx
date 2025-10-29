/**
 * 날씨 정보 팝업 컴포넌트
 *
 * 현재 위치의 날씨 정보를 모달 형태로 표시합니다.
 */

import { X, Wind, Droplets, Eye, CloudRain, Shirt } from 'lucide-react'
import { WeatherData, getWeatherIconUrl, getWindDirection, getClothingTip } from '@/services/weather/api'

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
        className="fixed inset-0 bg-black/70 z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* 팝업 */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
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
                    {weather.name}
                  </p>
                </div>

                {/* 메인 날씨 정보 */}
                <div className="text-center">
                  <div className="text-6xl mb-3">
                    {getWeatherIconUrl(weather.weather.icon)}
                  </div>
                  <div className="text-5xl font-bold mb-2">
                    {weather.temp}°C
                  </div>
                  <div className="text-lg text-gray-300 mb-1">
                    {weather.weather.description}
                  </div>
                  <div className="text-sm text-gray-400 mb-1">
                    체감 온도: {weather.feels_like}°C
                  </div>
                  {/* 옷차림 팁 */}
                  <div className="mt-3 px-4 py-2 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Shirt className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">추천 옷차림</span>
                    </div>
                    <p className="text-xs text-gray-300 text-center">
                      {getClothingTip(weather.feels_like)}
                    </p>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 강수확률 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <CloudRain className="w-4 h-4" />
                      <span className="text-sm">강수확률</span>
                    </div>
                    <div className="text-xl font-bold">{weather.precipitation_probability}%</div>
                  </div>

                  {/* 풍속 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Wind className="w-4 h-4" />
                      <span className="text-sm">바람</span>
                    </div>
                    <div className="text-xl font-bold">{weather.wind.speed.toFixed(1)}m/s</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getWindDirection(weather.wind.deg)}풍
                    </div>
                  </div>

                  {/* 습도 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Droplets className="w-4 h-4" />
                      <span className="text-sm">습도</span>
                    </div>
                    <div className="text-xl font-bold">{weather.humidity}%</div>
                  </div>

                  {/* 가시거리 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">가시거리</span>
                    </div>
                    <div className="text-xl font-bold">{(weather.visibility / 1000).toFixed(1)}km</div>
                  </div>
                </div>

                {/* 안내 메시지 */}
                <div className="text-xs text-gray-500 text-center">
                  ℹ️ Open-Meteo API 제공
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
