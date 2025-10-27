# 🎬 샘플 데이터

Firebase Firestore에 추가할 수 있는 샘플 집회 데이터입니다.

## 사용 방법

1. Firebase Console → Firestore Database 열기
2. `events` 컬렉션 선택 (없으면 생성)
3. "문서 추가" 클릭
4. 아래 JSON 데이터 복사/붙여넣기
5. Timestamp 필드는 Firebase Console에서 "타임스탬프" 타입으로 설정

---

## 샘플 집회 1: 기후정의 집회

```json
{
  "title": "기후정의를 위한 촛불집회",
  "description": "지구를 위한 시민들의 목소리입니다. 기후위기는 더 이상 미래의 문제가 아닙니다. 우리 세대가 직면한 가장 중요한 과제입니다. 함께 모여 정부와 기업에 강력한 기후 정책을 요구합시다.",
  "summary": "기후위기 대응을 촉구하는 평화로운 시민집회",
  "location": {
    "address": "서울특별시 중구 태평로1가 31, 서울시청 앞 광장",
    "details": "서울시청역 5번 출구에서 도보 3분",
    "coordinates": {
      "lat": 37.5665,
      "lng": 126.9780
    },
    "radius": 500
  },
  "datetime": {
    "start": "2025-11-15T18:00:00+09:00",
    "end": "2025-11-15T21:00:00+09:00"
  },
  "organizer": "시민환경연대",
  "liveStreamUrl": "",
  "tags": ["환경", "기후", "정의", "미래"],
  "status": "scheduled",
  "participantCount": 0,
  "remoteCount": 0,
  "createdAt": 1730000000000,
  "createdBy": "system",
  "updatedAt": 1730000000000
}
```

---

## 샘플 집회 2: 교육 평등 집회

```json
{
  "title": "모두를 위한 교육, 교육 평등 실현 촛불집회",
  "description": "모든 아이들이 동등한 교육 기회를 받을 권리가 있습니다. 지역, 경제적 배경, 장애 여부와 상관없이 모든 학생들이 양질의 교육을 받을 수 있도록 교육 정책 개선을 요구합니다.",
  "summary": "교육 불평등 해소와 공교육 강화를 위한 시민 집회",
  "location": {
    "address": "서울특별시 종로구 사직로 161, 광화문광장",
    "details": "광화문역 2번 출구 광장",
    "coordinates": {
      "lat": 37.5720,
      "lng": 126.9769
    },
    "radius": 300
  },
  "datetime": {
    "start": "2025-11-22T15:00:00+09:00",
    "end": "2025-11-22T18:00:00+09:00"
  },
  "organizer": "교육평등시민연대",
  "liveStreamUrl": "https://youtube.com/live/example123",
  "tags": ["교육", "평등", "공교육", "학생"],
  "status": "scheduled",
  "participantCount": 0,
  "remoteCount": 0,
  "createdAt": 1730100000000,
  "createdBy": "system",
  "updatedAt": 1730100000000
}
```

---

## 샘플 집회 3: 노동자 권리 집회 (진행 중)

```json
{
  "title": "노동자 권리 보장 촛불집회",
  "description": "최저임금 현실화, 근로시간 단축, 비정규직 차별 철폐를 요구합니다. 일하는 모든 사람들이 존엄하게 살 수 있는 노동환경을 만들어갑시다.",
  "summary": "노동자의 권리와 처우 개선을 위한 집회",
  "location": {
    "address": "서울특별시 영등포구 여의도동, 국회의사당 앞",
    "details": "국회의사당역 1번 출구",
    "coordinates": {
      "lat": 37.5323,
      "lng": 126.9146
    },
    "radius": 400
  },
  "datetime": {
    "start": "2025-10-30T17:00:00+09:00",
    "end": "2025-10-30T20:00:00+09:00"
  },
  "organizer": "전국노동조합연대",
  "liveStreamUrl": "https://youtube.com/live/labor-rights-2025",
  "tags": ["노동", "권리", "최저임금", "비정규직"],
  "status": "ongoing",
  "participantCount": 1250,
  "remoteCount": 3420,
  "createdAt": 1729800000000,
  "createdBy": "system",
  "updatedAt": 1729900000000
}
```

