/**
 * 샘플 참여자 데이터 생성 스크립트
 *
 * 이벤트 주변에 랜덤한 GPS 좌표를 가진 참여자들을 생성합니다.
 * 생성된 데이터는 Firebase Firestore 및 Realtime Database에 추가할 수 있습니다.
 */

interface Coordinates {
  lat: number
  lng: number
}

interface Event {
  id: string
  title: string
  coordinates: Coordinates
  radius: number // meters
}

// 샘플 이벤트 데이터 (Firebase에서 실제 ID로 교체 필요)
const SAMPLE_EVENTS: Event[] = [
  {
    id: 'EVENT_ID_1', // Firebase에서 생성된 실제 ID로 교체
    title: '기후정의를 위한 촛불집회',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    radius: 500,
  },
  {
    id: 'EVENT_ID_2',
    title: '모두를 위한 교육, 교육 평등 실현 촛불집회',
    coordinates: { lat: 37.5720, lng: 126.9769 },
    radius: 300,
  },
  {
    id: 'EVENT_ID_3',
    title: '노동자 권리 보장 촛불집회',
    coordinates: { lat: 37.5323, lng: 126.9146 },
    radius: 400,
  },
  {
    id: 'EVENT_ID_4',
    title: '한반도 평화와 통일을 위한 시민 촛불집회',
    coordinates: { lat: 37.5665, lng: 126.9779 },
    radius: 600,
  },
  {
    id: 'EVENT_ID_5',
    title: '성평등 실현을 위한 촛불문화제',
    coordinates: { lat: 35.0988, lng: 129.0303 },
    radius: 350,
  },
]

// 랜덤 이름 생성
const LAST_NAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '오', '한', '신', '서', '권']
const FIRST_NAMES = ['민준', '서연', '예준', '지우', '도윤', '서준', '하준', '수아', '시우', '하윤', '지훈', '지민', '현우', '지안', '서윤', '유진', '정우', '채원', '은우', '다은']

function getRandomName(): string {
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  return `${lastName}${firstName}`
}

// 랜덤 댓글 내용
const SAMPLE_COMMENTS = [
  '함께합니다! 🕯️',
  '응원합니다! 변화는 우리 손으로!',
  '정의로운 세상을 만들어갑시다',
  '힘을 모아요! 💪',
  '우리의 목소리가 변화를 만듭니다',
  '민주주의를 지키겠습니다',
  '끝까지 함께하겠습니다',
  '평화로운 집회 응원합니다',
  '시민의 힘을 믿습니다',
  '정의는 반드시 승리합니다',
]

/**
 * 중심점 주변의 랜덤한 좌표 생성
 * @param center 중심 좌표
 * @param radiusInMeters 반경 (미터)
 * @returns 랜덤 좌표
 */
function generateRandomCoordinates(center: Coordinates, radiusInMeters: number): Coordinates {
  // 지구 반지름 (미터)
  const earthRadius = 6371000

  // 랜덤 거리 (0 ~ radius)
  const randomDistance = Math.random() * radiusInMeters

  // 랜덤 방향 (라디안)
  const randomBearing = Math.random() * 2 * Math.PI

  // 중심점을 라디안으로 변환
  const lat1 = (center.lat * Math.PI) / 180
  const lng1 = (center.lng * Math.PI) / 180

  // 새로운 위도 계산
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(randomDistance / earthRadius) +
    Math.cos(lat1) * Math.sin(randomDistance / earthRadius) * Math.cos(randomBearing)
  )

  // 새로운 경도 계산
  const lng2 = lng1 + Math.atan2(
    Math.sin(randomBearing) * Math.sin(randomDistance / earthRadius) * Math.cos(lat1),
    Math.cos(randomDistance / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
  )

  return {
    lat: (lat2 * 180) / Math.PI,
    lng: (lng2 * 180) / Math.PI,
  }
}

/**
 * 샘플 체크인 데이터 생성
 */
function generateCheckIns(event: Event, count: number) {
  const checkIns = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const location = generateRandomCoordinates(event.coordinates, event.radius * 0.8)
    const userName = getRandomName()
    const timestamp = now - Math.floor(Math.random() * 3600000) // 최근 1시간 이내

    checkIns.push({
      eventId: event.id,
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      userName: userName,
      location: {
        lat: parseFloat(location.lat.toFixed(6)),
        lng: parseFloat(location.lng.toFixed(6)),
      },
      checkedInAt: new Date(timestamp).toISOString(),
      isAnonymous: Math.random() > 0.7, // 30% 익명
    })
  }

  return checkIns
}

/**
 * 샘플 촛불 데이터 생성 (Realtime Database용)
 */
