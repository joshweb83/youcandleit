/**
 * Open-Meteo API 서비스
 *
 * Open-Meteo API를 사용하여 날씨 정보를 가져옵니다.
 * API 키 불필요 - 무료 오픈소스 날씨 API
 * https://open-meteo.com/
 */

export interface WeatherData {
  temp: number // 현재 온도 (섭씨)
  feels_like: number // 체감 온도 (섭씨)
  humidity: number // 습도 (%)
  pressure: number // 기압 (hPa)
  weather: {
    main: string // 날씨 주요 설명 (Clear, Clouds, Rain 등)
    description: string // 날씨 상세 설명
    icon: string // 날씨 아이콘 코드
  }
  wind: {
    speed: number // 풍속 (m/s)
    deg: number // 풍향 (도)
  }
  clouds: number // 구름양 (%)
  visibility: number // 가시거리 (m)
  name: string // 지역명
  country: string // 국가 코드
}

/**
 * WMO 날씨 코드를 날씨 설명으로 변환
 */
function getWeatherDescription(code: number): { main: string; description: string; icon: string } {
  const weatherCodes: Record<number, { main: string; description: string; icon: string }> = {
    0: { main: 'Clear', description: '맑음', icon: '01d' },
    1: { main: 'Clear', description: '대체로 맑음', icon: '01d' },
    2: { main: 'Clouds', description: '부분적으로 흐림', icon: '02d' },
    3: { main: 'Clouds', description: '흐림', icon: '03d' },
    45: { main: 'Fog', description: '안개', icon: '50d' },
    48: { main: 'Fog', description: '짙은 안개', icon: '50d' },
    51: { main: 'Drizzle', description: '약한 이슬비', icon: '09d' },
    53: { main: 'Drizzle', description: '이슬비', icon: '09d' },
    55: { main: 'Drizzle', description: '강한 이슬비', icon: '09d' },
    61: { main: 'Rain', description: '약한 비', icon: '10d' },
    63: { main: 'Rain', description: '비', icon: '10d' },
    65: { main: 'Rain', description: '강한 비', icon: '10d' },
    71: { main: 'Snow', description: '약한 눈', icon: '13d' },
    73: { main: 'Snow', description: '눈', icon: '13d' },
    75: { main: 'Snow', description: '강한 눈', icon: '13d' },
    77: { main: 'Snow', description: '진눈깨비', icon: '13d' },
    80: { main: 'Rain', description: '소나기', icon: '09d' },
    81: { main: 'Rain', description: '강한 소나기', icon: '09d' },
    82: { main: 'Rain', description: '매우 강한 소나기', icon: '09d' },
    85: { main: 'Snow', description: '약한 눈보라', icon: '13d' },
    86: { main: 'Snow', description: '눈보라', icon: '13d' },
    95: { main: 'Thunderstorm', description: '천둥번개', icon: '11d' },
    96: { main: 'Thunderstorm', description: '우박을 동반한 천둥번개', icon: '11d' },
    99: { main: 'Thunderstorm', description: '강한 우박을 동반한 천둥번개', icon: '11d' },
  }

  return weatherCodes[code] || { main: 'Unknown', description: '알 수 없음', icon: '01d' }
}

/**
 * 좌표로 날씨 정보 가져오기 (Open-Meteo API 사용 - API 키 불필요)
 */
export async function getWeatherByCoordinates(
  lat: number,
  lng: number
): Promise<WeatherData> {
  try {
    // Open-Meteo API는 API 키가 필요 없습니다
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.append('latitude', lat.toString())
    url.searchParams.append('longitude', lng.toString())
    url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code')
    url.searchParams.append('timezone', 'Asia/Seoul')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const current = data.current

    const weatherInfo = getWeatherDescription(current.weather_code)

    return {
      temp: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.pressure_msl),
      weather: weatherInfo,
      wind: {
        speed: current.wind_speed_10m / 3.6, // km/h를 m/s로 변환
        deg: current.wind_direction_10m,
      },
      clouds: current.cloud_cover,
      visibility: 10000, // Open-Meteo는 가시거리를 제공하지 않으므로 기본값
      name: '현재 위치',
      country: 'KR',
    }
  } catch (error) {
    console.error('날씨 정보 가져오기 실패:', error)
    throw error
  }
}

/**
 * 날씨 아이콘 이모지 반환
 */
export function getWeatherIconUrl(iconCode: string): string {
  // 이모지로 날씨 아이콘 표시
  const iconMap: Record<string, string> = {
    '01d': '☀️',
    '02d': '⛅',
    '03d': '☁️',
    '04d': '☁️',
    '09d': '🌧️',
    '10d': '🌦️',
    '11d': '⛈️',
    '13d': '🌨️',
    '50d': '🌫️',
  }
  return iconMap[iconCode] || '🌤️'
}

/**
 * 풍향을 문자열로 변환
 */
export function getWindDirection(deg: number): string {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}
