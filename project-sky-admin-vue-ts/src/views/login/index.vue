<template>
  <div class="login">
    <div class="login-box">
      <img src="@/assets/login/login-l.png" alt="" />
      <div class="login-form">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <div class="login-form-title">
            <img
              src="@/assets/login/icon_logo.png"
              style="width: 149px; height: 38px"
              alt=""
            />
            <!-- <span class="title-label">苍穹外卖</span> -->
          </div>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              autocomplete="off"
              placeholder="账号"
            >
              <template #prefix><i class="iconfont icon-user" /></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              @keyup.enter="handleLogin"
            >
              <template #prefix><i class="iconfont icon-lock" /></template>
            </el-input>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              class="login-btn"
              size="default"
              type="primary"
              style="width: 100%"
              @click.prevent="handleLogin"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'

defineOptions({ name: 'Login' })

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const redirect = ref<string | undefined>()

const loginForm = reactive({
  username: '',
  password: '',
})

const validateUsername = (rule: any, value: string, callback: Function) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value.length < 6) {
    callback(new Error('密码必须在6位以上'))
  } else {
    callback()
  }
}

const loginRules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
}

// 登录
const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      await userStore.loginAction(loginForm as any)
        .then((res: any) => {
          if (String(res.code) === '1') {
            router.push('/')
          } else {
            // ElMessage.error(res.msg)
            loading.value = false
          }
        })
        .catch(() => {
          // ElMessage.error('用户名或密码错误！')
          loading.value = false
        })
    } else {
      return false
    }
  })
}
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(135deg, #FFE8EE 0%, #F0E6FF 50%, #E6F4FF 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 20% 30%, rgba(255, 139, 167, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(195, 166, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(126, 200, 227, 0.1) 0%, transparent 50%);
    animation: login-float 15s ease-in-out infinite;
  }
}

@keyframes login-float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, -20px); }
}

.login-box {
  width: 900px;
  min-height: 474px;
  border-radius: 24px;
  display: flex;
  box-shadow: 0 20px 60px rgba(195, 166, 255, 0.3);
  position: relative;
  z-index: 1;
  background: #fff;
  overflow: visible;

  > img {
    width: 55%;
    height: auto;
    border-radius: 24px 0 0 24px;
    display: block;
  }
}

.login-form {
  background: #ffffff;
  width: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 30px;

  .el-form {
    width: 100%;
    max-width: 280px;
  }

  .el-form-item {
    margin-bottom: 28px;
  }

  .el-input__wrapper {
    border-radius: 12px !important;
    box-shadow: 0 0 0 2px #FFD6E0 inset !important;
    padding: 8px 15px;
    background: #FFFAFC !important;

    &:hover {
      box-shadow: 0 0 0 2px #FFB5C8 inset !important;
    }

    &:focus-within {
      box-shadow: 0 0 0 2px #FF8BA7 inset, 0 0 15px rgba(255, 139, 167, 0.15) !important;
      background: #fff !important;
    }
  }

  .el-input__inner {
    font-size: 14px;
    color: #5A5A6E;

    &::placeholder {
      color: #C5C5D2;
    }
  }

  .el-input__prefix {
    color: #FFB5C8;
  }
}

.login-btn {
  border-radius: 50px !important;
  padding: 12px 20px !important;
  margin-top: 10px;
  font-weight: 600;
  font-size: 15px;
  border: none !important;
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #FF8BA7 0%, #C3A6FF 100%) !important;
  color: #fff !important;
  letter-spacing: 4px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  box-shadow: 0 4px 15px rgba(255, 139, 167, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 139, 167, 0.4);
    background: linear-gradient(135deg, #FFB5C8 0%, #D9C9FF 100%) !important;
  }

  &:active {
    transform: translateY(-1px);
  }
}

.login-form-title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
  flex-direction: column;
  gap: 8px;

  img {
    height: 40px;
    width: auto;
  }

  .title-label {
    font-weight: 600;
    font-size: 22px;
    background: linear-gradient(135deg, #FF8BA7, #C3A6FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
</style>