---

## 샘플 집회 4: 평화 통일 집회

```json
{
  "title": "한반도 평화와 통일을 위한 시민 촛불집회",
  "description": "한반도의 평화와 남북 화해, 평화통일을 향한 시민들의 염원을 모읍니다. 전쟁 없는 평화로운 한반도를 다음 세대에게 물려줍시다.",
  "summary": "한반도 평화와 남북 화해를 위한 평화집회",
  "location": {
    "address": "서울특별시 중구 세종대로 110, 서울광장",
    "details": "시청역 5번 출구 서울광장",
    "coordinates": {
      "lat": 37.5665,
      "lng": 126.9779
    },
    "radius": 600
  },
  "datetime": {
    "start": "2025-12-01T14:00:00+09:00",
    "end": "2025-12-01T17:00:00+09:00"
  },
  "organizer": "한반도평화시민연대",
  "liveStreamUrl": "",
  "tags": ["평화", "통일", "남북", "화해"],
  "status": "scheduled",
  "participantCount": 0,
  "remoteCount": 0,
  "createdAt": 1730200000000,
  "createdBy": "system",
  "updatedAt": 1730200000000
}
```

---

## 샘플 집회 5: 성평등 집회 (종료)

```json
{
  "title": "성평등 실현을 위한 촛불문화제",
  "description": "성별에 따른 차별과 폭력 없는 사회를 만들어갑시다. 동일노동 동일임금, 성폭력 근절, 유리천장 철폐를 요구합니다.",
  "summary": "성평등 사회 실현을 위한 문화제 형식 집회",
  "location": {
    "address": "부산광역시 중구 중앙동 광복로, 광복로 문화거리",
    "details": "남포동역 1번 출구 광복로",
    "coordinates": {
      "lat": 35.0988,
      "lng": 129.0303
    },
    "radius": 350
  },
  "datetime": {
    "start": "2025-10-15T16:00:00+09:00",
    "end": "2025-10-15T19:00:00+09:00"
  },
  "organizer": "성평등실천시민모임",
  "liveStreamUrl": "https://youtube.com/watch?v=example456",
  "tags": ["성평등", "여성", "인권", "차별철폐"],
  "status": "ended",
  "participantCount": 2800,
  "remoteCount": 5600,
  "createdAt": 1728500000000,
  "createdBy": "system",
  "updatedAt": 1729000000000
}
```

---

## Firebase에 직접 추가하기

### Firestore Console 사용

1. Firebase Console → Firestore Database
2. "컬렉션 시작" 또는 `events` 컬렉션 선택
3. "문서 추가" 클릭
4. **자동 ID** 선택
5. 위 JSON을 필드별로 입력:
   - 텍스트 필드: `string` 타입
   - 숫자 필드: `number` 타입
   - 객체 필드: `map` 타입
   - 배열 필드: `array` 타입
   - 날짜 필드: `timestamp` 타입 (ISO 문자열을 timestamp로 변환)

### 주의사항

- `datetime.start`와 `datetime.end`는 ISO 8601 형식 문자열
- `createdAt`과 `updatedAt`는 밀리초 단위 timestamp
- `coordinates`의 `lat`과 `lng`는 숫자 타입
- `status`는 `scheduled`, `ongoing`, `ended` 중 하나

---

## 대량 데이터 추가 (개발자용)

Firebase Admin SDK를 사용하여 대량으로 추가할 수 있습니다:

```javascript
// Node.js 스크립트
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const eventsData = [/* 위 JSON 배열 */];

async function addEvents() {
  for (const event of eventsData) {
    await db.collection('events').add({
      ...event,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });
  }
  console.log('모든 이벤트가 추가되었습니다!');
}

addEvents();
```

---

## 샘플 댓글 데이터

`comments` 컬렉션에 추가:

```json
{
  "eventId": "[집회 ID]",
  "userId": "[사용자 UID]",
  "userName": "김시민",
  "content": "함께합니다! 우리의 목소리가 변화를 만들 거예요 💪",
  "isRemote": true,
  "isAIGenerated": false,
  "likes": 0,
  "createdAt": 1730000000000
}
```

---

Made with ❤️ for Democracy
