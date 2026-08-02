<template>
  <div class="navbar">
    <div class="statusBox">
      <hamburger id="hamburger-container"
                 :is-active="appStore.sidebar.opened"
                 class="hamburger-container"
                 @toggleClick="toggleSideBar" />
      <span v-if="status===1"
            class="businessBtn">营业中</span>
      <span v-else
            class="businessBtn closing">打烊中</span>
    </div>

    <div :key="restKey"
         class="right-menu">
      <div class="rightStatus">
        <audio ref="audioVo"
               hidden>
          <source src="./../../../assets/preview.mp3" type="audio/mp3" />
        </audio>
        <audio ref="audioVo2"
               hidden>
          <source src="./../../../assets/reminder.mp3" type="audio/mp3" />
        </audio>
        <span class="navicon operatingState" @click="handleStatus"><i />营业状态设置</span>
      </div>
      <div class="avatar-wrapper">
        <div :class="shopShow?'userInfo':''"
             @mouseenter="toggleShow"
             @mouseleave="mouseLeaves">
          <el-button type="primary"
                     :class="shopShow?'active':''">
            {{ name }}<i class="el-icon-arrow-down" />
          </el-button>
          <div v-if="shopShow"
               class="userList">
            <p class="amendPwdIcon"
               @click="handlePwd">
              修改密码<i />
            </p>
            <p class="outLogin"
               @click="logout">
              退出登录<i />
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 营业状态弹层 -->
    <el-dialog title="营业状态设置"
               v-model="dialogVisible"
               width="35%"
               :show-close="false"
               append-to-body>
      <el-radio-group v-model="setStatusVal">
        <el-radio :value="1">
          营业中
          <span>当前餐厅处于营业状态，自动接收任何订单，可点击打烊进入店铺打烊状态。</span>
        </el-radio>
        <el-radio :value="0">
          打烊中
          <span>当前餐厅处于打烊状态，仅接受营业时间内的预定订单，可点击营业中手动恢复营业状态。</span>
        </el-radio>
      </el-radio-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleSave">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- end -->
    <!-- 修改密码 -->
    <Password :dialog-form-visible="dialogFormVisible"
              @handleClose="handlePwdClose" />
    <!-- end -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import Hamburger from '@/components/Hamburger/index.vue'
import { getStatus, setStatus } from '@/api/users'
import Cookies from 'js-cookie'
import { ElMessage, ElNotification } from 'element-plus'
// 修改密码弹层
import Password from '../components/password.vue'

defineOptions({ name: 'Navbar' })

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const audioVo = ref<HTMLAudioElement | null>(null)
const audioVo2 = ref<HTMLAudioElement | null>(null)
const restKey = ref(0)
const websocket = ref<WebSocket | null>(null)
const shopShow = ref(false)
const dialogVisible = ref(false)
const status = ref(1)
const setStatusVal = ref(1)
const dialogFormVisible = ref(false)

const name = computed(() => {
  return (userStore.userInfo as any).name
    || userStore.username
    || ''
})

function getStatusVal() {
  return userStore.storeId || ((userStore.userInfo as any).stores?.[0]?.storeId ?? '')
}

onMounted(() => {
  document.addEventListener('click', handleClose)
  fetchStatus()
})

onMounted(() => {
  initWebSocket()
})

onUnmounted(() => {
  if (websocket.value) {
    websocket.value.close()
  }
})

