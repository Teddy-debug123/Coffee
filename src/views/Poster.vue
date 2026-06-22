<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import CoffeeBeanParticle from '../components/CoffeeBeanParticle.vue'
import { subscription } from '../api/index'

const router = useRouter()
const isLoading = ref(true)
const isLoaded = ref(false)
const showContent = ref(false)
const isTransitioning = ref(false)

const email = ref('')
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const subscribeEmail = async () => {
  if (!email.value || isSubmitting.value) return

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    showToast('请输入有效的邮箱地址', 'error')
    return
  }

  isSubmitting.value = true

  try {
    await subscription.subscribe(email.value)
    showToast('订阅成功，感谢您的关注！')
    email.value = ''
  } catch (error) {
    showToast(error?.message || '订阅失败，请稍后重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const goToHome = async () => {
  if (isTransitioning.value) return
  isTransitioning.value = true

  const content = document.querySelector('.poster-content')
  const nav = document.querySelector('.poster-nav')
  const footer = document.querySelector('.poster-footer')

  if (content) {
    content.style.transform = 'translateY(-30px)'
    content.style.opacity = '0'
  }
  if (nav) {
    nav.style.opacity = '0'
  }
  if (footer) {
    footer.style.opacity = '0'
  }

  await new Promise(resolve => setTimeout(resolve, 800))
  router.push('/home')
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)

  setTimeout(() => {
    isLoaded.value = true
  }, 2000)

  setTimeout(() => {
    showContent.value = true
  }, 2500)
})

onUnmounted(() => {
  isLoaded.value = false
  isTransitioning.value = false
})
</script>

<template>
  <div class="poster-container">
    <!-- Loading Screen -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-screen">
        <div class="loading-content">
          <div class="loading-logo">COFFEE ONLINE</div>
          <div class="loading-bar">
            <div class="loading-progress"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 3D Particle Scene -->
    <div class="scene-container" :class="{ loaded: isLoaded }">
      <CoffeeBeanParticle />
    </div>

    <!-- Navigation -->
    <nav class="poster-nav" :class="{ visible: showContent }">
      <div class="nav-left">
        <div class="brand-logo">
          <span class="logo-main">COFFEE</span>
          <span class="logo-sub">ONLINE</span>
        </div>
      </div>
      <div class="nav-right">
        <a href="#" @click.prevent="goToHome">Home</a>
        <a href="#">Products</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="poster-content" :class="{ visible: showContent }">
      <div class="content-main">
        <h1 class="poster-title">
          <span class="title-line">Premium</span>
          <span class="title-line">Coffee</span>
          <span class="title-line accent">Experience</span>
        </h1>
      </div>

      <div class="content-subscribe">
        <p class="subscribe-label">Stay updated</p>
        <div class="subscribe-form">
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="subscribe-input"
          />
          <button class="subscribe-btn" @click="subscribeEmail" :disabled="isSubmitting">
            <span v-if="!isSubmitting">Subscribe</span>
            <span v-else>Subscribing...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- CTA Button -->
    <div class="cta-container" :class="{ visible: showContent }">
      <button class="cta-button" @click="goToHome">
        <span class="cta-text">Enter Store</span>
        <svg class="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <Transition name="toast">
      <div v-if="toast.show" class="subscribe-toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Corner Decorations -->
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.poster-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #1a1512;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #1a1512;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.loading-logo {
  font-size: 1.5rem;
  font-weight: 200;
  letter-spacing: 0.5em;
  color: #D4A574;
  margin-bottom: 2rem;
}

.loading-bar {
  width: 200px;
  height: 2px;
  background: rgba(212, 165, 116, 0.2);
  margin: 0 auto;
  overflow: hidden;
}

.loading-progress {
  width: 40%;
  height: 100%;
  background: #D4A574;
  animation: loadingMove 1.5s ease-in-out infinite;
}

@keyframes loadingMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scene Container */
.scene-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 0;
  transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.scene-container.loaded {
  opacity: 1;
}

/* Navigation */
.poster-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4rem;
  z-index: 100;
  opacity: 0;
  transition: opacity 1s ease 0.5s;
}

.poster-nav.visible {
  opacity: 1;
}

