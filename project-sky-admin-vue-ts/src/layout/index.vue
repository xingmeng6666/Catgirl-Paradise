<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="classObj.mobile && appStore.sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <Navbar />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore, DeviceType } from '@/store/modules/app'
import AppMain from './components/AppMain.vue'
import Navbar from './components/Navbar/index.vue'
import Sidebar from './components/Sidebar/index.vue'

defineOptions({ name: 'Layout' })

const appStore = useAppStore()
const route = useRoute()

const WIDTH = 992

function isMobile() {
  const rect = document.body.getBoundingClientRect()
  return rect.width - 1 < WIDTH
}

function resizeHandler() {
  if (!document.hidden) {
    const mobile = isMobile()
    appStore.toggleDevice(mobile ? DeviceType.Mobile : DeviceType.Desktop)
    if (mobile) {
      appStore.closeSideBar(true)
    }
  }
}

watch(
  () => route.path,
  () => {
    if (appStore.device === DeviceType.Mobile && appStore.sidebar.opened) {
      appStore.closeSideBar(false)
    }
  }
)

onBeforeMount(() => {
  window.addEventListener('resize', resizeHandler)
})

onMounted(() => {
  const mobile = isMobile()
  if (mobile) {
    appStore.toggleDevice(DeviceType.Mobile)
    appStore.closeSideBar(true)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
  mobile: appStore.device === DeviceType.Mobile,
}))

function handleClickOutside() {
  appStore.closeSideBar(false)
}
</script>

<style lang="scss" scoped>
$sideBarWidth: 190px;
$gray-5: #F3F4F7;
@mixin clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 1366px;
  overflow: visible;
}

.main-container {
  height: 100%;
  background: #f3f4f7;
  position: relative;
  width: calc(100% - 190px);
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 99;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  background: $gray-5;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  // font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  overflow: hidden;
}

.hideSidebar {
  .main-container {
    margin-left: 80px;
    width: calc(100% - 80px);
  }

  .sidebar-container {
    width: 80px !important;
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
