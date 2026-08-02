import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, userLogout } from '@/api/employee'
import {
  getToken,
  setToken,
  removeToken,
  getStoreId,
  setStoreId,
  removeStoreId,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
} from '@/utils/cookies'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const name = ref('')
  const avatar = ref('')
  const storeId = ref<string>(getStoreId() || '')
  const introduction = ref('')
  const userInfo = ref<any>({})
  const roles = ref<string[]>([])
  const username = ref(Cookies.get('username') || '')

  async function loginAction(loginInfo: { username: string; password: string }) {
    let { username: uname, password } = loginInfo
    uname = uname.trim()
    username.value = uname
    Cookies.set('username', uname)
    const { data } = await login({ username: uname, password })
    if (String(data.code) === '1') {
      token.value = data.data.token
      setToken(data.data.token)
      userInfo.value = { ...data.data }
      Cookies.set('user_info', JSON.stringify(data.data))
      return data
    } else {
      ElMessage.error(data.msg)
      return null
    }
  }

  function resetToken() {
    removeToken()
    token.value = ''
    roles.value = []
  }

  function changeStore(data: any) {
    storeId.value = data.data
    token.value = data.authorization
    setStoreId(data.data)
    setToken(data.authorization)
  }

  async function getUserInfoAction() {
    if (token.value === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const data = JSON.parse(getUserInfo() as string)
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }
    const { roles: r, name: n, avatar: a, introduction: i, applicant, storeManagerName, storeId: sid = '' } = data
    if (!r || r.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    roles.value = r
    userInfo.value = data
    name.value = n || applicant || storeManagerName
    avatar.value = a
    introduction.value = i
  }

  async function logOut() {
    const { data } = await userLogout({})
    removeToken()
    token.value = ''
    roles.value = []
    Cookies.remove('username')
    Cookies.remove('user_info')
    removeUserInfo()
  }

  return {
    token,
    name,
    avatar,
    storeId,
    introduction,
    userInfo,
    roles,
    username,
    loginAction,
    resetToken,
    changeStore,
    getUserInfoAction,
    logOut,
  }
})
