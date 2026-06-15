<script setup>import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MapLocation, Clock, Phone, ArrowRight, Close } from '@element-plus/icons-vue';
import NavBar from '../components/NavBar.vue';
import SideMenu from '../components/SideMenu.vue';
import CartSidebar from '../components/CartSidebar.vue';
const router = useRouter();
const isMenuOpen = ref(false);
const isCartOpen = ref(false);
const selectedStore = ref(null);
const isModalOpen = ref(false);
const currentLocation = ref({
 latitude: 39.9042,
 longitude: 116.4074,
 city: '北京'
});
const storesList = ref([
 {
 id: 1,
 name: '朝阳门店',
 address: '北京市朝阳区建国路88号SOHO现代城A座1层',
 phone: '010-88888881',
 hours: '08:00-22:00',
 latitude: 39.9087,
 longitude: 116.4716,
 distance: '1.2km',
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20coffee%20shop%20interior%20minimalist%20design%20warm%20lighting&image_size=square',
 description: '位于CBD核心区域，环境优雅，适合商务洽谈'
 },
 {
 id: 2,
 name: '中关村店',
 address: '北京市海淀区中关村大街1号海龙大厦B1层',
 phone: '010-88888882',
 hours: '07:30-22:30',
 latitude: 39.9889,
 longitude: 116.3058,
 distance: '8.5km',
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cozy%20coffee%20shop%20near%20university%20young%20atmosphere&image_size=square',
 description: '紧邻高校区，青春活力，学习休闲好去处'
 },
 {
 id: 3,
 name: '国贸店',
 address: '北京市朝阳区建国门外大街1号国贸商城B1层',
 phone: '010-88888883',
 hours: '08:00-23:00',
 latitude: 39.9047,
 longitude: 116.4316,
 distance: '2.1km',
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=luxury%20coffee%20shop%20mall%20elegant%20premium&image_size=square',
 description: '高端商场内的精品咖啡店，品质之选'
 },
 {
 id: 4,
 name: '三里屯店',
 address: '北京市朝阳区三里屯路19号太古里南区L1层',
 phone: '010-88888884',
 hours: '10:00-00:00',
 latitude: 39.9371,
 longitude: 116.4478,
 distance: '3.8km',
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=trendy%20coffee%20shop%20sanlitun%20fashion%20district&image_size=square',
 description: '潮流聚集地，夜猫子的深夜咖啡选择'
 }
]);
const openStoreModal = (store) => {
 selectedStore.value = store;
 isModalOpen.value = true;
 document.body.style.overflow = 'hidden';
};
const closeModal = () => {
 isModalOpen.value = false;
 selectedStore.value = null;
 document.body.style.overflow = '';
};
const getCurrentLocation = () => {
 if ('geolocation' in navigator) {
 navigator.geolocation.getCurrentPosition((position) => {
 currentLocation.value = {
 latitude: position.coords.latitude,
 longitude: position.coords.longitude,
 city: '定位中...'
 };
 }, (error) => {
 console.error('定位失败:', error);
 });
 }
};
const navigateToStore = (store) => {
 const url = `https://maps.apple.com/?q=${encodeURIComponent(store.address)}`;
 window.open(url, '_blank');
};
onMounted(() => {
 getCurrentLocation();
});
</script>

