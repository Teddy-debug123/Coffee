<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { Message, Refresh } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const isLoading = ref(false)

const form = ref({
  email: '',
  captcha: ''
})

const captchaImage = ref('')

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
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

const handleReset = async () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) return
    isLoading.value = true
    try {
      await userStore.forgotPassword(form.value.email, form.value.captcha)
      ElMessage.success('重置链接已发送到您的邮箱，请查收')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      ElMessage.error(error.response?.data?.message || error.message || '发送失败，请稍后重试')
      generateCaptcha()
      form.value.captcha = ''
    } finally {
      isLoading.value = false
    }
  })
}

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/home')
}

onMounted(() => {
  generateCaptcha()
})
</script>

<template>
  <div class="forgot-container">
    <div class="forgot-content">
      <div class="forgot-left">
        <div class="brand-section">
          <span class="brand-text">COFFEE</span>
          <span class="brand-accent">ONLINE</span>
          <p class="brand-desc">找回您的账户密码</p>
        </div>
        <div class="coffee-illustration">
          <div class="lock-icon"></div>
        </div>
      </div>
      
      <div class="forgot-right">
        <div class="forgot-box">
          <h2 class="forgot-title">忘记密码</h2>
          <p class="forgot-subtitle">请输入您注册时使用的邮箱，我们将发送重置链接</p>
          
          <ElForm :model="form" :rules="rules" ref="formRef" class="forgot-form">
            <ElFormItem prop="email">
              <ElInput 
                v-model="form.email" 
                type="email" 
                placeholder="邮箱地址" 
                :prefix-icon="Message"
                class="form-input"
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
                class="forgot-btn" 
                @click="handleReset"
                :loading="isLoading"
              >
                发送重置链接
              </ElButton>
            </ElFormItem>
            
            <div class="forgot-links">
              <span @click="goToLogin" class="link-text">返回登录</span>
            </div>
            
            <div class="guest-entry" @click="goToHome">
              返回首页
            </div>
          </ElForm>
        </div>
      </div>
    </div>
    
    <footer class="forgot-footer">
      <span>© 2024 Coffee Online. All rights reserved.</span>
    </footer>
  </div>
</template>

<style scoped>
.forgot-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FAFAFA 0%, #F5EEE6 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.forgot-content {
  display: flex;
  min-height: 100vh;
}

.forgot-left {
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

.lock-icon {
  width: 120px;
  height: 140px;
  background: linear-gradient(180deg, #C4A77D 0%, #8B6914 100%);
  border-radius: 20px 20px 10px 10px;
  position: relative;
}

.lock-icon::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 40px;
  border: 8px solid #C4A77D;
  border-radius: 30px 30px 0 0;
}

.lock-icon::after {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #C4A77D;
  border-radius: 50%;
}

.forgot-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.forgot-box {
  width: 100%;
  max-width: 420px;
  background: #fff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(45, 31, 20, 0.1);
}

.forgot-title {
  font-size: 1.75rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0 0 0.5rem 0;
}

.forgot-subtitle {
  font-size: 0.95rem;
  color: #8B7355;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.forgot-form {
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

.forgot-btn {
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

.forgot-btn:hover {
  background: #3D2914;
  transform: translateY(-2px);
}

.forgot-links {
  text-align: center;
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

.forgot-footer {
  text-align: center;
  padding: 1.5rem;
  color: #8B7355;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

@media (max-width: 960px) {
  .forgot-content {
    flex-direction: column;
  }
  
  .forgot-left {
    padding: 2rem;
    min-height: 200px;
  }
  
  .forgot-right {
    padding: 2rem;
  }
  
  .forgot-box {
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
