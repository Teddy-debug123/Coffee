/**
 * Axios 请求工具封装
 * 提供统一的请求拦截器和响应拦截器
 */

import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 创建 axios 实例
 * @type {axios.AxiosInstance}
 */
const service = axios.create({
  // 基础接口地址，从环境变量获取
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/api',
  // 请求超时时间
  timeout: 10000,
  // 默认请求头
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * 请求拦截器
 * 在发送请求之前做一些处理
 */
service.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    if (token) {
      // 设置 Authorization 请求头
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 在收到响应后做一些处理
 */
service.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 假设后端返回的格式是 { code, message, data }
    // code 为 200 表示成功
    if (res.code !== 200) {
      // 显示错误消息
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      
      // token 过期或未授权，跳转到登录页
      if (res.code === 401) {
        ElMessageBox.confirm(
          '登录状态已过期，请重新登录',
          '提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          // 清除 token
          localStorage.removeItem('token')
          // 跳转到登录页
          window.location.href = '/login'
        })
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      // 成功时返回数据
      return res.data
    }
  },
  (error) => {
    // 处理 HTTP 错误
    ElMessage({
      message: error.message || '网络错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service