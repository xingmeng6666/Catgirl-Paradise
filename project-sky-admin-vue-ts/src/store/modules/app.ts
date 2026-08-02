import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'

export enum DeviceType {
  Mobile,
  Desktop,
}

export const useAppStore = defineStore('app', () => {
  const sidebar = ref({
    opened: true,
    withoutAnimation: false,
  })
  const device = ref<DeviceType>(DeviceType.Desktop)
  const statusNumber = ref<number>(0)

  function toggleSideBar(withoutAnimation: boolean) {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = withoutAnimation
    if (sidebar.value.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  function closeSideBar(withoutAnimation: boolean) {
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  function toggleDevice(deviceVal: DeviceType) {
    device.value = deviceVal
  }

  function setStatusNumber(val: any) {
    statusNumber.value = val
  }

  return {
    sidebar,
    device,
    statusNumber,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    setStatusNumber,
  }
})