// 添加新订单提示弹窗
function initWebSocket() {
  const clientId = Math.random().toString(36).substring(2)
  const socketUrl = import.meta.env.VITE_APP_SOCKET_URL + clientId
  console.log(socketUrl, 'socketUrl')
  if (typeof WebSocket === 'undefined') {
    ElNotification({
      title: '提示',
      message: '当前浏览器无法接收实时报警信息，请使用谷歌浏览器！',
      type: 'warning',
      duration: 0,
    })
  } else {
    websocket.value = new WebSocket(socketUrl)
    // 监听socket打开
    websocket.value.onopen = function () {
      console.log('浏览器WebSocket已打开')
    }
    // 监听socket消息接收
    websocket.value.onmessage = function (msg: MessageEvent) {
      // 转换为json对象
      if (audioVo.value) audioVo.value.currentTime = 0
      if (audioVo2.value) audioVo2.value.currentTime = 0

      console.log(msg, JSON.parse(msg.data), 'msg')
      const jsonMsg = JSON.parse(msg.data)
      if (jsonMsg.type === 1) {
        audioVo.value?.play()
      } else if (jsonMsg.type === 2) {
        audioVo2.value?.play()
      }
      ElNotification({
        title: jsonMsg.type === 1 ? '待接单' : '催单',
        duration: 0,
        dangerouslyUseHTMLString: true,
        onClick: () => {
          router
            .push(`/order?orderId=${jsonMsg.orderId}`)
            .catch((err: any) => {
              console.log(err)
            })
          setTimeout(() => {
            location.reload()
          }, 100)
        },
        // 这里也可以把返回信息加入到message中显示
        message: `${
          jsonMsg.type === 1
            ? `<span>您有1个<span style=color:#419EFF>订单待处理</span>,${jsonMsg.content},请及时接单</span>`
            : `${jsonMsg.content}<span style='color:#419EFF;cursor: pointer'>去处理</span>`
        }`,
      })
    }
    // 监听socket错误
    websocket.value.onerror = function () {
      ElNotification({
        title: '错误',
        message: '服务器错误，无法接收实时报警信息',
        type: 'error',
        duration: 0,
      })
    }
    // 监听socket关闭
    websocket.value.onclose = function () {
      console.log('WebSocket已关闭')
    }
  }
}

function toggleSideBar() {
  appStore.toggleSideBar(false)
}

// 退出
async function logout() {
  await userStore.logOut()
  router.replace({ path: '/login' })
}

// 营业状态
async function fetchStatus() {
  const { data } = await getStatus()
  status.value = data.data
  setStatusVal.value = status.value
}

// 下拉菜单显示
function toggleShow() {
  shopShow.value = true
}

// 下拉菜单隐藏
function mouseLeaves() {
  shopShow.value = false
}

// 触发空白处下来菜单关闭
function handleClose() {
  // clearTimeout(this.leave)
  // this.shopShow = false
}

// 设置营业状态
function handleStatus() {
  dialogVisible.value = true
}

// 营业状态设置
async function handleSave() {
  const { data } = await setStatus(setStatusVal.value)
  if (data.code === 1) {
    dialogVisible.value = false
    fetchStatus()
  }
}

// 修改密码
function handlePwd() {
  dialogFormVisible.value = true
}

// 关闭密码编辑弹层
function handlePwdClose() {
  dialogFormVisible.value = false
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  // overflow: hidden;
  position: relative;
  z-index: 200;
  background: linear-gradient(90deg, #FFE8EE 0%, #F5F0FF 100%);

  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .statusBox {
    float: left;
    height: 100%;
    align-items: center;
    display: flex;
  }
  .hamburger-container {
    // line-height: 54px;

    padding: 0 12px 0 20px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    float: right;

    margin-right: 20px;

    color: #333333;
    font-size: 14px;

    span {
      padding: 0 10px;
      width: 130px;
      display: inline-block;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.52);
      }
    }
    .amendPwdIcon {
      i {
        width: 18px;
        height: 18px;
        background: url(./../../../assets/icons/btn_gaimi@2x.png) no-repeat;
        background-size: contain;
        margin-top: 8px;
      }
    }
    .outLogin {
      i {
        width: 18px;
        height: 18px;
        background: url(./../../../assets/icons/btn_close@2x.png) no-repeat 100%
          100%;
        background-size: contain;
        margin-top: 8px;
      }
    }
    .outLogin {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    // .avatar-container {
    // margin-right: 30px;

    // }
  }
  .rightStatus {
    height: 100%;
    line-height: 60px;
    display: flex;
    align-items: center;
    float: left;
  }
  .avatar-wrapper {
    margin-top: 14px;
    margin-left: 18px;
    position: relative;
    // vertical-align: middle;
    float: right;
    width: 120px;
    text-align: left;
    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }

    .el-button--primary {
      background: rgba(255, 255, 255, 0.7);
      border-radius: 20px;
      padding: 0 14px;
      position: relative;
      width: 120px;
      text-align: left;
      border: 2px solid var(--kawaii-border, #FFD6E0);
      height: 34px;
      line-height: 30px;
      color: var(--kawaii-text, #5A5A6E);
      font-size: 13px;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.9);
        border-color: var(--kawaii-primary, #FF8BA7);
      }

      &.active {
        background: rgba(255, 255, 255, 0.9);
        .el-icon-arrow-down {
          transform: rotate(-180deg);
        }
      }
    }
  }
  .businessBtn {
    height: 24px;
    line-height: 22px;
    background: linear-gradient(135deg, #98E4C6, #7EC8E3);
    border: none;
    border-radius: 20px;
    display: inline-block;
    padding: 0 14px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
  }
  .closing {
    background: linear-gradient(135deg, #C5C5D2, #8E8EA0);
  }
  .navicon {
    i {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: sub;
      margin: 0 4px 0 0;
    }
  }
  .operatingState {
    i {
      background: url('./../../../assets/icons/time.png') no-repeat;
      background-size: contain;
    }
  }
  .mesCenter {
    i {
      background: url('./../../../assets/icons/msg.png') no-repeat;
      background-size: contain;
    }
  }
  // .el-badge__content.is-fixed {
  //   top: 20px;
  //   right: 6px;
  // }
}
</style>
<style lang="scss">
.el-notification {
  // background: rgba(255, 255, 255, 0.71);
  width: 419px !important;
  .el-notification__title {
    margin-bottom: 14px;
    color: #333;
    .el-notification__content {
      color: #333;
    }
  }
}
.navbar {
  .el-dialog {
    min-width: auto !important;
  }
  .el-dialog__header {
    height: 61px;
    line-height: 60px;
    background: linear-gradient(135deg, #FFF0F3, #F5F0FF);
    padding: 0 30px;
    font-size: 16px;
    color: #5A5A6E;
    border: 0 none;
  }
  .el-dialog__body {
    padding: 30px 30px 40px;
    .el-radio,
    .el-radio__input {
      white-space: normal;
    }
    .el-radio__label {
      padding-left: 10px;
      color: #5A5A6E;
      font-weight: 600;
      font-size: 15px;
      line-height: 1.6;
      span {
        display: block;
        line-height: 1.8;
        padding-top: 12px;
        color: #8E8EA0;
        font-weight: normal;
        font-size: 13px;
      }
    }
    .el-radio__input.is-checked .el-radio__inner {
      background: #FF8BA7;
      border-color: #FF8BA7;
      &::after {
        background: #fff;
      }
    }
    .el-radio-group {
      & > .is-checked {
        border: 1px solid #FF8BA7;
      }
    }
    .el-radio {
      width: 100%;
      background: #FFFAFC;
      border: 2px solid #FFD6E0;
      border-radius: 12px;
      padding: 18px 22px;
      margin-top: 20px;
      transition: all 0.3s ease;
      line-height: 1.6;
      height: auto;

      &:hover {
        border-color: #FFB5C8;
      }
    }
    .el-radio__input.is-checked + .el-radio__label {
      span {
      }
    }
  }
  .el-badge__content.is-fixed {
    top: 24px;
    right: 2px;
    width: 18px;
    height: 18px;
    font-size: 10px;
    line-height: 16px;
    font-size: 10px;
    border-radius: 50%;
    padding: 0;
  }
  .badgeW {
    .el-badge__content.is-fixed {
      width: 30px;
      border-radius: 20px;
    }
  }
}
.el-icon-arrow-down {
  background: url('./../../../assets/icons/up.png') no-repeat 50% 50%;
  background-size: contain;
  width: 8px;
  height: 8px;
  transform: rotate(0eg);
  margin-left: 16px;
  position: absolute;
  right: 16px;
  top: 12px;
  &:before {
    content: '';
  }
}

.userInfo {
  background: #fff;
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 150;
  box-shadow: 0 8px 30px rgba(255, 139, 167, 0.15);
  width: 100%;
  border-radius: 16px;
  line-height: 32px;
  padding: 0 0 5px;
  height: 105px;
  border: 1px solid #FFD6E0;
  // .active {
  //   top: 0;
  //   left: 0;
  // }
  .userList {
    width: 95%;
    // // margin-top: -5px;
    // position: absolute;
    // top: 35px;
    padding-left: 5px;
  }
  p {
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    padding: 0 5px 0 7px;
    i {
      margin-left: 10px;

      vertical-align: middle;
      margin-top: 4px;
      float: right;
    }
    &:hover {
      background: #FFF0F5;
    }
  }
}
.msgTip {
  color: #419eff;
  padding: 0 5px;
}
// .el-dropdown{
//   .el-button--primary{
//     height: 32px;
//     background: rgba(255,255,255,0.52);
//     border-radius: 4px;
//     padding-top: 0px;
//     padding-bottom: 0px;
//   }
//   margin-top: 2px;
// }
// .el-popper{
//   top: 45px !important;
//   padding-top: 50px !important;
//   border-radius: 0 0 4px 4px;
// }
// .el-popper[x-placement^=bottom] .popper__arrow::after,.popper__arrow{
//   display: none !important;
// }
</style>
