<template>
  <div class="container">
    <h2 class="homeTitle">
      <span class="title-icon">📊</span>
      今日数据<i>{{ days[1] }}</i>
      <span class="detail-link"><router-link to="statistics">详细数据 →</router-link></span>
    </h2>
    <div class="overviewBox">
      <ul>
        <li class="card-turnover">
          <div class="card-icon">💰</div>
          <p class="tit">营业额</p>
          <p class="num">¥ {{ overviewData.turnover }}</p>
        </li>
        <li class="card-orders">
          <div class="card-icon">📋</div>
          <p class="tit">有效订单</p>
          <p class="num">{{ overviewData.validOrderCount }}</p>
        </li>
        <li class="card-rate">
          <div class="card-icon">✅</div>
          <p class="tit">订单完成率</p>
          <p class="num">
            {{ (overviewData.orderCompletionRate * 100).toFixed(0) }}%
          </p>
        </li>
        <li class="card-price">
          <div class="card-icon">🏷️</div>
          <p class="tit">平均客单价</p>
          <p class="num">¥ {{ overviewData.unitPrice }}</p>
        </li>
        <li class="card-users">
          <div class="card-icon">👥</div>
          <p class="tit">新增用户</p>
          <p class="num">{{ overviewData.newUsers }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getday } from '@/utils/formValidate'

defineOptions({
  name: 'Overview',
})

const props = defineProps<{
  overviewData: any
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

.overviewBox {
  ul {
    display: flex;
    text-align: left;
    margin-left: -16px;
    gap: 0;

    li {
      flex: 1;
      border-radius: 16px;
      margin-left: 16px;
      padding: 20px 22px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 1px solid transparent;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        opacity: 0.1;
        transform: translate(20px, -20px);
      }

      &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
      }
    }

    .card-turnover {
      background: linear-gradient(135deg, #FFF0F5 0%, #FFE8EE 100%);
      border-color: #FFD6E0;

      &::before { background: #FF8BA7; }
    }

    .card-orders {
      background: linear-gradient(135deg, #F0E6FF 0%, #E8DEFF 100%);
      border-color: #D9C9FF;

      &::before { background: #C3A6FF; }
    }

    .card-rate {
      background: linear-gradient(135deg, #E6F9F0 0%, #D4F5E6 100%);
      border-color: #B8ECD5;

      &::before { background: #98E4C6; }
    }

    .card-price {
      background: linear-gradient(135deg, #FFF8E6 0%, #FFF0CC 100%);
      border-color: #FFE6A0;

      &::before { background: #FFD93D; }
    }

    .card-users {
      background: linear-gradient(135deg, #E6F4FF 0%, #D6EDFF 100%);
      border-color: #B8DAFF;

      &::before { background: #7EC8E3; }
    }

    .card-icon {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .tit {
      font-size: 13px;
      color: #8E8EA0;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .num {
      font-weight: 800;
      font-size: 26px;
      line-height: 1.2;
      color: #3A3A4E;
    }
  }
}
</style>
