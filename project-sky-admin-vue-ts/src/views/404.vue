<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img
          class="pic-404__parent"
          src="@/assets/404-images/404.png"
          alt="404"
        >
        <img
          class="pic-404__child left"
          src="@/assets/404-images/404-cloud.png"
          alt="404"
        >
        <img
          class="pic-404__child mid"
          src="@/assets/404-images/404-cloud.png"
          alt="404"
        >
        <img
          class="pic-404__child right"
          src="@/assets/404-images/404-cloud.png"
          alt="404"
        >
      </div>
      <div class="text-404">
        <div class="text-404__oops">
          OOPS!
        </div>
        <div class="text-404__info">
          All rights reserved
          <a
            style="color:#20a0ff"
            href="https://wallstreetcn.com"
            target="_blank"
          >wallstreetcn</a>
        </div>
        <div class="text-404__headline">
          {{ message }}
        </div>
        <div class="text-404__info">
          Please check that the URL you entered is correct, or click the button below to return to the homepage.
        </div>
        <a
          href=""
          class="text-404__return-home"
        >Back to home</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'Page404' })

const message = ref('404 Page Not Found')
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 45%;
  left: 50%;
}

.wscn-http404 {
  position: relative;
  width: 900px;
  padding: 40px;
  overflow: hidden;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(195, 166, 255, 0.15);
  border: 1px solid #FFD6E0;

  .pic-404 {
    position: relative;
    float: left;
    width: 450px;
    overflow: hidden;

    &__parent {
      width: 100%;
    }

    &__child {
      position: absolute;

      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }

      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }

      @keyframes cloudLeft {
        0% { top: 17px; left: 220px; opacity: 0; }
        20% { top: 33px; left: 188px; opacity: 1; }
        80% { top: 81px; left: 92px; opacity: 1; }
        100% { top: 97px; left: 60px; opacity: 0; }
      }

      @keyframes cloudMid {
        0% { top: 10px; left: 420px; opacity: 0; }
        20% { top: 40px; left: 360px; opacity: 1; }
        70% { top: 130px; left: 180px; opacity: 1; }
        100% { top: 160px; left: 120px; opacity: 0; }
      }

      @keyframes cloudRight {
        0% { top: 100px; left: 500px; opacity: 0; }
        20% { top: 120px; left: 460px; opacity: 1; }
        80% { top: 180px; left: 340px; opacity: 1; }
        100% { top: 200px; left: 300px; opacity: 0; }
      }
    }
  }

  .text-404 {
    position: relative;
    float: left;
    width: 350px;
    padding: 40px 0;
    overflow: hidden;

    &__oops {
      font-size: 36px;
      font-weight: 800;
      line-height: 40px;
      background: linear-gradient(135deg, #FF8BA7, #C3A6FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }

    &__headline {
      font-size: 18px;
      line-height: 24px;
      color: #5A5A6E;
      font-weight: 600;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }

    &__info {
      font-size: 13px;
      line-height: 21px;
      color: #8E8EA0;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }

    &__return-home {
      display: inline-block;
      padding: 10px 30px;
      background: linear-gradient(135deg, #FF8BA7, #C3A6FF);
      border-radius: 50px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 15px rgba(255, 139, 167, 0.3);
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 139, 167, 0.4);
      }
    }

    @keyframes slideUp {
      0% { transform: translateY(60px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  }
}
</style>
