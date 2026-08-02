import { onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import type { ECharts } from 'echarts'

export function useResizeChart(getChart: () => ECharts | null) {
  let sidebarElm: Element | undefined

  function chartResizeHandler() {
    const chart = getChart()
    if (chart) {
      chart.resize()
    }
  }

  function sidebarResizeHandler(e: TransitionEvent) {
    if (e.propertyName === 'width') {
      chartResizeHandler()
    }
  }

  function initResizeEvent() {
    window.addEventListener('resize', chartResizeHandler)
  }

  function destroyResizeEvent() {
    window.removeEventListener('resize', chartResizeHandler)
  }

  function initSidebarResizeEvent() {
    sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if (sidebarElm) {
      sidebarElm.addEventListener('transitionend', sidebarResizeHandler as EventListener)
    }
  }

  function destroySidebarResizeEvent() {
    if (sidebarElm) {
      sidebarElm.removeEventListener('transitionend', sidebarResizeHandler as EventListener)
    }
  }

  onMounted(() => {
    initResizeEvent()
    initSidebarResizeEvent()
  })

  onBeforeUnmount(() => {
    destroyResizeEvent()
    destroySidebarResizeEvent()
  })

  onActivated(() => {
    initResizeEvent()
    initSidebarResizeEvent()
  })

  onDeactivated(() => {
    destroyResizeEvent()
    destroySidebarResizeEvent()
  })
}
