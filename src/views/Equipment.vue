<script setup>import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { audioManager } from '../utils/audio';
import NavBar from '../components/NavBar.vue';
import SideMenu from '../components/SideMenu.vue';
import CartSidebar from '../components/CartSidebar.vue';
const router = useRouter();
const cartStore = useCartStore();
const isMenuOpen = ref(false);
const isCartOpen = ref(false);
const activeCategory = ref('全部');
const equipmentList = ref([
 {
 id: 1,
 name: 'Breville 870 意式咖啡机',
 category: '咖啡机',
 price: 4999,
 weight: '8.5kg',
 reviews: 156,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=breville%20espresso%20machine%20professional%20coffee%20equipment%20minimalist%20white%20background&image_size=square',
 description: '双锅炉系统，精准控温，专业奶泡系统'
 },
 {
 id: 2,
 name: 'Hario V60 手冲壶',
 category: '冲泡器具',
 price: 299,
 weight: '600ml',
 reviews: 328,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=hario%20v60%20pour%20over%20kettle%20stainless%20steel%20minimalist%20design&image_size=square',
 description: '细长壶嘴，精准控水，不锈钢材质'
 },
 {
 id: 3,
 name: 'Baratza Encore 磨豆机',
 category: '研磨器具',
 price: 1299,
 weight: '2.5kg',
 reviews: 245,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=baratza%20encore%20coffee%20grinder%20conical%20burr%20minimalist%20design&image_size=square',
 description: '锥形刀盘，40档研磨调节'
 },
 {
 id: 4,
 name: 'Wedgwood 骨瓷咖啡杯',
 category: '杯具',
 price: 368,
 weight: '2件套装',
 reviews: 89,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=wedgwood%20bone%20china%20coffee%20cup%20set%20elegant%20minimalist&image_size=square',
 description: '英国骨瓷，精致雕花，礼盒包装'
 },
 {
 id: 5,
 name: 'Hario V60 陶瓷滤杯',
 category: '冲泡器具',
 price: 128,
 weight: '1-4人份',
 reviews: 412,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=hario%20v60%20ceramic%20coffee%20dripper%20minimalist%20design&image_size=square',
 description: '螺旋导流槽，均匀萃取'
 },
 {
 id: 6,
 name: 'Milk Boss 电动奶泡器',
 category: '辅助器具',
 price: 199,
 weight: '180W',
 reviews: 178,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=electric%20milk%20frother%20professional%20stainless%20steel%20minimalist&image_size=square',
 description: '高速旋转，绵密奶泡，一键操作'
 },
 {
 id: 7,
 name: 'Chemex 手冲壶',
 category: '冲泡器具',
 price: 358,
 weight: '600ml',
 reviews: 134,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chemex%20coffee%20maker%20glass%20minimalist%20elegant%20design&image_size=square',
 description: '玻璃材质，经典设计，醇厚口感'
 },
 {
 id: 8,
 name: 'AeroPress 爱乐压',
 category: '冲泡器具',
 price: 268,
 weight: '轻便便携',
 reviews: 267,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=aeropress%20coffee%20maker%20portable%20minimalist%20design&image_size=square',
 description: '便携设计，快速萃取，浓郁风味'
 }
]);
const categories = computed(() => {
 const cats = ['全部', ...new Set(equipmentList.value.map(item => item.category))];
 return cats;
});
const filteredEquipment = computed(() => {
 if (activeCategory.value === '全部') {
 return equipmentList.value;
 }
 return equipmentList.value.filter(item => item.category === activeCategory.value);
});
const handleAddToCart = async (equipment) => {
 audioManager.playClick();
 await cartStore.addItem(equipment);
};
const selectCategory = (category) => {
 activeCategory.value = category;
};
onMounted(() => {
 cartStore.loadCart();
});
</script>

<template>
  <div class="equipment-container">
    <NavBar 
      @toggle-menu="isMenuOpen = true" 
      @toggle-cart="isCartOpen = true" 
    />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />
    
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-subtitle">BREWING EQUIPMENT</p>
        <h1 class="hero-title">咖啡器具</h1>
        <p class="hero-desc">精选专业冲煮器具，开启你的咖啡之旅</p>
      </div>
    </section>
    
    <section class="category-section">
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category"
          class="category-btn"
          :class="{ active: activeCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </section>
    
    <section class="equipment-grid-section">
      <div class="equipment-grid">
        <div 
          v-for="equipment in filteredEquipment" 
          :key="equipment.id" 
          class="equipment-card"
        >
          <div class="card-image-wrapper">
            <img :src="equipment.image" :alt="equipment.name" class="card-image" />
            <div class="image-overlay">
              <button class="add-to-cart-btn" @click="handleAddToCart(equipment)">
                加入购物车
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <span class="category-tag">{{ equipment.category }}</span>
            <h3 class="card-title">{{ equipment.name }}</h3>
            <p class="card-description">{{ equipment.description }}</p>
            <div class="card-footer">
              <div class="price">
                <span class="currency">¥</span>
                <span class="amount">{{ equipment.price }}</span>
              </div>
              <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="count">({{ equipment.reviews }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="equipment-footer">
      <div class="footer-content">
        <span class="logo-text">COFFEE ONLINE</span>
        <p class="copyright">© 2024 Coffee Online. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.equipment-container {
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

.category-section {
  padding: 2rem 4rem;
  background: #fff;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.category-btn {
  background: #F5F3EF;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #6B5B4F;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: #E8E4DD;
}

.category-btn.active {
  background: #2D1F14;
  color: #fff;
}

.equipment-grid-section {
  padding: 4rem;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.equipment-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(45, 31, 20, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.equipment-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(45, 31, 20, 0.12);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #F5F3EF;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.equipment-card:hover .card-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(45, 31, 20, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.equipment-card:hover .image-overlay {
  opacity: 1;
}

.add-to-cart-btn {
  background: #fff;
  color: #2D1F14;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(20px);
}

.equipment-card:hover .add-to-cart-btn {
  transform: translateY(0);
}

.add-to-cart-btn:hover {
  background: #F5F3EF;
}

.card-content {
  padding: 1.25rem;
}

.category-tag {
  display: inline-block;
  background: #F5E6D3;
  color: #5C4033;
  font-size: 0.7rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2D1F14;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.card-description {
  font-size: 0.875rem;
  color: #6B5B4F;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 0.875rem;
  color: #8B7355;
  margin-right: 0.125rem;
}

.amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2D1F14;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stars {
  font-size: 0.75rem;
  color: #FAAD14;
}

.count {
  font-size: 0.7rem;
  color: #8B7355;
}

.equipment-footer {
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

@media (max-width: 768px) {
  .hero-section {
    padding: 6rem 2rem 3rem;
  }
  
  .category-section {
    padding: 1.5rem 1rem;
  }
  
  .equipment-grid-section {
    padding: 2rem 1rem;
  }
  
  .equipment-footer {
    padding: 2rem;
  }
}
</style>