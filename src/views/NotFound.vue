<script setup>
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'

const router = useRouter()

const goToHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-box">
      <div class="not-found-icon">404</div>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <ElButton type="primary" @click="goToHome">返回首页</ElButton>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
}

.not-found-box {
  background: #fff;
  padding: 4rem;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.not-found-icon {
  font-size: 6rem;
  font-weight: bold;
  color: #8B4513;
  margin-bottom: 1rem;
}

.not-found-box h2 {
  color: #8B4513;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.not-found-box p {
  color: #666;
  margin-bottom: 2rem;
}
</style>