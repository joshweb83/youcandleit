/**
 * useNotifications 커스텀 훅
 *
 * 브라우저 알림 상태 및 관리 기능을 제공합니다.
 */

import { useState, useEffect, useCallback } from 'react'
import {
  requestNotificationPermission,
  getNotificationPermission,
  scheduleEventNotification,
  cancelEventNotification,
  isNotificationScheduled,
  getScheduledNotifications,
  checkAndSendNotifications,
  cleanupExpiredNotifications,
  sendTestNotification,
} from '@/services/notifications'
import type { EventNotification } from '@/services/notifications'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getNotificationPermission()
  )
  const [scheduledNotifications, setScheduledNotifications] = useState<EventNotification[]>([])

  // 알림 목록 로드
  const loadNotifications = useCallback(() => {
    const notifications = getScheduledNotifications()
    setScheduledNotifications(notifications)
  }, [])

  // 초기 로드 및 주기적인 체크
  useEffect(() => {
    loadNotifications()
    cleanupExpiredNotifications()

    // 1분마다 알림 체크
    const interval = setInterval(() => {
      checkAndSendNotifications()
      loadNotifications()
    }, 60000) // 60초

    return () => clearInterval(interval)
  }, [loadNotifications])

  // 알림 권한 요청
  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission()
    setPermission(getNotificationPermission())
    return granted
  }, [])

  // 알림 예약
  const scheduleNotification = useCallback(
    (eventId: string, eventTitle: string, eventDate: string) => {
      const success = scheduleEventNotification(eventId, eventTitle, eventDate)
      if (success) {
        loadNotifications()
      }
      return success
    },
    [loadNotifications]
  )

  // 알림 취소
  const cancelNotification = useCallback(
    (eventId: string) => {
      const success = cancelEventNotification(eventId)
      if (success) {
        loadNotifications()
      }
      return success
    },
    [loadNotifications]
  )

  // 알림 예약 여부 확인
  const isScheduled = useCallback((eventId: string) => {
    return isNotificationScheduled(eventId)
  }, [])

  // 테스트 알림 전송
  const sendTest = useCallback(() => {
    sendTestNotification()
  }, [])

  return {
    permission,
    scheduledNotifications,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    isScheduled,
    sendTest,
    hasPermission: permission === 'granted',
    isSupported: permission !== 'unsupported',
  }
}
