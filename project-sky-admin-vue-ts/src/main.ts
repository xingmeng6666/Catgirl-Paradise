import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'normalize.css'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import '@/styles/home.scss'
import '@/styles/newRJWMsystem.scss'
import '@/styles/icon/iconfont.css'
import '@/styles/kawaii-theme.scss'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

import App from '@/App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '@/router'
import '@/permission'
import { checkProcessEnv } from '@/utils/common'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'default' })

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.dayjs = dayjs
app.config.globalProperties.$checkProcessEnv = checkProcessEnv
app.config.globalProperties.$echarts = echarts

app.mount('#app')
