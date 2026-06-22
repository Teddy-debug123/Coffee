import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, user } from '../api'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref((localStorage.getItem('token') || '').trim())
  const captchaToken = ref('')
  const isLoggedIn = computed(() => !!token.value && token.value !== 'undefined' && token.value !== 'null')

  const setUserInfo = (info) => { userInfo.value = info }
  const setToken = (newToken) => {
    const cleaned = (newToken || '').trim()
    if (!cleaned || cleaned === 'undefined' || cleaned === 'null') {
      token.value = ''
      localStorage.removeItem('token')
      return
    }
    token.value = cleaned
    localStorage.setItem('token', cleaned)
  }

  const login = async (username, password, captcha) => {
    const data = await auth.login({ username, password, captcha, captchaToken: captchaToken.value })
    setToken(data.token)
    setUserInfo(data.user)
    captchaToken.value = ''
    return data
  }

  const register = async (username, email, password, confirmPassword, captcha) => {
    const data = await auth.register({ username, email, password, confirmPassword, captcha, captchaToken: captchaToken.value })
    setToken(data.token)
    setUserInfo(data.user)
    captchaToken.value = ''
    return data
  }

  const forgotPassword = async (email, captcha) => { const result = await auth.forgotPassword({ email, captcha, captchaToken: captchaToken.value }); captchaToken.value = ''; return result }
  const resetPassword = async (email, password) => await auth.resetPassword({ email, password })
  const getCaptcha = async () => { const data = await auth.getCaptcha(); captchaToken.value = data.captchaToken; return data.captcha }
  const loadUserInfo = async () => { if (!isLoggedIn.value) return; try { const data = await user.getInfo(); setUserInfo(data); return data } catch (error) { logout(); throw error } }
  const logout = () => { userInfo.value = null; token.value = ''; captchaToken.value = ''; localStorage.removeItem('token') }

  return { userInfo, token, captchaToken, isLoggedIn, setUserInfo, setToken, login, register, forgotPassword, resetPassword, getCaptcha, loadUserInfo, logout }
})
