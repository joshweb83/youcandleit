/**
 * 도로명주소 API 서비스
 *
 * 행정안전부 도로명주소 API를 사용하여 주소를 검색합니다.
 * API 신청: https://business.juso.go.kr/addrlink/openApi/apiReqst.do
 */

export interface JusoAddress {
  roadAddr: string // 전체 도로명주소
  roadAddrPart1: string // 도로명주소(참고항목 제외)
  roadAddrPart2: string // 도로명주소 참고항목
  jibunAddr: string // 지번주소
  engAddr: string // 영문주소
  zipNo: string // 우편번호
  admCd: string // 행정구역코드
  rnMgtSn: string // 도로명코드
  bdMgtSn: string // 건물관리번호
  detBdNmList: string // 상세건물명
  bdNm: string // 건물명
  bdKdcd: string // 공동주택여부(1:공동주택, 0:비공동주택)
  siNm: string // 시도명
  sggNm: string // 시군구명
  emdNm: string // 읍면동명
  liNm: string // 법정리명
  rn: string // 도로명
  udrtYn: string // 지하여부(0:지상, 1:지하)
  buldMnnm: number // 건물본번
  buldSlno: number // 건물부번
  mtYn: string // 산여부(0:대지, 1:산)
  lnbrMnnm: number // 지번본번(번지)
  lnbrSlno: number // 지번부번(호)
  emdNo: string // 읍면동일련번호
}

export interface JusoSearchResult {
  results: {
    common: {
      totalCount: string
      currentPage: string
      countPerPage: string
      errorCode: string
      errorMessage: string
    }
    juso: JusoAddress[]
  }
}

/**
 * 도로명주소 검색
 */
export async function searchAddress(
  keyword: string,
  currentPage: number = 1,
  countPerPage: number = 10
): Promise<JusoSearchResult> {
  const apiKey = import.meta.env.VITE_JUSO_API_KEY

  if (!apiKey) {
    console.warn('도로명주소 API 키가 설정되지 않았습니다.')
    // API 키가 없으면 목업 데이터 반환
    return {
      results: {
        common: {
          totalCount: '0',
          currentPage: '1',
          countPerPage: '10',
          errorCode: '0',
          errorMessage: 'API 키가 설정되지 않았습니다. .env.local 파일에 VITE_JUSO_API_KEY를 설정해주세요.',
        },
        juso: [],
      },
    }
  }

  try {
    const url = new URL('https://business.juso.go.kr/addrlink/addrLinkApi.do')
    url.searchParams.append('confmKey', apiKey)
    url.searchParams.append('currentPage', currentPage.toString())
    url.searchParams.append('countPerPage', countPerPage.toString())
    url.searchParams.append('keyword', keyword)
    url.searchParams.append('resultType', 'json')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('도로명주소 검색 실패:', error)
    throw error
  }
}

/**
 * 주소를 좌표로 변환
 *
 * OpenStreetMap의 Nominatim API를 사용하여 주소를 좌표로 변환합니다.
 * 전세계 모든 주소를 지원하며, API 키가 필요하지 않습니다.
 */
export async function getCoordinatesFromAddress(address: string): Promise<{
  lat: number
  lng: number
} | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.append('q', address)
    url.searchParams.append('format', 'json')
    url.searchParams.append('limit', '1')
    url.searchParams.append('accept-language', 'ko')

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'YouCandleIt-Address-Service',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const { lat, lon } = data[0]
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      }
    }

    console.warn('주소에 대한 좌표를 찾을 수 없습니다:', address)
    return null
  } catch (error) {
    console.error('주소 좌표 변환 실패:', error)
    return null
  }
}
