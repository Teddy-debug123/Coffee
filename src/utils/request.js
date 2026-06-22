/**
 * Axios 请求工具封装
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

service.interceptors.request.use((config) => {
  const token = (localStorage.getItem('token') || '').trim()
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

service.interceptors.response.use((response) => {
  const res = response.data
  if (res.code !== 200) {
    if (res.code === 401) {
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
        const path = window.location.pathname
        if (!path.startsWith('/login')) {
          window.location.href = '/login?redirect=' + encodeURIComponent(path)
        }
      }
      return Promise.reject(new Error('未登录'))
    }
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  }
  return res.data
}, (error) => {
  if (error?.response?.status === 401) {
    const token = localStorage.getItem('token')
    if (token) {
      localStorage.removeItem('token')
      const path = window.location.pathname
      if (!path.startsWith('/login')) {
        window.location.href = '/login?redirect=' + encodeURIComponent(path)
      }
    }
    return Promise.reject(new Error('未登录'))
  }
  if (error?.response) {
    const msg = error.response.data?.message || error.message || '请求失败'
    ElMessage.error(msg)
  }
  return Promise.reject(error)
})

export default service
