/**
 * 브라우저 알림 서비스
 *
 * 집회 시작 알림을 관리합니다.
 */

export interface EventNotification {
  eventId: string
  eventTitle: string
  eventDate: string // ISO string
  notificationTime: number // timestamp
  scheduled: boolean
}

const STORAGE_KEY = 'youcandle_notifications'

/**
 * 알림 권한 요청
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('이 브라우저는 알림을 지원하지 않습니다.')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

/**
 * 알림 권한 상태 확인
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported'
  }
  return Notification.permission
}

/**
 * 테스트 알림 보내기
 */
export function sendTestNotification() {
  if (Notification.permission === 'granted') {
    new Notification('Youcandle it 알림 테스트', {
      body: '알림이 정상적으로 작동합니다! 🕯️',
      icon: '/favicon.ico',
      tag: 'test',
    })
  }
}

/**
 * 즉시 알림 보내기
 */
export function sendNotification(title: string, body: string, tag?: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: tag || 'event-notification',
      requireInteraction: true,
    })
  }
}

/**
 * 저장된 알림 목록 가져오기
 */
export function getScheduledNotifications(): EventNotification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch (error) {
    console.error('알림 목록 불러오기 실패:', error)
    return []
  }
}

/**
 * 알림 저장
 */
export function saveNotifications(notifications: EventNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch (error) {
    console.error('알림 저장 실패:', error)
  }
}

/**
 * 특정 집회에 대한 알림 예약 추가
 */
export function scheduleEventNotification(
  eventId: string,
  eventTitle: string,
  eventDate: string
): boolean {
  const notifications = getScheduledNotifications()

  // 이미 예약된 알림이 있는지 확인
  const existing = notifications.find((n) => n.eventId === eventId)
  if (existing) {
    console.log('이미 알림이 예약되어 있습니다.')
    return false
  }

  // 집회 시작 30분 전 알림 시간 계산
  const eventTime = new Date(eventDate).getTime()
  const notificationTime = eventTime - 30 * 60 * 1000 // 30분 전

  // 이미 지난 시간인지 확인
  if (notificationTime <= Date.now()) {
    console.log('알림 시간이 이미 지났습니다.')
    return false
  }

  const newNotification: EventNotification = {
    eventId,
    eventTitle,
    eventDate,
    notificationTime,
    scheduled: true,
  }

  notifications.push(newNotification)
  saveNotifications(notifications)

  return true
}

/**
 * 특정 집회에 대한 알림 예약 취소
 */
export function cancelEventNotification(eventId: string): boolean {
  const notifications = getScheduledNotifications()
  const filtered = notifications.filter((n) => n.eventId !== eventId)

  if (filtered.length === notifications.length) {
    return false // 삭제된 알림이 없음
  }

  saveNotifications(filtered)
  return true
}

/**
 * 특정 집회에 대한 알림이 예약되어 있는지 확인
 */
export function isNotificationScheduled(eventId: string): boolean {
  const notifications = getScheduledNotifications()
  return notifications.some((n) => n.eventId === eventId)
}

/**
 * 만료된 알림 정리
 */
export function cleanupExpiredNotifications() {
  const notifications = getScheduledNotifications()
  const now = Date.now()

  // 집회 시간이 지난 알림 제거
  const valid = notifications.filter((n) => {
    const eventTime = new Date(n.eventDate).getTime()
    return eventTime > now
  })

  if (valid.length !== notifications.length) {
    saveNotifications(valid)
  }
}

/**
 * 알림 체크 및 발송 (주기적으로 호출)
 */
export function checkAndSendNotifications() {
  const notifications = getScheduledNotifications()
  const now = Date.now()
  const toSend: EventNotification[] = []
  const remaining: EventNotification[] = []

  notifications.forEach((notification) => {
    if (notification.notificationTime <= now && notification.scheduled) {
      toSend.push(notification)
    } else {
      remaining.push(notification)
    }
  })

  // 발송할 알림이 있으면 전송
  toSend.forEach((notification) => {
    sendNotification(
      `🕯️ ${notification.eventTitle}`,
      `30분 후에 시작됩니다!\n${new Date(notification.eventDate).toLocaleString('ko-KR')}`,
      notification.eventId
    )
  })

  // 발송한 알림 제거
  if (toSend.length > 0) {
    saveNotifications(remaining)
  }
}

/**
 * 모든 알림 취소
 */
export function cancelAllNotifications() {
  localStorage.removeItem(STORAGE_KEY)
}