.nav-left {
  z-index: 10;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-main {
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 0.3em;
  color: #F5F5F5;
}

.logo-sub {
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  color: #D4A574;
}

.nav-right {
  display: flex;
  gap: 3rem;
}

.nav-right a {
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(245, 245, 245, 0.7);
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.nav-right a:hover {
  color: #D4A574;
}

/* Main Content */
.poster-content {
  position: fixed;
  left: 4rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  pointer-events: none;
  opacity: 0;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.poster-content.visible {
  opacity: 1;
}

.content-main {
  margin-bottom: 4rem;
}

.poster-title {
  display: flex;
  flex-direction: column;
}

.title-line {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 200;
  color: #F5F5F5;
  letter-spacing: -0.02em;
  line-height: 1.1;
  opacity: 0;
  transform: translateY(30px);
  animation: slideIn 0.8s ease forwards;
}

.title-line:nth-child(1) {
  animation-delay: 0.3s;
}

.title-line:nth-child(2) {
  animation-delay: 0.5s;
}

.title-line.accent {
  font-weight: 600;
  color: #D4A574;
  animation-delay: 0.7s;
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subscribe Section */
.content-subscribe {
  pointer-events: auto;
}

.subscribe-label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: rgba(245, 245, 245, 0.5);
  text-transform: uppercase;
  margin-bottom: 1rem;
  opacity: 0;
  animation: fadeIn 0.8s ease 1s forwards;
}

.subscribe-form {
  display: flex;
  gap: 0.75rem;
}

.subscribe-input {
  width: 220px;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #F5F5F5;
  outline: none;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.8s ease 1.2s forwards;
}

.subscribe-input::placeholder {
  color: rgba(245, 245, 245, 0.3);
}

.subscribe-input:focus {
  border-color: #D4A574;
  background: rgba(255, 255, 255, 0.08);
}

.subscribe-btn {
  padding: 0.875rem 1.5rem;
  background: #D4A574;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: #1a1512;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.8s ease 1.4s forwards;
}

.subscribe-btn:hover {
  background: #E5B885;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* CTA Button */
.cta-container {
  position: fixed;
  right: 4rem;
  bottom: 4rem;
  z-index: 100;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s;
}

.cta-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: rgba(212, 165, 116, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 165, 116, 0.4);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-button:hover {
  background: rgba(212, 165, 116, 0.25);
  border-color: #D4A574;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.cta-text {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: #F5F5F5;
  text-transform: uppercase;
}

.cta-arrow {
  width: 20px;
  height: 20px;
  color: #D4A574;
  transition: transform 0.3s ease;
}

.cta-button:hover .cta-arrow {
  transform: translateX(4px);
}

/* Footer */
.poster-footer {
  position: fixed;
  bottom: 2rem;
  left: 4rem;
  right: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 50;
  opacity: 0;
  transition: opacity 1s ease 1.5s;
}

.poster-footer.visible {
  opacity: 0.6;
}

.footer-text {
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: rgba(245, 245, 245, 0.6);
}

/* Toast Notification */
.subscribe-toast {
  position: fixed;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  z-index: 200;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.subscribe-toast.success {
  background: rgba(100, 181, 246, 0.9);
  color: #1a1512;
}

.subscribe-toast.error {
  background: rgba(239, 83, 80, 0.9);
  color: #F5F5F5;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

/* Corner Decorations */
.corner-decoration {
  position: fixed;
  width: 80px;
  height: 80px;
  border: 1px solid rgba(212, 165, 116, 0.15);
  z-index: 10;
  pointer-events: none;
}

.corner-decoration.top-left {
  top: 1.5rem;
  left: 1.5rem;
  border-right: none;
  border-bottom: none;
}

.corner-decoration.top-right {
  top: 1.5rem;
  right: 1.5rem;
  border-left: none;
  border-bottom: none;
}

.corner-decoration.bottom-left {
  bottom: 1.5rem;
  left: 1.5rem;
  border-right: none;
  border-top: none;
}

.corner-decoration.bottom-right {
  bottom: 1.5rem;
  right: 1.5rem;
  border-left: none;
  border-top: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .poster-nav {
    padding: 1.5rem 2rem;
  }

  .poster-content {
    left: 2rem;
  }

  .nav-right {
    gap: 2rem;
  }

  .cta-container {
    right: 2rem;
    bottom: 3rem;
  }

  .poster-footer {
    left: 2rem;
    right: 2rem;
  }
}

@media (max-width: 768px) {
  .poster-nav {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-right {
    gap: 1.5rem;
  }

  .poster-content {
    left: 1.5rem;
    right: 1.5rem;
    top: auto;
    bottom: 8rem;
    transform: none;
  }

  .title-line {
    font-size: 2.5rem;
  }

  .subscribe-form {
    flex-direction: column;
    gap: 0.5rem;
  }

  .subscribe-input {
    width: 100%;
  }

  .cta-container {
    right: 1.5rem;
    bottom: 2rem;
  }

  .cta-button {
    padding: 1rem 1.75rem;
  }

  .poster-footer {
    left: 1.5rem;
    right: 1.5rem;
    bottom: 1rem;
  }

  .corner-decoration {
    width: 50px;
    height: 50px;
  }
}
</style>
