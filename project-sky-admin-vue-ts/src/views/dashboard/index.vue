<template>
  <div class="dashboard-container home">
    <!-- 营业数据 -->
    <Overview :overviewData="overviewData" />
    <!-- end -->
    <!-- 订单管理 -->
    <Orderview :orderviewData="orderviewData" />
    <!-- end -->
    <div class="homeMain">
      <!-- 菜品总览 -->
      <CuisineStatistics :dishesData="dishesData" />
      <!-- end -->
      <!-- 套餐总览 -->
      <SetMealStatistics :setMealData="setMealData" />
      <!-- end -->
    </div>
    <!-- 订单信息 -->
    <OrderList
      :order-statics="orderStatics"
      @getOrderListBy3Status="getOrderListBy3Status"
    />
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getBusinessData,
  getDataOverView,
  getOrderData,
  getOverviewDishes,
  getSetMealStatistics,
} from '@/api/index'
import { getOrderListBy } from '@/api/order'
import Overview from './components/overview.vue'
import Orderview from './components/orderview.vue'
import CuisineStatistics from './components/cuisineStatistics.vue'
import SetMealStatistics from './components/setMealStatistics.vue'
import OrderList from './components/orderList.vue'

defineOptions({
  name: 'Dashboard',
})

const todayData = ref<any>({})
const overviewData = ref({})
const orderviewData = ref<any>({})
const flag = ref(2)
const tateData = ref([])
const dishesData = ref<any>({})
const setMealData = ref({})
const orderListData = ref([])
const counts = ref(0)
const page = ref<number>(1)
const pageSize = ref<number>(10)
const status = ref(2)
const orderStatics = ref<any>({})

// 获取营业数据
async function getBusinessDataFn() {
  const data = await getBusinessData()
  overviewData.value = data.data.data
}

// 获取今日订单
async function getOrderStatisticsData() {
  const data = await getOrderData()
  orderviewData.value = data.data.data
}

// 获取菜品总览数据
async function getOverStatisticsData() {
  const data = await getOverviewDishes()
  dishesData.value = data.data.data
}

// 获取套餐总览数据
async function getSetMealStatisticsData() {
  const data = await getSetMealStatistics()
  setMealData.value = data.data.data
}

//获取待处理，待派送，派送中数量
function getOrderListBy3Status() {
  getOrderListBy({})
    .then((res) => {
      if (res.data.code === 1) {
        orderStatics.value = res.data.data
      } else {
        ElMessage.error(res.data.msg)
      }
    })
    .catch((err) => {
      ElMessage.error('请求出错了：' + err.message)
    })
}

function init() {
  nextTick(() => {
    getBusinessDataFn()
    getOrderStatisticsData()
    getOverStatisticsData()
    getSetMealStatisticsData()
  })
}

init()
</script>

<style lang="scss">
</style>
