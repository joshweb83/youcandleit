/**
 * OpenWeatherMap API 서비스
 *
 * OpenWeatherMap API를 사용하여 날씨 정보를 가져옵니다.
 * API 신청: https://openweathermap.org/api
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
 * 좌표로 날씨 정보 가져오기
 */
export async function getWeatherByCoordinates(
  lat: number,
  lng: number
): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  // API 키가 없으면 목업 데이터 반환
  if (!apiKey) {
    console.warn('OpenWeatherMap API 키가 설정되지 않았습니다.')
    return getMockWeatherData()
  }

  try {
    const url = new URL('https://api.openweathermap.org/data/2.5/weather')
    url.searchParams.append('lat', lat.toString())
    url.searchParams.append('lon', lng.toString())
    url.searchParams.append('appid', apiKey)
    url.searchParams.append('units', 'metric') // 섭씨 온도
    url.searchParams.append('lang', 'kr') // 한국어

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg,
      },
      clouds: data.clouds.all,
      visibility: data.visibility,
      name: data.name,
      country: data.sys.country,
    }
  } catch (error) {
    console.error('날씨 정보 가져오기 실패:', error)
    throw error
  }
}

/**
 * 날씨 아이콘 URL 생성
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

/**
 * 풍향을 문자열로 변환
 */
export function getWindDirection(deg: number): string {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

/**
 * 목업 날씨 데이터 (API 키가 없을 때)
 */
function getMockWeatherData(): WeatherData {
  return {
    temp: 20,
    feels_like: 19,
    humidity: 65,
    pressure: 1013,
    weather: {
      main: 'Clear',
      description: '맑음',
      icon: '01d',
    },
    wind: {
      speed: 3.5,
      deg: 180,
    },
    clouds: 10,
    visibility: 10000,
    name: '서울',
    country: 'KR',
  }
}
