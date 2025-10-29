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
 * 도로명주소 API는 좌표를 제공하지 않으므로,
 * 카카오 맵 API나 Google Geocoding API를 사용해야 합니다.
 * 여기서는 기본적으로 서울시청 좌표를 반환합니다.
 */
export async function getCoordinatesFromAddress(_address: string): Promise<{
  lat: number
  lng: number
} | null> {
  // TODO: 실제로는 카카오 맵 API나 Google Geocoding API를 사용
  // 지금은 브라우저의 Geocoding API를 사용할 수 없으므로
  // 기본 좌표를 반환합니다
  console.warn('좌표 변환 기능은 별도의 API가 필요합니다.')

  // 임시로 서울시청 좌표 반환
  return {
    lat: 37.5665,
    lng: 126.9780,
  }
}
