<template>
  <div
    :id="id"
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useResizeChart } from './composables/useResizeChart'

defineOptions({ name: 'BarChart' })

const props = withDefaults(defineProps<{
  className?: string
  id?: string
  width?: string
  height?: string
  title?: string
  chartData?: any
}>(), {
  className: 'chart',
  id: 'BarChart',
  width: '100%',
  height: '250px',
  title: 'Requests',
  chartData: () => ({})
})

const chart = ref<echarts.ECharts | null>(null)

function initChart() {
  chart.value = echarts.init(document.getElementById(props.id) as HTMLDivElement)

  const data = props.chartData

  chart.value.setOption({title: {
    text: props.title,
    left: 'left'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    left: 0,
    top: 50,
    bottom: 20,
    data: data.legendData,
    selected: data.selected
  },
  series: [
    {
      name: '占比',
      type: 'pie',
      radius: '65%',
      left:80,
      center: ['40%', '50%'],
      data: data.seriesData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        normal: {
          color: function (params:any) {
            var colorList = ['#FF8BA7', '#C3A6FF', '#7EC8E3', '#98E4C6', '#FFD93D', '#FFB5C8', '#D9C9FF', '#A8E6CF', '#FFD1DC'];
            return colorList[params.dataIndex];
          }
        }
      }
    }
  ]} as any)
}

function init() {
  nextTick(() => {
    initChart()
  })
}

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (!chart.value) {
    return
  }
  chart.value.dispose()
  chart.value = null
})

watch(() => props.chartData, () => {
  init()
})

useResizeChart(() => chart.value)
</script>
