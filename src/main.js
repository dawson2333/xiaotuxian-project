import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
//引入初始化的样式文件
import '@/styles/common.scss'
//引入懒加载并注册
import { lazyPlugin } from '@/directives'
//引入全局组件插件
import { componentPlugin } from '@/components'

const pinia = createPinia()
// 注册持久化插件
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)
app.mount('#app')




