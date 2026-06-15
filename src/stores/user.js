import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, user } from '../api'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const captchaToken = ref('')

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const login = async (username, password, captcha) => {
    try {
      const data = await auth.login({ username, password, captcha, captchaToken: captchaToken.value })
      setToken(data.token)
      setUserInfo(data.user)
      captchaToken.value = ''
      return data
    } catch (error) {
      throw error
    }
  }

  const register = async (username, email, password, confirmPassword, captcha) => {
    try {
      const data = await auth.register({ username, email, password, confirmPassword, captcha, captchaToken: captchaToken.value })
      setToken(data.token)
      setUserInfo(data.user)
      captchaToken.value = ''
      return data
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email, captcha) => {
    try {
      const result = await auth.forgotPassword({ email, captcha, captchaToken: captchaToken.value })
      captchaToken.value = ''
      return result
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email, password) => {
    try {
      return await auth.resetPassword({ email, password })
    } catch (error) {
      throw error
    }
  }

  const getCaptcha = async () => {
    try {
      const data = await auth.getCaptcha()
      captchaToken.value = data.captchaToken
      return data.captcha
    } catch (error) {
      throw error
    }
  }

  const loadUserInfo = async () => {
    if (!token.value) return
    try {
      const data = await user.getInfo()
      setUserInfo(data)
      return data
    } catch (error) {
      console.error('Failed to load user info:', error)
      logout()
      throw error
    }
  }

  const logout = () => {
    userInfo.value = null
    token.value = ''
    captchaToken.value = ''
    localStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    captchaToken,
    setUserInfo,
    setToken,
    login,
    register,
    forgotPassword,
    resetPassword,
    getCaptcha,
    loadUserInfo,
    logout
  }
})
