/**
 * Firebase에 샘플 참여자 데이터 추가 스크립트
 *
 * 사용 방법:
 * 1. Firebase 웹 콘솔에서 실제 이벤트 ID를 확인
 * 2. generateSampleParticipants.ts의 SAMPLE_EVENTS 배열 수정
 * 3. 이 스크립트를 브라우저 콘솔에서 실행
 *
 * 주의: 이 스크립트는 브라우저 환경에서 Firebase SDK를 사용합니다.
 */

import { db, rtdb } from '../services/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { ref, set, push } from 'firebase/database'
import { generateAllSampleData } from './generateSampleParticipants'

/**
 * Firestore에 체크인 데이터 추가
 */
async function addCheckInsToFirestore(checkIns: any[]) {
  console.log('📍 체크인 데이터 추가 중...')

  const checkInsRef = collection(db!, 'checkIns')

  for (const checkIn of checkIns) {
    try {
      await addDoc(checkInsRef, {
        ...checkIn,
        checkedInAt: Timestamp.fromDate(new Date(checkIn.checkedInAt)),
      })
    } catch (error) {
      console.error('체크인 추가 실패:', error)
    }
  }

  console.log(`✅ ${checkIns.length}개 체크인 추가 완료`)
}

/**
 * Realtime Database에 촛불 데이터 추가
 */
async function addCandlesToRealtimeDB(candles: any[]) {
  console.log('🕯️  촛불 데이터 추가 중...')

  if (!rtdb) {
    console.error('❌ Realtime Database가 초기화되지 않았습니다.')
    return
  }

  for (const candle of candles) {
    try {
      const candlesRef = ref(rtdb, `candles/${candle.eventId}`)
      const newCandleRef = push(candlesRef)
      await set(newCandleRef, candle)
    } catch (error) {
      console.error('촛불 추가 실패:', error)
    }
  }

  console.log(`✅ ${candles.length}개 촛불 추가 완료`)
}

/**
 * Firestore에 댓글 데이터 추가
 */
async function addCommentsToFirestore(comments: any[]) {
  console.log('💬 댓글 데이터 추가 중...')

  const commentsRef = collection(db!, 'comments')

  for (const comment of comments) {
    try {
      // location이 null인 경우 제거
      const commentData = {
        ...comment,
        createdAt: Timestamp.fromMillis(comment.createdAt),
      }

      if (!comment.location) {
        delete commentData.location
      }

      await addDoc(commentsRef, commentData)
    } catch (error) {
      console.error('댓글 추가 실패:', error)
    }
  }

  console.log(`✅ ${comments.length}개 댓글 추가 완료`)
}

/**
 * 모든 샘플 데이터를 Firebase에 추가
 */
export async function addAllSampleDataToFirebase() {
  console.log('🚀 Firebase에 샘플 데이터 추가 시작...\n')

  if (!db || !rtdb) {
    console.error('❌ Firebase가 초기화되지 않았습니다.')
    return
  }

  const sampleData = generateAllSampleData()

  try {
    // 순차적으로 추가 (너무 많은 요청 방지)
    await addCheckInsToFirestore(sampleData.checkIns)
    await addCandlesToRealtimeDB(sampleData.candles)
    await addCommentsToFirestore(sampleData.comments)

    console.log('\n✅ 모든 샘플 데이터 추가 완료!')
    console.log('🗺️  지도 페이지를 새로고침하여 참여자 마커를 확인하세요.')
  } catch (error) {
    console.error('❌ 데이터 추가 중 오류 발생:', error)
  }
}

// 브라우저 콘솔에서 사용할 수 있도록 전역으로 노출
if (typeof window !== 'undefined') {
  ;(window as any).addSampleParticipants = addAllSampleDataToFirebase
}

console.log('💡 브라우저 콘솔에서 다음 명령어로 실행:')
console.log('   window.addSampleParticipants()')
