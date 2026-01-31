import { useState } from 'react'

export type DeviceType = 'phone' | 'tablet' | null

const STORAGE_KEY = 'hvac-device-type'

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(STORAGE_KEY) as DeviceType
  })

  const setDevice = (type: DeviceType) => {
    setDeviceType(type)
    if (type) {
      localStorage.setItem(STORAGE_KEY, type)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const clearDevice = () => {
    setDeviceType(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return { deviceType, setDevice, clearDevice }
}
