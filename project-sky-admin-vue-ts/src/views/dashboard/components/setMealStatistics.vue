<template>
  <div class="container">
    <h2 class="homeTitle">
      <span class="title-icon">🍱</span>
      套餐总览
      <span class="detail-link"><router-link to="setmeal">套餐管理 →</router-link></span>
    </h2>
    <div class="orderviewBox">
      <ul>
        <li class="card-open">
          <span class="status"><i class="iconfont icon-open"></i>已启售</span>
          <span class="num">{{ setMealData.sold }}</span>
        </li>
        <li class="card-stop">
          <span class="status"><i class="iconfont icon-stop"></i>已停售</span>
          <span class="num">{{ setMealData.discontinued }}</span>
        </li>
        <li class="add">
          <router-link to="setmeal/add">
            <i></i>
            <p>新增套餐</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SetMeal',
})

const props = defineProps<{
  setMealData: any
}>()
</script>

<style lang="scss" scoped>
.homeTitle {
  font-weight: 700;
  font-size: 18px;
  color: #5A5A6E;
  padding: 5px 0 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon { font-size: 22px; }

  .detail-link {
    margin-left: auto;
    a {
      color: #FF8BA7;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      &:hover { color: #E86B8A; }
    }
  }
}

.orderviewBox {
  ul {
    display: flex;
    text-align: left;
    margin-left: -14px;

    li {
      flex: 1;
      border-radius: 14px;
      margin-left: 14px;
      padding: 18px 16px;
      font-size: 14px;
      line-height: 36px;
      color: #5A5A6E;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-left: 4px solid transparent;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
      }

      &.card-open {
        background: linear-gradient(135deg, #E6F4FF 0%, #D6EDFF 100%);
        border-left-color: #7EC8E3;
      }

      &.card-stop {
        background: linear-gradient(135deg, #F5F5FA 0%, #EEEEF5 100%);
        border-left-color: #C5C5D2;
      }

      &.add {
        width: 100px;
        flex: none;
        background: linear-gradient(135deg, #C3A6FF 0%, #FF8BA7 100%);
        border-radius: 14px;
        text-align: center;
        color: #fff;
        padding: 18px 16px 12px;
        border-left: none;

        a {
          text-decoration: none;
          color: #fff;
        }

        p {
          line-height: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        i {
          display: block;
          width: 28px;
          height: 28px;
          margin: 0 auto;
          background: url(@/assets/icons/btn_add@2x.png) no-repeat;
          background-size: contain;
          margin-bottom: 8px;
          filter: brightness(0) invert(1);
        }

        &:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 8px 25px rgba(195, 166, 255, 0.3);
        }
      }
    }

    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;

      i {
        font-size: 20px;
        opacity: 0.8;
      }
    }

    .num {
      font-weight: 800;
      font-size: 28px;
      float: right;
      color: #3A3A4E;
    }
  }
}
</style>
