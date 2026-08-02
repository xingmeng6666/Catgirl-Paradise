<template>
  <div class="container">
    <h2 class="homeTitle">用户统计</h2>
    <div class="charBox">
      <div id="usermain" style="width: 100%; height: 320px"></div>
      <ul class="orderListLine user">
        <li class="one"><span></span>用户总量（个）</li>
        <li class="three"><span></span>新增用户（个）</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue'
import * as echarts from 'echarts'

defineOptions({
  name: 'UserStatistics',
})

const props = defineProps<{
  userdata: any
}>()

watch(
  () => props.userdata,
  () => {
    nextTick(() => {
      initChart()
    })
  }
)

function initChart() {
  type EChartsOption = echarts.EChartsOption
  const chartDom = document.getElementById('usermain') as any
  const myChart = echarts.init(chartDom)
  var option: any
  option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderRadius: 2,
      textStyle: {
        color: '#333',
        fontSize: 12,
        fontWeight: 300,
      },
    },
    grid: {
      top: '5%',
      left: '20',
      right: '50',
      bottom: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        textStyle: {
          color: '#666',
          fontSize: '12px',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#E5E4E4',
          width: 1,
        },
      },
      data: props.userdata.dateList,
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        axisLabel: {
          textStyle: {
            color: '#666',
            fontSize: '12px',
          },
        },
      },
    ],
    series: [
      {
        name: '用户总量',
        type: 'line',
        smooth: false,
        showSymbol: false,
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#FFD000',
            lineStyle: {
              color: '#FFD000',
            },
          },
          emphasis: {
            color: '#fff',
            borderWidth: 5,
            borderColor: '#C3A6FF',
          },
        },
        data: props.userdata.totalUserList,
      },
      {
        name: '新增用户',
        type: 'line',
        smooth: false,
        showSymbol: false,
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#FD7F7F',
            fontWeigth: 300,
            lineStyle: {
              color: '#FD7F7F',
            },
          },
          emphasis: {
            color: '#fff',
            borderWidth: 5,
            borderColor: '#FD7F7F',
          },
        },
        data: props.userdata.newUserList,
      },
    ],
  }
  option && myChart.setOption(option)
}
</script>
<style scoped>
</style>
