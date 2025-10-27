/**
 * useGeolocation 커스텀 훅
 *
 * GPS 위치 정보를 추적합니다.
 */

import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation(watch = false) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation을 지원하지 않는 브라우저입니다',
        loading: false,
      }))
      return
    }

    const onSuccess: PositionCallback = (position) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      })
    }

    const onError: PositionErrorCallback = (error) => {
      setState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }))
    }

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      })

      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
  }, [watch])

  return state
}
