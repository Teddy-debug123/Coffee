<script setup>import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { audioManager } from '../utils/audio';
const props = defineProps({
 bean: {
 type: Object,
 required: true
 }
});
const cartStore = useCartStore();
const isHovered = ref(false);
const isAdding = ref(false);
const handleAddToCart = async () => {
 if (isAdding.value)
 return;
 isAdding.value = true;
 audioManager.playClick();
 await cartStore.addItem(props.bean);
 setTimeout(() => {
 isAdding.value = false;
 }, 600);
};
</script>

<template>
  <div 
    class="coffee-bean-card" 
    :class="{ hovered: isHovered, adding: isAdding }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="card-image-wrapper">
      <img :src="bean.image" :alt="bean.name" class="card-image" />
      <div class="image-overlay">
        <button class="add-to-cart-btn" @click="handleAddToCart">
          <span v-if="!isAdding">加入购物车</span>
          <span v-else>已加入</span>
        </button>
      </div>
    </div>
    
    <div class="card-content">
      <div class="origin-badge">{{ bean.origin }}</div>
      <h3 class="card-title">{{ bean.name }}</h3>
      <p class="card-description">{{ bean.description }}</p>
      <div class="card-footer">
        <div class="price">
          <span class="currency">¥</span>
          <span class="amount">{{ bean.price }}</span>
          <span class="unit">/{{ bean.weight }}</span>
        </div>
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="count">({{ bean.reviews }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coffee-bean-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(45, 31, 20, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.coffee-bean-card:hover {
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

.coffee-bean-card:hover .card-image {
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

.coffee-bean-card:hover .image-overlay {
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

.coffee-bean-card:hover .add-to-cart-btn {
  transform: translateY(0);
}

.add-to-cart-btn:hover {
  background: #F5F3EF;
}

.card-content {
  padding: 1.25rem;
}

.origin-badge {
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

.unit {
  font-size: 0.75rem;
  color: #8B7355;
  margin-left: 0.25rem;
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

.coffee-bean-card.adding {
  animation: pulseAdd 0.6s ease;
}

@keyframes pulseAdd {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
</style>