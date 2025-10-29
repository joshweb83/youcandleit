/**
 * Firebase Storage 서비스
 *
 * 이미지 업로드 및 관리 기능을 제공합니다.
 */

import { storage } from './config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

/**
 * 이미지를 Firebase Storage에 업로드합니다.
 *
 * @param file - 업로드할 이미지 파일
 * @param path - Storage 내 저장 경로 (예: 'posters/event-123.jpg')
 * @returns 업로드된 이미지의 다운로드 URL
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage가 초기화되지 않았습니다.')
  }

  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.')
  }

  // 파일 크기 검증 (10MB 제한)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('파일 크기는 10MB를 초과할 수 없습니다.')
  }

  try {
    // Storage 참조 생성
    const storageRef = ref(storage, path)

    // 파일 업로드
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
    })

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error('이미지 업로드 실패:', error)
    throw new Error('이미지 업로드에 실패했습니다.')
  }
}

/**
 * 포스터 이미지를 업로드합니다.
 *
 * @param file - 업로드할 포스터 이미지 파일
 * @param eventId - 집회 ID (선택, 없으면 타임스탬프 사용)
 * @returns 업로드된 이미지의 다운로드 URL
 */
export async function uploadPosterImage(file: File, eventId?: string): Promise<string> {
  const timestamp = Date.now()
  const fileName = eventId ? `${eventId}-${timestamp}` : `${timestamp}`
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `posters/${fileName}.${extension}`

  return uploadImage(file, path)
}
