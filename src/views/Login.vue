<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { Hide, Refresh, View } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const showPassword = ref(false)
const isLoading = ref(false)
const captchaCode = ref('')
const form = ref({ username: '', password: '', captcha: '' })
const errors = ref({ username: '', password: '', captcha: '' })
const canSubmit = computed(() => form.value.username && form.value.password && form.value.captcha)
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
const generateCaptcha = async () => {
  try { 
    captchaCode.value = await userStore.getCaptcha() 
  } catch { 
    captchaCode.value = 'A7K2'; 
    ElMessage.warning('验证码获取失败，使用本地验证码（可能无法通过验证）') 
  }
}
const validateForm = () => {
  errors.value = { username: '', password: '', captcha: '' }
  if (!form.value.username.trim()) errors.value.username = '请输入用户名'
  if (form.value.username && (form.value.username.length < 3 || form.value.username.length > 20)) errors.value.username = '用户名长度应为 3-20 位'
  if (form.value.password && form.value.password.length < 6) errors.value.password = '密码长度至少 6 位'
  if (!form.value.password.trim()) errors.value.password = '请输入密码'
  if (!form.value.captcha.trim()) errors.value.captcha = '请输入验证码'
  if (form.value.captcha && captchaCode.value && form.value.captcha.toLowerCase() !== captchaCode.value.toLowerCase()) errors.value.captcha = '验证码错误'
  return !errors.value.username && !errors.value.password && !errors.value.captcha
}
const handleLogin = async () => {
  if (!validateForm()) return
  isLoading.value = true
  try {
    await userStore.login(form.value.username, form.value.password, form.value.captcha)
    ElMessage.success('登录成功')
    router.push(router.currentRoute.value.query.redirect || '/home')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.message || '登录失败，请稍后重试')
    form.value.captcha = ''
    await generateCaptcha()
  } finally { isLoading.value = false }
}
const goToRegister = () => router.push('/register')
const goToForgotPassword = () => router.push('/forgot-password')
const goToHome = () => router.push('/home')
onMounted(generateCaptcha)
</script>

<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="login-visual card">
        <p class="eyebrow">ONLINE COFFEE</p>
        <h1 class="brand-title">在线咖啡</h1>
        <p class="brand-desc">在安静的深棕与浅米之间，回到一杯好咖啡最纯粹的开始。</p>
        <div class="bean-figure"></div>
      </section>

      <section class="login-panel card">
        <h2 class="panel-title">欢迎回来</h2>
        <p class="panel-subtitle">登录您的账户</p>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="field">
            <label>用户名</label>
            <input v-model="form.username" type="text" placeholder="请输入用户名" />
            <p v-if="errors.username" class="field-error">{{ errors.username }}</p>
          </div>

          <div class="field">
            <label>密码</label>
            <div class="password-row">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" />
              <button type="button" class="icon-btn" @click="showPassword = !showPassword"> <component :is="showPassword ? Hide : View" :size="18" /> </button>
            </div>
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <div class="field">
            <label>验证码</label>
            <div class="captcha-row">
              <input v-model="form.captcha" type="text" placeholder="输入验证码" />
              <button type="button" class="captcha-box" @click="generateCaptcha">{{ captchaCode }}</button>
              <button type="button" class="icon-btn refresh-btn" @click="generateCaptcha"><Refresh :size="18" /></button>
            </div>
            <p v-if="errors.captcha" class="field-error">{{ errors.captcha }}</p>
          </div>

          <button class="submit-btn btn" type="submit" :disabled="!canSubmit || isLoading">{{ isLoading ? '登录中...' : '登录' }}</button>
        </form>

        <div class="links">
          <button class="text-link" @click="goToForgotPassword">忘记密码</button>
          <span class="divider">|</span>
          <button class="text-link" @click="goToRegister">立即注册</button>
        </div>

        <button class="guest-btn" @click="goToHome">继续以访客身份浏览</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.login-page{min-height:100vh;background:var(--color-bg);padding:32px}
.login-shell{min-height:calc(100vh - 64px);display:grid;grid-template-columns:4fr 6fr;gap:24px;align-items:stretch}
.login-visual{background:linear-gradient(180deg,var(--color-primary),#2a1d14);color:#fff;padding:40px;display:flex;flex-direction:column;justify-content:center;gap:14px}
.eyebrow{letter-spacing:.24em;color:rgba(255,255,255,.7);font-size:var(--fs-small)}
.brand-title{font-size:var(--fs-h1);font-family:var(--font-display);letter-spacing:.08em}
.brand-desc{max-width:420px;line-height:1.8;color:rgba(255,255,255,.75)}
.bean-figure{width:220px;height:220px;border-radius:50%;background:radial-gradient(circle at 30% 30%, rgba(200,184,168,.95), rgba(58,40,27,.8));margin-top:24px;box-shadow:var(--shadow-soft)}
.login-panel{padding:40px;display:flex;flex-direction:column;justify-content:center}
.panel-title{font-size:var(--fs-h2);color:var(--color-primary)}
.panel-subtitle{margin-top:8px;color:var(--color-muted)}
.login-form{margin-top:28px;display:flex;flex-direction:column;gap:18px}
.field{display:flex;flex-direction:column;gap:8px}
.field label{font-size:var(--fs-small);color:var(--color-muted)}
.field input{height:48px;padding:0 14px;border-radius:var(--radius-sm);border:1px solid rgba(58,40,27,.14);background:#fff}
.password-row,.captcha-row{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center}
.password-row{grid-template-columns:1fr auto}
.icon-btn,.captcha-box{width:48px;height:48px;border-radius:var(--radius-sm);background:rgba(200,184,168,.16);display:grid;place-items:center;color:var(--color-primary)}
.captcha-box{width:96px;letter-spacing:.2em;font-weight:600}
.refresh-btn{background:rgba(200,184,168,.1)}
.field-error{font-size:var(--fs-small);color:#c65d5d}
.submit-btn{width:100%;height:50px;background:var(--color-primary);color:#fff;margin-top:6px}
.submit-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
.links{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px}
.text-link,.guest-btn{color:var(--color-muted)}
.guest-btn{margin-top:18px;padding-top:18px;border-top:1px dashed var(--color-line);width:100%}
@media (max-width: 960px){.login-page{padding:16px}.login-shell{grid-template-columns:1fr}.login-visual{min-height:240px}}
</style>