function generateCandles(event: Event, onsiteCount: number, remoteCount: number) {
  const candles = []
  const now = Date.now()

  // 현장 참여자
  for (let i = 0; i < onsiteCount; i++) {
    const location = generateRandomCoordinates(event.coordinates, event.radius * 0.9)
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`

    candles.push({
      userId: userId,
      eventId: event.id,
      type: 'onsite',
      location: {
        lat: parseFloat(location.lat.toFixed(6)),
        lng: parseFloat(location.lng.toFixed(6)),
      },
      timestamp: now - Math.floor(Math.random() * 1800000), // 최근 30분 이내
    })
  }

  // 원격 참여자 (위치 정보 없음)
  for (let i = 0; i < remoteCount; i++) {
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`

    candles.push({
      userId: userId,
      eventId: event.id,
      type: 'remote',
      timestamp: now - Math.floor(Math.random() * 3600000), // 최근 1시간 이내
    })
  }

  return candles
}

/**
 * 샘플 댓글 데이터 생성 (위치 정보 포함)
 */
function generateComments(event: Event, count: number) {
  const comments = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const userId = `user_${Math.random().toString(36).substr(2, 9)}`
    const userName = getRandomName()
    const content = SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)]

    // 50% 확률로 위치 정보 포함 (온라인 참여자 위치)
    const hasLocation = Math.random() > 0.5
    const location = hasLocation
      ? generateRandomCoordinates(event.coordinates, event.radius * 2) // 이벤트 반경의 2배 범위
      : null

    comments.push({
      eventId: event.id,
      userId: userId,
      userName: userName,
      content: content,
      isRemote: true,
      isAIGenerated: false,
      likes: Math.floor(Math.random() * 20),
      location: location ? {
        lat: parseFloat(location.lat.toFixed(6)),
        lng: parseFloat(location.lng.toFixed(6)),
      } : null,
      createdAt: now - Math.floor(Math.random() * 7200000), // 최근 2시간 이내
    })
  }

  return comments
}

/**
 * 모든 샘플 데이터 생성
 */
function generateAllSampleData() {
  const allData: any = {
    checkIns: [],
    candles: [],
    comments: [],
  }

  SAMPLE_EVENTS.forEach((event, index) => {
    // 이벤트별로 다른 수의 참여자 생성
    const isOngoing = index === 2 // 노동자 권리 집회 (진행중)

    const checkInCount = isOngoing ? 15 : Math.floor(Math.random() * 8) + 3 // 3-10명, 진행중은 15명
    const onsiteCandleCount = isOngoing ? 25 : Math.floor(Math.random() * 15) + 5 // 5-20명, 진행중은 25명
    const remoteCandleCount = isOngoing ? 50 : Math.floor(Math.random() * 30) + 10 // 10-40명, 진행중은 50명
    const commentCount = isOngoing ? 30 : Math.floor(Math.random() * 20) + 5 // 5-25개, 진행중은 30개

    console.log(`\n📍 ${event.title}`)
    console.log(`   체크인: ${checkInCount}명`)
    console.log(`   현장 촛불: ${onsiteCandleCount}명`)
    console.log(`   원격 촛불: ${remoteCandleCount}명`)
    console.log(`   댓글: ${commentCount}개\n`)

    allData.checkIns.push(...generateCheckIns(event, checkInCount))
    allData.candles.push(...generateCandles(event, onsiteCandleCount, remoteCandleCount))
    allData.comments.push(...generateComments(event, commentCount))
  })

  return allData
}

// 스크립트 실행
console.log('🎯 샘플 참여자 데이터 생성 시작...\n')
console.log('⚠️  주의: Firebase에서 실제 이벤트 ID를 확인하고 SAMPLE_EVENTS 배열을 수정하세요!\n')

const sampleData = generateAllSampleData()

console.log('\n✅ 생성 완료!\n')
console.log(`📊 총 통계:`)
console.log(`   - 체크인: ${sampleData.checkIns.length}개`)
console.log(`   - 촛불: ${sampleData.candles.length}개`)
console.log(`   - 댓글: ${sampleData.comments.length}개\n`)

console.log('📝 생성된 데이터를 확인하려면:')
console.log('   console.log(JSON.stringify(sampleData, null, 2))\n')

console.log('🔥 Firebase에 추가하는 방법:')
console.log('   1. Firebase Admin SDK 설치: npm install firebase-admin')
console.log('   2. addSampleDataToFirebase.ts 스크립트 사용')
console.log('   3. 또는 Firebase Console에서 수동으로 추가\n')

// JSON 파일로 저장하고 싶다면 주석 해제
// import fs from 'fs'
// fs.writeFileSync('sample-participants.json', JSON.stringify(sampleData, null, 2))
// console.log('💾 sample-participants.json 파일로 저장되었습니다!')

export { generateAllSampleData, generateCheckIns, generateCandles, generateComments }
