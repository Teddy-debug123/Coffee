<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElLoading } from 'element-plus'
import { useUserStore } from '../stores/user'
import { User, Lock, View, Hide, Refresh } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const showPassword = ref(false)
const isLoading = ref(false)

const form = ref({
  username: '',
  password: '',
  captcha: ''
})

const captchaImage = ref('')

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码需包含字母和数字', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
}

const generateCaptcha = async () => {
  try {
    captchaImage.value = await userStore.getCaptcha()
  } catch (error) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    captchaImage.value = result
    ElMessage.warning('验证码获取失败，使用本地生成')
  }
}

const handleLogin = async () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) return
    isLoading.value = true
    try {
      await userStore.login(form.value.username, form.value.password, form.value.captcha)
      ElMessage.success('登录成功')
      const redirect = router.currentRoute.value.query.redirect || '/home'
      router.push(redirect)
    } catch (error) {
      ElMessage.error(error.response?.data?.message || error.message || '登录失败，请稍后重试')
      generateCaptcha()
      form.value.captcha = ''
    } finally {
      isLoading.value = false
    }
  })
}

const goToRegister = () => {
  router.push('/register')
}

const goToForgotPassword = () => {
  router.push('/forgot-password')
}

const goToHome = () => {
  router.push('/home')
}

onMounted(() => {
  generateCaptcha()
})
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="brand-section">
          <span class="brand-text">COFFEE</span>
          <span class="brand-accent">ONLINE</span>
          <p class="brand-desc">品味生活，从一杯好咖啡开始</p>
        </div>
        <div class="coffee-illustration">
          <div class="coffee-cup"></div>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-box">
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-subtitle">登录您的账户</p>
          
          <ElForm :model="form" :rules="rules" ref="formRef" class="login-form">
            <ElFormItem prop="username">
              <ElInput 
                v-model="form.username" 
                placeholder="用户名" 
                prefix-icon="User"
                class="form-input"
              />
            </ElFormItem>
            
            <ElFormItem prop="password">
              <ElInput 
                v-model="form.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="密码" 
                :prefix-icon="Lock"
                class="form-input"
                :suffix-icon="showPassword ? Hide : View"
                @click-suffix="showPassword = !showPassword"
              />
            </ElFormItem>
            
            <ElFormItem prop="captcha">
              <div class="captcha-row">
                <ElInput 
                  v-model="form.captcha" 
                  placeholder="验证码" 
                  class="captcha-input"
                />
                <div class="captcha-image" @click="generateCaptcha">
                  <span>{{ captchaImage }}</span>
                </div>
                <button class="captcha-refresh" @click="generateCaptcha">
                  <Refresh :size="18" />
                </button>
              </div>
            </ElFormItem>
            
            <ElFormItem>
              <ElButton 
                type="primary" 
                class="login-btn" 
                @click="handleLogin"
                :loading="isLoading"
              >
                登录
              </ElButton>
            </ElFormItem>
            
            <div class="login-links">
              <span @click="goToForgotPassword" class="link-text">忘记密码？</span>
              <span class="link-divider">|</span>
              <span @click="goToRegister" class="link-text">立即注册</span>
            </div>
            
            <div class="guest-entry" @click="goToHome">
              继续以访客身份浏览
            </div>
          </ElForm>
        </div>
      </div>
    </div>
    
    <footer class="login-footer">
      <span>© 2024 Coffee Online. All rights reserved.</span>
    </footer>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FAFAFA 0%, #F5EEE6 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.login-content {
  display: flex;
  min-height: 100vh;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  background: linear-gradient(180deg, #2D1F14 0%, #3D2914 100%);
  color: #fff;
}

.brand-section {
  margin-bottom: 4rem;
}

.brand-text {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.brand-accent {
  font-size: 1.5rem;
  font-weight: 500;
  color: #C4A77D;
  letter-spacing: 0.2em;
  margin-left: 0.5rem;
}

.brand-desc {
  font-size: 1rem;
  color: #D4C4B0;
  font-weight: 300;
  margin-top: 1rem;
  letter-spacing: 0.05em;
}

.coffee-illustration {
  display: flex;
  justify-content: center;
}

.coffee-cup {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 30% 30%, #D4A574 0%, #8B6914 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.coffee-cup::before {
  content: '';
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: #D4C4B0;
  border-radius: 50%;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background: #fff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(45, 31, 20, 0.1);
}

.login-title {
  font-size: 1.75rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0 0 0.5rem 0;
}

.login-subtitle {
  font-size: 0.95rem;
  color: #8B7355;
  margin: 0 0 2rem 0;
}

.login-form {
  width: 100%;
}

.form-input {
  height: 48px;
  border-radius: 8px;
  border: 1px solid #E8E4DD;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #8B7355;
  box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.1);
}

.captcha-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.captcha-input {
  flex: 1;
  height: 48px;
  border-radius: 8px;
  border: 1px solid #E8E4DD;
}

.captcha-image {
  min-width: 100px;
  height: 48px;
  background: linear-gradient(135deg, #F5F3EF 0%, #E8E4DD 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #5C4033;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.captcha-image:hover {
  background: #E8E4DD;
}

.captcha-refresh {
  width: 48px;
  height: 48px;
  background: #F5F3EF;
  border: none;
  border-radius: 8px;
  color: #8B7355;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-refresh:hover {
  background: #E8E4DD;
  color: #5C4033;
}

.login-btn {
  width: 100%;
  height: 50px;
  background: #2D1F14;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #3D2914;
  transform: translateY(-2px);
}

.login-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.link-text {
  font-size: 0.875rem;
  color: #8B7355;
  cursor: pointer;
  transition: color 0.3s ease;
}

.link-text:hover {
  color: #5C4033;
  text-decoration: underline;
}

.link-divider {
  color: #E8E4DD;
}

.guest-entry {
  text-align: center;
  font-size: 0.875rem;
  color: #8B7355;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #F5F3EF;
  cursor: pointer;
  transition: color 0.3s ease;
}

.guest-entry:hover {
  color: #5C4033;
}

.login-footer {
  text-align: center;
  padding: 1.5rem;
  color: #8B7355;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

@media (max-width: 960px) {
  .login-content {
    flex-direction: column;
  }
  
  .login-left {
    padding: 2rem;
    min-height: 200px;
  }
  
  .login-right {
    padding: 2rem;
  }
  
  .login-box {
    padding: 2rem;
  }
  
  .brand-text {
    font-size: 1.75rem;
  }
  
  .brand-accent {
    font-size: 1.125rem;
  }
}
</style>
