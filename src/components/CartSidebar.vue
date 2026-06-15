<script setup>import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { Close, Minus, Plus, Delete, ShoppingBag } from '@element-plus/icons-vue';
const props = defineProps({
 isOpen: {
 type: Boolean,
 default: false
 }
});
const emit = defineEmits(['close']);
const router = useRouter();
const cartStore = useCartStore();
const isEmpty = computed(() => cartStore.items.length === 0);
const handleUpdateQuantity = async (itemId, quantity) => {
 await cartStore.updateQuantity(itemId, quantity);
};
const handleRemoveItem = async (itemId) => {
 await cartStore.removeItem(itemId);
};
const handleCheckout = () => {
 router.push('/cart');
 emit('close');
};
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="cart-sidebar-overlay" @click="emit('close')">
      <div class="cart-sidebar" @click.stop>
        <div class="sidebar-header">
          <div class="header-content">
            <ShoppingBag :size="20" />
            <h2>购物车</h2>
            <span class="item-count">({{ cartStore.totalCount }})</span>
          </div>
          <button class="close-btn" @click="emit('close')">
            <Close :size="20" />
          </button>
        </div>
        
        <div class="sidebar-content">
          <div v-if="isEmpty" class="empty-cart">
            <ShoppingBag :size="48" class="empty-icon" />
            <p>购物车是空的</p>
            <button class="continue-shopping" @click="emit('close')">
              去逛逛
            </button>
          </div>
          
          <div v-else class="cart-items">
            <div 
              v-for="item in cartStore.items" 
              :key="item.id" 
              class="cart-item"
            >
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-info">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-price">¥{{ item.price }}</p>
                <div class="quantity-control">
                  <button 
                    class="qty-btn" 
                    @click="handleUpdateQuantity(item.id, item.quantity - 1)"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="qty-value">{{ item.quantity }}</span>
                  <button 
                    class="qty-btn" 
                    @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                  >
                    <Plus :size="14" />
                  </button>
                </div>
              </div>
              <div class="item-total">
                <span>¥{{ item.price * item.quantity }}</span>
                <button 
                  class="remove-btn" 
                  @click="handleRemoveItem(item.id)"
                >
                  <Delete :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="!isEmpty" class="sidebar-footer">
          <div class="footer-summary">
            <span class="summary-label">合计</span>
            <span class="summary-total">¥{{ cartStore.totalPrice }}</span>
          </div>
          <button class="checkout-btn" @click="handleCheckout">
            去结算
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cart-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(45, 31, 20, 0.4);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.cart-sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(45, 31, 20, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #F5F3EF;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-content h2 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0;
}

.item-count {
  font-size: 0.875rem;
  color: #8B7355;
}

.close-btn {
  background: none;
  border: none;
  color: #5C4033;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #F5F3EF;
  color: #2D1F14;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  color: #C4A77D;
  margin-bottom: 1rem;
}

.empty-cart p {
  color: #8B7355;
  margin: 0 0 1.5rem 0;
}

.continue-shopping {
  background: #2D1F14;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-shopping:hover {
  background: #3D2914;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #FAFAFA;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background: #F5F3EF;
}

.item-image {
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2D1F14;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 0.875rem;
  color: #8B7355;
  margin: 0 0 0.5rem 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 28px;
  height: 28px;
  background: #fff;
  border: 1px solid #E8E4DD;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5C4033;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qty-btn:hover {
  border-color: #8B7355;
  color: #2D1F14;
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2D1F14;
}

.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.item-total span {
  font-size: 1rem;
  font-weight: 600;
  color: #2D1F14;
}

.remove-btn {
  background: none;
  border: none;
  color: #C4A77D;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #F5E6D3;
  color: #8B6914;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #F5F3EF;
}

.footer-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-label {
  font-size: 0.9rem;
  color: #5C4033;
}

.summary-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2D1F14;
}

.checkout-btn {
  width: 100%;
  background: #2D1F14;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: #3D2914;
  transform: translateY(-2px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .cart-sidebar,
.slide-leave-to .cart-sidebar {
  transform: translateX(100%);
}

@media (max-width: 480px) {
  .cart-sidebar {
    width: 100%;
  }
}
</style>