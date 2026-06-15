/**
 * 应用入口文件
 * 创建 Vue 应用实例并配置所需的插件
 */

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/**
 * 创建 Vue 应用实例
 */
const app = createApp(App)

/**
 * 注册插件
 * - router: Vue Router 路由管理
 * - createPinia(): Pinia 状态管理
 * - ElementPlus: Element Plus UI 组件库
 */
app.use(router)
app.use(createPinia())
app.use(ElementPlus)

/**
 * 将应用挂载到 DOM 元素
 */
app.mount('#app')