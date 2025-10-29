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
  precipitation_probability: number // 강수확률 (%)
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
  name: string // 지역명 (상세)
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
 * 역지오코딩 - 좌표를 주소로 변환 (Nominatim API 사용 - API 키 불필요)
 */
async function reverseGeocode(lat: number, lng: number): Promise<{ city: string; country: string }> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse')
    url.searchParams.append('lat', lat.toString())
    url.searchParams.append('lon', lng.toString())
    url.searchParams.append('format', 'json')
    url.searchParams.append('accept-language', 'ko')

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'YouCandleIt-Weather-App'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const address = data.address

    // 한국 주소 형식: 시/도 > 시/군/구
    let city = '현재 위치'
    if (address.city) {
      city = address.city
    } else if (address.town) {
      city = address.town
    } else if (address.county) {
      city = address.county
    } else if (address.province || address.state) {
      city = address.province || address.state
    }

    return {
      city,
      country: address.country_code?.toUpperCase() || 'KR'
    }
  } catch (error) {
    console.error('역지오코딩 실패:', error)
    return { city: '현재 위치', country: 'KR' }
  }
}

/**
 * 좌표로 날씨 정보 가져오기 (Open-Meteo API 사용 - API 키 불필요)
 */
export async function getWeatherByCoordinates(
  lat: number,
  lng: number
): Promise<WeatherData> {
  try {
    // 역지오코딩과 날씨 정보를 병렬로 가져오기
    const [locationData, weatherResponse] = await Promise.all([
      reverseGeocode(lat, lng),
      fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lng}&` +
        `current=temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,precipitation_probability&` +
        `hourly=precipitation_probability&` +
        `timezone=Asia/Seoul`
      )
    ])

    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! status: ${weatherResponse.status}`)
    }

    const weatherData = await weatherResponse.json()
    const current = weatherData.current

    const weatherInfo = getWeatherDescription(current.weather_code)

    return {
      temp: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      precipitation_probability: current.precipitation_probability || 0,
      weather: weatherInfo,
      wind: {
        speed: current.wind_speed_10m / 3.6, // km/h를 m/s로 변환
        deg: current.wind_direction_10m,
      },
      clouds: current.cloud_cover,
      visibility: 10000, // Open-Meteo는 가시거리를 제공하지 않으므로 기본값
      name: locationData.city,
      country: locationData.country,
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

/**
 * 체감온도에 따른 옷차림 팁
 */
export function getClothingTip(feelsLike: number): string {
  if (feelsLike >= 28) {
    return '민소매, 반팔, 반바지, 원피스'
  } else if (feelsLike >= 23) {
    return '반팔, 얇은 셔츠, 반바지, 면바지'
  } else if (feelsLike >= 20) {
    return '긴팔, 가디건, 청바지, 면바지'
  } else if (feelsLike >= 17) {
    return '얇은 니트, 맨투맨, 가디건, 청바지'
  } else if (feelsLike >= 12) {
    return '자켓, 가디건, 야상, 청바지'
  } else if (feelsLike >= 9) {
    return '트렌치 코트, 야상, 점퍼, 니트'
  } else if (feelsLike >= 5) {
    return '코트, 가죽자켓, 히트텍, 니트'
  } else {
    return '패딩, 두꺼운 코트, 목도리, 기모제품'
  }
}
