<script setup>import { ref, onMounted, computed } from 'vue';
import { useCartStore } from '../stores/cart';
import NavBar from '../components/NavBar.vue';
import SideMenu from '../components/SideMenu.vue';
import CartSidebar from '../components/CartSidebar.vue';
import CoffeeBeanCard from '../components/CoffeeBeanCard.vue';
import SeasonCalendar from '../components/SeasonCalendar.vue';
import CoffeeScale from '../components/CoffeeScale.vue';
import CoffeeBean3D from '../components/CoffeeBean3D.vue';
const cartStore = useCartStore();
const isMenuOpen = ref(false);
const isCartOpen = ref(false);
const selectedSeason = ref({ season: null, date: null });
const selectedWeight = ref(150);
const coffeeBeans = ref([
 {
 id: 1,
 name: '埃塞俄比亚 耶加雪菲',
 origin: '埃塞俄比亚',
 description: '花香果香浓郁，口感柔和，带有柑橘与茉莉的清新风味',
 price: 128,
 weight: '250g',
 reviews: 328,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=premium%20ethiopian%20yirgacheffe%20coffee%20beans%20in%20elegant%20packaging%20minimalist%20style%20warm%20tones&image_size=square'
 },
 {
 id: 2,
 name: '哥伦比亚 慧兰',
 origin: '哥伦比亚',
 description: '坚果巧克力风味，醇厚顺滑，平衡感极佳',
 price: 98,
 weight: '250g',
 reviews: 256,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=colombian%20huila%20coffee%20beans%20premium%20packaging%20coffee%20shop%20aesthetic&image_size=square'
 },
 {
 id: 3,
 name: '云南 普洱咖啡豆',
 origin: '中国云南',
 description: '坚果焦糖香气，酸度适中，回甘持久',
 price: 68,
 weight: '250g',
 reviews: 189,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=yunnan%20chinese%20coffee%20beans%20traditional%20packaging%20warm%20earth%20tones&image_size=square'
 },
 {
 id: 4,
 name: '危地马拉 安提瓜',
 origin: '危地马拉',
 description: '烟熏可可风味，浓郁醇厚，层次丰富',
 price: 118,
 weight: '250g',
 reviews: 145,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=guatemala%20antigua%20coffee%20beans%20dark%20roast%20premium%20quality&image_size=square'
 },
 {
 id: 5,
 name: '肯尼亚 AA级',
 origin: '肯尼亚',
 description: '黑醋栗与红酒般的酸度，明亮活泼',
 price: 138,
 weight: '250g',
 reviews: 98,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=kenya%20aa%20coffee%20beans%20bright%20color%20premium%20presentation&image_size=square'
 },
 {
 id: 6,
 name: '巴西 喜拉朵',
 origin: '巴西',
 description: '坚果奶油风味，温和顺滑，适合日常饮用',
 price: 78,
 weight: '250g',
 reviews: 423,
 image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=brazil%20cerrado%20coffee%20beans%20classic%20packaging%20warm%20brown%20tones&image_size=square'
 }
]);
const filteredBeans = computed(() => {
 if (!selectedSeason.value.season)
 return coffeeBeans.value;
 const seasonMap = {
 spring: ['埃塞俄比亚 耶加雪菲', '肯尼亚 AA级'],
 summer: ['哥伦比亚 慧兰', '巴西 喜拉朵'],
 autumn: ['危地马拉 安提瓜', '云南 普洱咖啡豆'],
 winter: ['哥伦比亚 慧兰', '危地马拉 安提瓜']
 };
 const seasonBeans = seasonMap[selectedSeason.value.season] || [];
 return coffeeBeans.value.filter(bean => seasonBeans.includes(bean.name));
});
const handleSeasonChange = (value) => {
 selectedSeason.value = value;
};
onMounted(() => {
 cartStore.loadCart();
});
</script>

