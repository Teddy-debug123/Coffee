<script setup>import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ShoppingCart, Star, MapLocation, Clock, CaretRight, Check, Minus, Plus } from '@element-plus/icons-vue';
import { useCartStore } from '../stores/cart';
import { mockGetEquipmentById, mockGetRelatedEquipment } from '../api/mock';
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const tool = ref(null);
const isLoading = ref(true);
const selectedSpec = ref('');
const quantity = ref(1);
const isFavorite = ref(false);
const images = ref([]);
const activeImageIndex = ref(0);
const specs = ref([]);
const characteristics = ref([]);
const reviews = ref([]);
const relatedTools = ref([]);
const isAddingToCart = ref(false);
const displayPrice = ref(0);
const animatePrice = (target) => {
 const duration = 800;
 const startTime = performance.now();
 const startVal = displayPrice.value;
 const diff = target - startVal;
 const animate = (currentTime) => {
 const elapsed = currentTime - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const easeProgress = 1 - Math.pow(1 - progress, 3);
 displayPrice.value = Math.round(startVal + diff * easeProgress);
 if (progress < 1) {
 requestAnimationFrame(animate);
 }
 };
 requestAnimationFrame(animate);
};
const loadTool = async () => {
 isLoading.value = true;
 try {
 const { code, data } = await mockGetEquipmentById(route.params.toolId);
 if (code === 200 && data) {
 tool.value = data;
 images.value = data.images || [data.imageUrl];
 specs.value = data.specs || [];
 characteristics.value = data.characteristics || [];
 reviews.value = data.reviews || [];
 if (data.category) {
 relatedTools.value = await mockGetRelatedEquipment(data.category, data.id);
 }
 if (specs.value.length > 0) {
 selectedSpec.value = specs.value[0].value;
 }
 displayPrice.value = data.price || 0;
 }
 else {
 throw new Error('工具不存在');
 }
 }
 catch (error) {
 console.error('加载工具详情失败:', error);
 ElMessage.warning('该器具已下架，为您跳转器具列表');
 setTimeout(() => {
 router.push('/equipment');
 }, 1500);
 }
 finally {
 isLoading.value = false;
 }
};
const selectSpec = (spec) => {
 selectedSpec.value = spec.value;
 if (spec.price) {
 animatePrice(spec.price);
 }
 else {
 animatePrice(tool.value.price);
 }
 if (spec.image) {
 images.value = [spec.image];
 activeImageIndex.value = 0;
 }
};
const decreaseQuantity = () => {
 if (quantity.value > 1) {
 quantity.value--;
 }
};
const increaseQuantity = () => {
 if (quantity.value < 99) {
 quantity.value++;
 }
};
const addToCart = async () => {
 if (!tool.value)
 return;
 isAddingToCart.value = true;
 try {
 await cartStore.addItem({
 id: tool.value.id,
 name: tool.value.name,
 price: displayPrice.value,
 image: images.value[0] || tool.value.imageUrl,
 quantity: quantity.value,
 type: 'tool',
 spec: selectedSpec.value || '默认',
 category: tool.value.category || '器具'
 });
 ElMessage.success('已加入购物车');
 }
 catch (error) {
 ElMessage.error('加入购物车失败');
 }
 finally {
 isAddingToCart.value = false;
 }
};
const buyNow = async () => {
 await addToCart();
 router.push('/checkout');
};
const toggleFavorite = () => {
 isFavorite.value = !isFavorite.value;
 if (isFavorite.value) {
 ElMessage.success('已收藏');
 }
 else {
 ElMessage.info('已取消收藏');
 }
};
const goBack = () => {
 router.back();
};
const openImagePreview = (index) => {
 activeImageIndex.value = index;
};
onMounted(() => {
 loadTool();
});
const currentPrice = computed(() => {
 if (selectedSpec.value) {
 const spec = specs.value.find(s => s.value === selectedSpec.value);
 if (spec && spec.price) {
 return spec.price;
 }
 }
 return tool.value?.price || 0;
});
</script>

