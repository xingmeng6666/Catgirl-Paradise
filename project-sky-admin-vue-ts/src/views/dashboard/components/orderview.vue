<template>
  <div class="container">
    <h2 class="homeTitle">
      <span class="title-icon">📦</span>
      订单管理<i>{{ days[1] }}</i>
      <span class="detail-link"><router-link to="/order">订单明细 →</router-link></span>
    </h2>
    <div class="orderviewBox">
      <ul>
        <li class="card-waiting">
          <span class="status">
            <i class="iconfont icon-waiting"></i>待接单
          </span>
          <span class="num">
            <router-link to="/order?status=2">{{ orderviewData.waitingOrders }}</router-link>
          </span>
        </li>
        <li class="card-deliver">
          <span class="status">
            <i class="iconfont icon-staySway"></i>待派送
          </span>
          <span class="num">
            <router-link to="/order?status=3">{{ orderviewData.deliveredOrders }}</router-link>
          </span>
        </li>
        <li class="card-done">
          <span class="status">
            <i class="iconfont icon-complete"></i>已完成
          </span>
          <span class="num">
            <router-link to="/order?status=5">{{ orderviewData.completedOrders }}</router-link>
          </span>
        </li>
        <li class="card-cancel">
          <span class="status">
            <i class="iconfont icon-cancel"></i>已取消
          </span>
          <span class="num">
            <router-link to="/order?status=6">{{ orderviewData.cancelledOrders }}</router-link>
          </span>
        </li>
        <li class="card-all">
          <span class="status">
            <i class="iconfont icon-all"></i>全部订单
          </span>
          <span class="num">
            <router-link to="/order">{{ orderviewData.allOrders }}</router-link>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getday } from '@/utils/formValidate'

defineOptions({
  name: 'Orderview',
})

const props = defineProps<{
  orderviewData: any
}>()

const days = computed(() => getday())
</script>

<style lang="scss" scoped>
.homeTitle {
  font-weight: 700;
  font-size: 18px;
  color: #5A5A6E;
  letter-spacing: -0.2px;
  padding: 5px 0 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    font-size: 22px;
  }

  i {
    font-size: 13px;
    color: #8E8EA0;
    padding-left: 6px;
    font-style: normal;
    font-weight: normal;
  }

  .detail-link {
    margin-left: auto;
    a {
      color: #FF8BA7;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        color: #E86B8A;
      }
    }
  }
}

.orderviewBox {
  ul {
    display: flex;
    text-align: left;
    margin-left: -14px;
    gap: 0;

    li {
      flex: 1;
      border-radius: 14px;
      margin-left: 14px;
      padding: 18px 16px;
      font-size: 14px;
      line-height: 1.8;
      color: #5A5A6E;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-left: 4px solid transparent;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
      }

      &.card-waiting {
        background: linear-gradient(135deg, #FFF0F5 0%, #FFE8EE 100%);
        border-left-color: #FF8BA7;
      }

      &.card-deliver {
        background: linear-gradient(135deg, #FFF8E6 0%, #FFF0CC 100%);
        border-left-color: #FFD93D;
      }

      &.card-done {
        background: linear-gradient(135deg, #E6F9F0 0%, #D4F5E6 100%);
        border-left-color: #98E4C6;
      }

      &.card-cancel {
        background: linear-gradient(135deg, #F5F5FA 0%, #EEEEF5 100%);
        border-left-color: #C5C5D2;
      }

      &.card-all {
        background: linear-gradient(135deg, #F0E6FF 0%, #E8DEFF 100%);
        border-left-color: #C3A6FF;
      }
    }

    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      font-size: 14px;
      color: #5A5A6E;

      i {
        font-size: 20px;
        color: inherit;
        opacity: 0.8;
      }
    }

    .num {
      font-weight: 800;
      font-size: 28px;
      float: right;
      line-height: 1;

      a {
        color: #3A3A4E;
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          color: #FF8BA7;
        }
      }
    }

    .iconfont {
      font-size: 24px;
    }
  }
}
</style>