<template>
  <div class="stores-container">
    <NavBar 
      @toggle-menu="isMenuOpen = true" 
      @toggle-cart="isCartOpen = true" 
    />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />
    
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-subtitle">OFFLINE STORES</p>
        <h1 class="hero-title">线下门店</h1>
        <p class="hero-desc">探索您身边的精品咖啡店</p>
      </div>
    </section>
    
    <section class="map-section">
      <div class="map-container">
        <div class="map-header">
          <div class="location-info">
            <MapLocation :size="18" />
            <span>{{ currentLocation.city }}</span>
          </div>
          <button class="refresh-btn" @click="getCurrentLocation">
            刷新位置
          </button>
        </div>
        <div class="map-content">
          <div class="map-grid">
            <div 
              v-for="store in storesList" 
              :key="store.id" 
              class="map-marker"
              :style="{ 
                top: `${20 + (store.id - 1) * 18}%`, 
                left: `${30 + (store.id % 3) * 20}%` 
              }"
              @click="openStoreModal(store)"
            >
              <div class="marker-icon">
                <MapLocation :size="20" />
              </div>
              <div class="marker-tooltip">
                <span>{{ store.name }}</span>
                <span class="distance">{{ store.distance }}</span>
              </div>
            </div>
          </div>
          <div class="map-placeholder">
            <div class="map-visual">
              <div class="grid-lines"></div>
              <div class="center-marker">
                <span class="center-dot"></span>
                <span class="center-label">您的位置</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="stores-list-section">
      <div class="section-header">
        <div class="section-divider"></div>
        <h2 class="section-title">附近门店</h2>
        <div class="section-divider"></div>
      </div>
      
      <div class="stores-grid">
        <div 
          v-for="store in storesList" 
          :key="store.id" 
          class="store-card"
          @click="openStoreModal(store)"
        >
          <div class="card-image-wrapper">
            <img :src="store.image" :alt="store.name" class="card-image" />
            <div class="distance-badge">{{ store.distance }}</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ store.name }}</h3>
            <p class="card-address">{{ store.address }}</p>
            <div class="card-info">
              <div class="info-item">
                <Clock :size="14" />
                <span>{{ store.hours }}</span>
              </div>
              <div class="info-item">
                <Phone :size="14" />
                <span>{{ store.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="stores-footer">
      <div class="footer-content">
        <span class="logo-text">COFFEE ONLINE</span>
        <p class="copyright">© 2024 Coffee Online. All rights reserved.</p>
      </div>
    </footer>
    
    <Transition name="modal">
      <div v-if="isModalOpen && selectedStore" class="modal-overlay" @click="closeModal">
        <div class="store-modal" @click.stop>
          <button class="close-btn" @click="closeModal">
            <Close :size="20" />
          </button>
          <div class="modal-image">
            <img :src="selectedStore.image" :alt="selectedStore.name" />
          </div>
          <div class="modal-content">
            <h2 class="modal-title">{{ selectedStore.name }}</h2>
            <p class="modal-desc">{{ selectedStore.description }}</p>
            <div class="modal-info">
              <div class="info-row">
                <MapLocation :size="16" />
                <span>{{ selectedStore.address }}</span>
              </div>
              <div class="info-row">
                <Phone :size="16" />
                <span>{{ selectedStore.phone }}</span>
              </div>
              <div class="info-row">
                <Clock :size="16" />
                <span>{{ selectedStore.hours }}</span>
              </div>
              <div class="info-row">
                <ArrowRight :size="16" />
                <span>距离：{{ selectedStore.distance }}</span>
              </div>
            </div>
            <button class="navigate-btn" @click="navigateToStore(selectedStore)">
              <ArrowRight :size="16" />
              导航到店
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.stores-container {
  min-height: 100vh;
  background: #FAFAFA;
  font-family: 'Inter', system-ui, sans-serif;
}

.hero-section {
  padding: 8rem 4rem 4rem;
  background: linear-gradient(180deg, #F5EEE6 0%, #FAFAFA 100%);
  text-align: center;
}

.hero-subtitle {
  font-size: 0.85rem;
  letter-spacing: 0.5em;
  color: #8B7355;
  margin-bottom: 1rem;
  font-weight: 500;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 200;
  color: #2D1F14;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-desc {
  font-size: 1.1rem;
  color: #6B5B4F;
  font-weight: 300;
}

.map-section {
  padding: 4rem;
  background: #fff;
}

.map-container {
  max-width: 1200px;
  margin: 0 auto;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #5C4033;
  font-size: 0.95rem;
}

.refresh-btn {
  background: #F5F3EF;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #6B5B4F;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #E8E4DD;
}

.map-content {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #F5F3EF 0%, #FAFAFA 100%);
  border-radius: 12px;
  overflow: hidden;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-marker {
  position: absolute;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.map-marker:hover {
  transform: scale(1.1);
}

.marker-icon {
  width: 40px;
  height: 40px;
  background: #2D1F14;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 12px rgba(45, 31, 20, 0.2);
}

.marker-tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: #2D1F14;
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.map-marker:hover .marker-tooltip {
  opacity: 1;
}

.marker-tooltip .distance {
  font-size: 0.65rem;
  opacity: 0.8;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-visual {
  position: relative;
  width: 100%;
  height: 100%;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(139, 115, 85, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 115, 85, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

.center-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.center-dot {
  width: 20px;
  height: 20px;
  background: #8B7355;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 4px rgba(139, 115, 85, 0.2);
}

.center-label {
  font-size: 0.75rem;
  color: #8B7355;
  white-space: nowrap;
}

.stores-list-section {
  padding: 4rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.section-divider {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #C4A77D, transparent);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 300;
  color: #2D1F14;
  letter-spacing: 0.15em;
}

.stores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.store-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(45, 31, 20, 0.06);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.store-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(45, 31, 20, 0.12);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.store-card:hover .card-image {
  transform: scale(1.05);
}

.distance-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  color: #5C4033;
  letter-spacing: 0.05em;
}

.card-content {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2D1F14;
  margin: 0 0 0.5rem 0;
}

.card-address {
  font-size: 0.875rem;
  color: #6B5B4F;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #8B7355;
}

.stores-footer {
  background: #2D1F14;
  padding: 4rem;
  margin-top: 4rem;
}

.footer-content {
  text-align: center;
}

.footer-content .logo-text {
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: #D4C4B0;
}

.footer-content .copyright {
  color: #8B7355;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(45, 31, 20, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.store-modal {
  position: relative;
  width: 90%;
  max-width: 500px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  animation: modalIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5C4033;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #fff;
  color: #2D1F14;
}

.modal-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-content {
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2D1F14;
  margin: 0 0 0.75rem 0;
}

.modal-desc {
  font-size: 0.9rem;
  color: #6B5B4F;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #5C4033;
}

.navigate-btn {
  width: 100%;
  background: #2D1F14;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.navigate-btn:hover {
  background: #3D2914;
  transform: translateY(-2px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .store-modal,
.modal-leave-to .store-modal {
  transform: scale(0.95) translateY(20px);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 2rem 3rem;
  }
  
  .map-section {
    padding: 2rem 1rem;
  }
  
  .stores-list-section {
    padding: 2rem 1rem;
  }
  
  .stores-footer {
    padding: 2rem;
  }
  
  .map-content {
    height: 300px;
  }
}
</style>