<template>
  <div class="tool-detail-container">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="tool" class="tool-detail-content">
      <nav class="breadcrumb-nav">
        <div class="container">
          <button @click="goBack" class="back-btn">
            <CaretRight :size="20" class="rotate-180" />
            返回
          </button>
          <span class="breadcrumb-separator">/</span>
          <a href="/equipment" class="breadcrumb-link">咖啡器具</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ tool.name }}</span>
        </div>
      </nav>
      
      <section class="product-main container">
        <div class="product-images">
          <div class="main-image-wrapper" @click="openImagePreview(0)">
            <img 
              :src="images[activeImageIndex] || tool.imageUrl" 
              :alt="tool.name"
              class="main-image"
            />
            <div class="image-overlay">
              <span class="image-hint">点击放大</span>
            </div>
          </div>
          <div class="thumbnails">
            <div 
              v-for="(img, index) in images" 
              :key="index"
              class="thumbnail"
              :class="{ active: index === activeImageIndex }"
              @click="activeImageIndex = index"
            >
              <img :src="img" :alt="`${tool.name} ${index + 1}`" />
            </div>
          </div>
        </div>
        
        <div class="product-info">
          <div class="product-category">{{ tool.category || '咖啡器具' }}</div>
          <h1 class="product-name">{{ tool.name }}</h1>
          
          <div class="product-rating">
            <div class="stars">
              <Star 
                v-for="i in 5" 
                :key="i" 
                :size="18" 
                :class="{ filled: i <= (tool.rating || 4.8) }"
              />
            </div>
            <span class="rating-value">{{ tool.rating || 4.8 }}</span>
            <span class="review-count">({{ reviews.length }}条评价)</span>
          </div>
          
          <div class="product-price">
            <span class="currency">¥</span>
            <span class="price-value">{{ displayPrice }}</span>
          </div>
          
          <div class="product-stock" v-if="tool.stock">
            <span class="stock-label">库存</span>
            <span class="stock-value" :class="{ low: tool.stock < 10 }">
              {{ tool.stock > 0 ? `有货 (${tool.stock}件)` : '暂时缺货' }}
            </span>
          </div>
          
          <div class="product-params">
            <div class="param-item">
              <span class="param-label">材质</span>
              <span class="param-value">{{ tool.material || '-' }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">容量</span>
              <span class="param-value">{{ tool.capacity || '-' }}</span>
            </div>
            <div class="param-item">
              <span class="param-label">功率</span>
              <span class="param-value">{{ tool.power || '-' }}</span>
            </div>
          </div>
          
          <div class="spec-section" v-if="specs.length > 0">
            <h3 class="section-title">规格选择</h3>
            <div class="spec-options">
              <button 
                v-for="spec in specs" 
                :key="spec.value"
                class="spec-option"
                :class="{ selected: selectedSpec === spec.value }"
                @click="selectSpec(spec)"
              >
                {{ spec.value }}
                <span v-if="spec.price !== tool?.price" class="spec-price">
                  ¥{{ spec.price }}
                </span>
              </button>
            </div>
          </div>
          
          <div class="quantity-section">
            <span class="quantity-label">数量</span>
            <div class="quantity-control">
              <button 
                class="qty-btn minus" 
                :disabled="quantity <= 1"
                @click="decreaseQuantity"
              >
                <Minus :size="16" />
              </button>
              <span class="qty-value">{{ quantity }}</span>
              <button 
                class="qty-btn plus" 
                :disabled="quantity >= 99"
                @click="increaseQuantity"
              >
                <Plus :size="16" />
              </button>
            </div>
          </div>
          
          <div class="action-buttons">
            <button 
              class="btn btn-primary" 
              :disabled="isAddingToCart || (tool.stock && tool.stock <= 0)"
              @click="addToCart"
            >
              <ShoppingCart :size="20" />
              {{ isAddingToCart ? '添加中...' : '加入购物车' }}
            </button>
            <button 
              class="btn btn-secondary" 
              :disabled="isAddingToCart || (tool.stock && tool.stock <= 0)"
              @click="buyNow"
            >
              立即购买
            </button>
            <button 
              class="btn btn-icon favorite"
              :class="{ active: isFavorite }"
              @click="toggleFavorite"
            >
              <Star :size="20" />
            </button>
          </div>
        </div>
      </section>
      
      <section class="product-details container">
        <div class="details-tabs">
          <button 
            v-for="tab in ['产品详情', '使用教程', '保养贴士']" 
            :key="tab"
            class="tab-btn active"
          >
            {{ tab }}
          </button>
        </div>
        
        <div class="details-content">
          <div class="characteristics-grid" v-if="characteristics.length > 0">
            <div 
              v-for="(char, index) in characteristics" 
              :key="index"
              class="characteristic-card"
            >
              <h4 class="char-title">{{ char.title }}</h4>
              <p class="char-desc">{{ char.description }}</p>
            </div>
          </div>
          
          <div class="spec-table">
            <h3 class="table-title">完整参数</h3>
            <table>
              <tbody>
                <tr>
                  <td>材质</td>
                  <td>{{ tool.material || '-' }}</td>
                </tr>
                <tr>
                  <td>容量</td>
                  <td>{{ tool.capacity || '-' }}</td>
                </tr>
                <tr>
                  <td>功率</td>
                  <td>{{ tool.power || '-' }}</td>
                </tr>
                <tr>
                  <td>尺寸</td>
                  <td>{{ tool.size || '-' }}</td>
                </tr>
                <tr>
                  <td>净重</td>
                  <td>{{ tool.weight || '-' }}</td>
                </tr>
                <tr>
                  <td>适用人数</td>
                  <td>{{ tool.suitableFor || '-' }}</td>
                </tr>
                <tr>
                  <td>配件清单</td>
                  <td>{{ tool.accessories || '-' }}</td>
                </tr>
                <tr>
                  <td>质保年限</td>
                  <td>{{ tool.warranty || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="usage-guide" v-if="tool.usageGuide">
            <h3 class="guide-title">使用教程</h3>
            <div v-html="tool.usageGuide"></div>
          </div>
          
          <div class="care-tips" v-if="tool.careTips">
            <h3 class="tips-title">保养贴士</h3>
            <div v-html="tool.careTips"></div>
          </div>
        </div>
      </section>
      
      <section class="reviews-section container">
        <h2 class="section-title">用户评价</h2>
        <div class="reviews-list" v-if="reviews.length > 0">
          <div 
            v-for="(review, index) in reviews" 
            :key="index"
            class="review-card"
          >
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">{{ review.username?.charAt(0) || 'U' }}</div>
                <span class="reviewer-name">{{ review.username || '匿名用户' }}</span>
              </div>
              <div class="review-stars">
                <Star 
                  v-for="i in 5" 
                  :key="i" 
                  :size="14" 
                  :class="{ filled: i <= review.rating }"
                />
              </div>
            </div>
            <p class="review-content">{{ review.content }}</p>
            <div class="review-meta">
              <span class="review-date">{{ review.createTime }}</span>
              <span v-if="review.spec" class="review-spec">规格：{{ review.spec }}</span>
            </div>
          </div>
        </div>
        <div class="no-reviews" v-else>
          <p>暂无评价，快来发表第一条评价吧</p>
        </div>
      </section>
      
      <section class="related-section container">
        <h2 class="section-title">同款品类推荐</h2>
        <div class="related-grid">
          <div 
            v-for="item in relatedTools" 
            :key="item.id"
            class="related-card"
            @click="router.push(`/tool/detail/${item.id}`)"
          >
            <div class="related-image-wrapper">
              <img :src="item.imageUrl" :alt="item.name" />
            </div>
            <div class="related-info">
              <span class="related-category">{{ item.category }}</span>
              <h4 class="related-name">{{ item.name }}</h4>
              <span class="related-price">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <footer class="detail-footer">
        <div class="footer-content container">
          <div class="footer-links">
            <a href="/about">关于我们</a>
            <a href="/contact">联系客服</a>
            <a href="/shipping">配送说明</a>
            <a href="/return">退换货政策</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.tool-detail-container {
  min-height: 100vh;
  background: var(--color-bg);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(184, 169, 153, 0.3);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.breadcrumb-nav {
  padding: 16px 0;
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(184, 169, 153, 0.2);
}

.breadcrumb-nav .container {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-muted);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  transition: color 0.2s;
}

.back-btn:hover {
  color: var(--color-primary);
}

.rotate-180 {
  transform: rotate(180deg);
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-current {
  color: var(--color-primary);
  font-weight: 500;
}

.product-main {
  padding: 48px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.main-image-wrapper:hover .main-image {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 12px;
  border-radius: 20px;
}

.image-hint {
  color: #fff;
  font-size: 12px;
}

.thumbnails {
  display: flex;
  gap: 8px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail.active {
  border-color: var(--color-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-category {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(184, 169, 153, 0.15);
  color: #7A6B5D;
  font-size: 13px;
  border-radius: 20px;
  width: fit-content;
}

.product-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars .filled {
  color: #D4A574;
}

.rating-value {
  font-weight: 600;
  color: var(--color-primary);
}

.review-count {
  color: var(--color-muted);
  font-size: 13px;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.currency {
  font-size: 24px;
  font-weight: 600;
  color: #C4A35A;
}

.price-value {
  font-size: 44px;
  font-weight: 700;
  color: #C4A35A;
  font-family: 'SF Mono', monospace;
}

.product-stock {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stock-label {
  font-size: 14px;
  color: var(--color-muted);
}

.stock-value {
  font-size: 14px;
  color: #6B8E6B;
}

.stock-value.low {
  color: #C75B5B;
}

.product-params {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param-label {
  font-size: 12px;
  color: var(--color-muted);
}

.param-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
}

.spec-section {
  padding-top: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-option {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(184, 169, 153, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-primary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-option:hover {
  border-color: var(--color-primary);
}

.spec-option.selected {
  background: rgba(89, 71, 58, 0.1);
  border-color: var(--color-primary);
}

.spec-price {
  font-size: 13px;
  color: #C4A35A;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-label {
  font-size: 14px;
  color: var(--color-primary);
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid rgba(184, 169, 153, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  transition: background 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(184, 169, 153, 0.15);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  width: 48px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  padding: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn svg {
  width: 18px !important;
  height: 18px !important;
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #3A281B;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(58, 40, 27, 0.2);
}

.btn-secondary {
  background: rgba(184, 169, 153, 0.15);
  color: var(--color-primary);
  border: 1px solid rgba(184, 169, 153, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(184, 169, 153, 0.25);
}

.btn-icon {
  flex: none;
  width: 48px;
  padding: 0;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(184, 169, 153, 0.3);
  border-radius: 12px;
}

.btn-icon.favorite.active {
  background: rgba(196, 163, 90, 0.1);
  color: #C4A35A;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-details {
  padding: 48px 0;
  border-top: 1px solid rgba(184, 169, 153, 0.2);
}

.details-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 1px solid rgba(184, 169, 153, 0.2);
}

.tab-btn {
  padding: 12px 24px;
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.characteristic-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(184, 169, 153, 0.2);
}

.char-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.char-desc {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.6;
}

.spec-table {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(184, 169, 153, 0.2);
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.spec-table table {
  width: 100%;
  border-collapse: collapse;
}

.spec-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(184, 169, 153, 0.1);
  font-size: 14px;
}

.spec-table td:first-child {
  color: var(--color-muted);
  width: 30%;
}

.spec-table td:last-child {
  color: var(--color-text);
}

.usage-guide,
.care-tips {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(184, 169, 153, 0.2);
}

.guide-title,
.tips-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.usage-guide p,
.care-tips p {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 12px;
}

.reviews-section {
  padding: 48px 0;
  background: rgba(245, 240, 232, 0.5);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(184, 169, 153, 0.2);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(184, 169, 153, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.reviewer-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
}

.review-stars {
  display: flex;
  gap: 2px;
}

.review-content {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 12px;
}

.review-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--color-muted);
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: var(--color-muted);
}

.related-section {
  padding: 48px 0;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.related-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.related-card:hover {
  transform: translateY(-4px);
}

.related-image-wrapper {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #fff;
}

.related-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.related-category {
  font-size: 12px;
  color: var(--color-muted);
}

.related-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-price {
  font-size: 16px;
  font-weight: 600;
  color: #C4A35A;
}

.detail-footer {
  padding: 48px 0;
  background: rgba(58, 40, 27, 0.05);
  border-top: 1px solid rgba(184, 169, 153, 0.2);
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.footer-links a {
  font-size: 14px;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-primary);
}

@media (max-width: 960px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-name {
    font-size: 22px;
  }
  
  .price-value {
    font-size: 32px;
  }
  
  .characteristics-grid {
    grid-template-columns: 1fr;
  }
  
  .product-params {
    flex-wrap: wrap;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