<template>
  <div class="home-container">
    <NavBar 
      @toggle-menu="isMenuOpen = true" 
      @toggle-cart="isCartOpen = true" 
    />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />
    
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-subtitle">COFFEE ONLINE</p>
        <h1 class="hero-title">品味生活</h1>
        <p class="hero-desc">从一杯好咖啡开始</p>
        <div class="hero-cta">
          <button class="hero-btn">探索精品咖啡豆</button>
        </div>
      </div>
      <div class="hero-3d-container">
        <CoffeeBean3D />
      </div>
    </section>
    
    <section class="beans-section">
      <div class="section-header">
        <div class="section-divider"></div>
        <h2 class="section-title">Single-Origin Coffee</h2>
        <div class="section-divider"></div>
      </div>
      <p class="section-subtitle">精选单一产地咖啡豆</p>
      
      <div class="beans-grid">
        <CoffeeBeanCard 
          v-for="bean in filteredBeans" 
          :key="bean.id" 
          :bean="bean" 
        />
      </div>
    </section>
    
    <section class="season-section">
      <div class="section-header">
        <div class="section-divider"></div>
        <h2 class="section-title">Seasonal Selection</h2>
        <div class="section-divider"></div>
      </div>
      <p class="section-subtitle">按季节探索限定咖啡豆</p>
      
      <div class="season-content">
        <SeasonCalendar 
          v-model="selectedSeason" 
          @change="handleSeasonChange" 
        />
        
        <div class="season-info">
          <h3>季节限定推荐</h3>
          <div v-if="selectedSeason.season" class="season-beans">
            <div 
              v-for="bean in filteredBeans.slice(0, 2)" 
              :key="bean.id" 
              class="season-bean"
            >
              <img :src="bean.image" :alt="bean.name" />
              <div>
                <h4>{{ bean.name }}</h4>
                <p>¥{{ bean.price }}/{{ bean.weight }}</p>
              </div>
            </div>
          </div>
          <p v-else class="no-selection">选择一个季节查看限定咖啡豆</p>
        </div>
      </div>
    </section>
    
    <section class="blend-section">
      <div class="section-header">
        <div class="section-divider"></div>
        <h2 class="section-title">Custom Blend</h2>
        <div class="section-divider"></div>
      </div>
      <p class="section-subtitle">自定义拼配，精准把控每一杯</p>
      
      <div class="blend-content">
        <div class="scale-wrapper">
          <CoffeeScale v-model="selectedWeight" />
        </div>
        <div class="blend-info">
          <h3>克重选择</h3>
          <p class="blend-desc">拖动圆环或点击按钮调整咖啡豆克数，找到最适合你的冲泡比例</p>
          <div class="blend-tips">
            <div class="tip">
              <span class="tip-value">15g</span>
              <span class="tip-label">单人份</span>
            </div>
            <div class="tip">
              <span class="tip-value">25g</span>
              <span class="tip-label">双人份</span>
            </div>
            <div class="tip">
              <span class="tip-value">30g+</span>
              <span class="tip-label">多人分享</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="about-section">
      <div class="about-content">
        <h2 class="about-title">Our Philosophy</h2>
        <p class="about-text">
          咖啡在线致力于为每一位咖啡爱好者带来纯粹的味觉体验。我们深入世界各地的咖啡产区，
          甄选优质生豆，采用专业烘焙工艺，让每一颗咖啡豆都释放出独特的香气与风味。
        </p>
        <p class="about-text">
          从种植到杯中，我们坚持品质至上，用心传递咖啡的美好。
        </p>
      </div>
    </section>
    
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="logo-text">COFFEE ONLINE</span>
        </div>
        <p class="footer-copyright">© 2024 Coffee Online. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #FAFAFA;
  font-family: 'Inter', system-ui, sans-serif;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6rem;
  padding-top: 80px;
  background: linear-gradient(180deg, #FAFAFA 0%, #F5EEE6 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  flex: 1;
  max-width: 500px;
  z-index: 10;
}

.hero-subtitle {
  font-size: 0.85rem;
  letter-spacing: 0.5em;
  color: #8B7355;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 200;
  color: #2D1F14;
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-desc {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: #6B5B4F;
  font-weight: 300;
  margin-bottom: 2.5rem;
}

.hero-cta {
  display: inline-block;
}

.hero-btn {
  background: #2D1F14;
  color: #fff;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-btn:hover {
  background: #3D2914;
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(45, 31, 20, 0.2);
}

.hero-3d-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.beans-section {
  padding: 8rem 4rem;
  background: #fff;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
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

.section-subtitle {
  text-align: center;
  font-size: 0.95rem;
  color: #8B7355;
  margin-bottom: 4rem;
}

.beans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.season-section {
  padding: 8rem 4rem;
  background: #FAFAFA;
}

.season-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.season-info {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(45, 31, 20, 0.06);
}

.season-info h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0 0 1.5rem 0;
}

.season-beans {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.season-bean {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #FAFAFA;
  border-radius: 8px;
}

.season-bean img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.season-bean h4 {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0 0 0.25rem 0;
}

.season-bean p {
  font-size: 0.85rem;
  color: #8B7355;
  margin: 0;
}

.no-selection {
  color: #8B7355;
  font-size: 0.9rem;
  text-align: center;
  padding: 2rem;
}

.blend-section {
  padding: 8rem 4rem;
  background: #fff;
}

.blend-content {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.scale-wrapper {
  display: flex;
  justify-content: center;
}

.blend-info h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0 0 1rem 0;
}

.blend-desc {
  font-size: 0.95rem;
  color: #6B5B4F;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.blend-tips {
  display: flex;
  gap: 2rem;
}

.tip {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tip-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2D1F14;
}

.tip-label {
  font-size: 0.75rem;
  color: #8B7355;
  letter-spacing: 0.05em;
}

.about-section {
  padding: 8rem 4rem;
  background: linear-gradient(180deg, #fff 0%, #FAFAFA 100%);
}

.about-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.about-title {
  font-size: 1.5rem;
  font-weight: 300;
  color: #2D1F14;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
}

.about-text {
  font-size: 1rem;
  color: #6B5B4F;
  line-height: 2;
  margin-bottom: 1.5rem;
}

.home-footer {
  background: #2D1F14;
  padding: 4rem;
}

.footer-content {
  text-align: center;
}

.footer-logo {
  margin-bottom: 1rem;
}

.footer-logo .logo-text {
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: #D4C4B0;
}

.footer-copyright {
  color: #8B7355;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

@media (max-width: 960px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 0 2rem;
    padding-top: 100px;
  }
  
  .hero-content {
    margin-bottom: 2rem;
  }
  
  .season-content {
    grid-template-columns: 1fr;
  }
  
  .blend-content {
    grid-template-columns: 1fr;
  }
  
  .blend-tips {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .beans-section,
  .season-section,
  .blend-section,
  .about-section {
    padding: 4rem 1.5rem;
  }
}
</style>