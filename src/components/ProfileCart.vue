<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import { Plus, Minus, Delete, ShoppingCart, DeleteFilled, Check } from '@element-plus/icons-vue'
import gsap from 'gsap'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const selectedIds = ref(new Set())
const showToast = ref(false)
const toastMessage = ref('')
const isAnimating = ref(false)
const cartRef = ref(null)

const isLoaded = computed(() => cartStore.isLoaded)
const items = computed(() => cartStore.items)
const totalCount = computed(() => cartStore.totalCount)

const isAllSelected = computed(() => {
  return items.value.length > 0 && selectedIds.value.size === items.value.length
})

const selectedItems = computed(() => {
  return items.value.filter(item => selectedIds.value.has(item.id))
})

const selectedTotalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    const price = Number(item?.product?.price || item?.price || 0)
    return sum + price * Number(item.quantity || 0)
  }, 0)
})

const beanTotal = computed(() => {
  return selectedItems.value
    .filter(item => (item.product?.category || '').toLowerCase().includes('bean') || item.productType === 'bean')
    .reduce((sum, item) => {
      const price = Number(item?.product?.price || item?.price || 0)
      return sum + price * Number(item.quantity || 0)
    }, 0)
})

const equipmentTotal = computed(() => {
  return selectedItems.value
    .filter(item => (item.product?.category || '').toLowerCase().includes('equip') || item.productType === 'equipment')
    .reduce((sum, item) => {
      const price = Number(item?.product?.price || item?.price || 0)
      return sum + price * Number(item.quantity || 0)
    }, 0)
})

const shippingFee = computed(() => {
  return selectedTotalPrice.value >= 199 ? 0 : 10
})

const finalTotal = computed(() => {
  return selectedTotalPrice.value + shippingFee.value
})

const getItemSubtotal = (item) => {
  const price = Number(item?.product?.price || item?.price || 0)
  return price * Number(item.quantity || 0)
}

const getItemCategory = (item) => {
  const category = item.product?.category || item.productType || ''
  if (category.toLowerCase().includes('bean')) return '咖啡豆'
  if (category.toLowerCase().includes('equip')) return '咖啡器具'
  return '咖啡商品'
}

const toggleSelect = (itemId) => {
  if (selectedIds.value.has(itemId)) {
    selectedIds.value.delete(itemId)
  } else {
    selectedIds.value.add(itemId)
  }
  selectedIds.value = new Set(selectedIds.value)
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = new Set()
  } else {
    selectedIds.value = new Set(items.value.map(item => item.id))
  }
}

const updateQuantity = async (item, delta) => {
  const newQuantity = Number(item.quantity || 0) + delta
  if (newQuantity <= 0) {
    await removeItem(item.id)
  } else {
    isAnimating.value = true
    await cartStore.updateQuantity(item.id, newQuantity)
    setTimeout(() => { isAnimating.value = false }, 300)
  }
}

const removeItem = async (cartId) => {
  const el = document.querySelector(`[data-cart-id="${cartId}"]`)
  if (el) {
    gsap.to(el, {
      height: 0,
      opacity: 0,
      marginBottom: 0,
      padding: 0,
      duration: 0.3,
      ease: 'power3.inOut',
      onComplete: async () => {
        await cartStore.removeItem(cartId)
        selectedIds.value.delete(cartId)
      }
    })
  } else {
    await cartStore.removeItem(cartId)
    selectedIds.value.delete(cartId)
  }
}

const removeSelectedItems = async () => {
  for (const id of selectedIds.value) {
    await cartStore.removeItem(id)
  }
  selectedIds.value = new Set()
  showToastMessage('已删除选中商品')
}

const handleCheckout = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login?redirect=/profile')
    return
  }
  if (selectedItems.value.length === 0) {
    showToastMessage('请先选择商品')
    return
  }
  showToastMessage('即将跳转到结算页面')
  setTimeout(() => {
    router.push('/cart')
  }, 500)
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2000)
}

const handleGoShopping = () => {
  router.push('/home#beans-section')
}

onMounted(() => {
  if (!cartStore.isLoaded) {
    cartStore.loadCart()
  }
  if (cartRef.value) {
    gsap.from(cartRef.value, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out'
    })
  }
})

onUnmounted(() => {
  selectedIds.value.clear()
})

watch(() => items.value, () => {
  selectedIds.value = new Set([...selectedIds.value].filter(id => items.value.some(item => item.id === id)))
})
</script>

<template>
  <div class="profile-cart" ref="cartRef">
    <div class="cart-header">
      <div class="cart-title">
        <ShoppingCart :size="20" />
        <h3>我的购物车</h3>
        <span class="cart-count">{{ totalCount }} 件</span>
      </div>
      <div class="cart-actions">
        <label class="select-all" @click="toggleSelectAll">
          <span class="checkbox" :class="{ checked: isAllSelected }">
            <Check v-if="isAllSelected" :size="14" />
          </span>
          <span>全选</span>
        </label>
        <button v-if="selectedIds.size > 0" class="delete-selected" @click="removeSelectedItems">
          <DeleteFilled :size="14" />
          <span>删除选中</span>
        </button>
      </div>
    </div>

    <div class="cart-body">
      <div v-if="!isLoaded" class="cart-skeleton">
        <div v-for="i in 3" :key="i" class="skeleton-item">
          <div class="skeleton-thumb"></div>
          <div class="skeleton-info">
            <div class="skeleton-title"></div>
            <div class="skeleton-meta"></div>
          </div>
          <div class="skeleton-actions">
            <div class="skeleton-btn"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-btn"></div>
          </div>
        </div>
      </div>

      <div v-else-if="items.length === 0" class="cart-empty">
        <div class="empty-icon">
          <ShoppingCart :size="48" />
        </div>
        <p class="empty-text">购物车还是空的</p>
        <p class="empty-hint">去挑选心仪的咖啡吧</p>
        <button class="empty-btn" @click="handleGoShopping">去逛逛</button>
      </div>

      <TransitionGroup name="cart-item" tag="div" class="cart-list">
        <article v-for="item in items" :key="item.id" :data-cart-id="item.id" class="cart-item">
          <label class="item-checkbox" @click="toggleSelect(item.id)">
            <span class="checkbox" :class="{ checked: selectedIds.has(item.id) }">
              <Check v-if="selectedIds.has(item.id)" :size="14" />
            </span>
          </label>
          
          <div class="item-image">
            <img :src="item.product?.image || '/picture/yejiaxuefei.png'" :alt="item.product?.name || '咖啡商品'" loading="lazy" />
          </div>
          
          <div class="item-info">
            <h4 class="item-name">{{ item.product?.name || '咖啡商品' }}</h4>
            <span class="item-category">{{ getItemCategory(item) }}</span>
            <span class="item-weight">{{ item.product?.weight || '' }}</span>
          </div>
          
          <div class="item-price">
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ item.product?.price || 0 }}</span>
          </div>
          
          <div class="item-quantity">
            <button class="qty-btn" @click="updateQuantity(item, -1)">
              <Minus :size="14" />
            </button>
            <span class="qty-value" :class="{ animating: isAnimating }">{{ item.quantity || 1 }}</span>
            <button class="qty-btn" @click="updateQuantity(item, 1)">
              <Plus :size="14" />
            </button>
          </div>
          
          <div class="item-subtotal">
            <span class="subtotal-label">小计</span>
            <span class="subtotal-value">¥{{ getItemSubtotal(item).toFixed(2) }}</span>
          </div>
          
          <button class="item-delete" @click="removeItem(item.id)">
            <Delete :size="16" />
          </button>
        </article>
      </TransitionGroup>
    </div>

    <div class="cart-footer">
      <div class="price-breakdown">
        <div class="price-row">
          <span>咖啡豆小计</span>
          <span>¥{{ beanTotal.toFixed(2) }}</span>
        </div>
        <div class="price-row">
          <span>器具小计</span>
          <span>¥{{ equipmentTotal.toFixed(2) }}</span>
        </div>
        <div class="price-row shipping">
          <span>运费</span>
          <span :class="{ free: shippingFee === 0 }">{{ shippingFee === 0 ? '免运费' : `¥${shippingFee}` }}</span>
        </div>
        <div class="price-divider"></div>
        <div class="price-row total">
          <span>合计</span>
          <div class="total-price">
            <span class="total-symbol">¥</span>
            <span class="total-value">{{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <div class="checkout-area">
        <div class="selected-info">
          <span>已选 <strong>{{ selectedIds.size }}</strong> 件商品</span>
        </div>
        <button class="checkout-btn" :class="{ disabled: selectedIds.size === 0 }" @click="handleCheckout">
          <span>去结算</span>
          <span class="checkout-price">¥{{ finalTotal.toFixed(2) }}</span>
        </button>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="showToast" class="cart-toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.profile-cart {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(58, 40, 27, 0.06);
  position: relative;
}

.profile-cart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.02;
  pointer-events: none;
  z-index: 1;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-line);
  background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%);
}

.cart-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-title h3 {
  font-size: var(--fs-h3);
  font-family: var(--font-display);
  color: var(--color-primary);
  margin: 0;
}

.cart-count {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(58, 40, 27, 0.1);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 500;
}

.cart-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text);
  transition: color 0.2s ease;
}

.select-all:hover {
  color: var(--color-primary);
}

.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--color-line);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.delete-selected {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  background: rgba(255, 100, 100, 0.08);
  color: #FF6464;
  font-size: 13px;
  transition: all 0.2s ease;
}

.delete-selected:hover {
  background: rgba(255, 100, 100, 0.15);
}

.cart-body {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.cart-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(200,184,168,.08);
  border-radius: var(--radius-md);
}

.skeleton-thumb {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(200,184,168,0.24) 25%, rgba(248,245,240,0.9) 37%, rgba(200,184,168,0.24) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.3s ease infinite;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  height: 16px;
  width: 60%;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(200,184,168,0.24) 25%, rgba(248,245,240,0.9) 37%, rgba(200,184,168,0.24) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.3s ease infinite;
}

.skeleton-meta {
  height: 12px;
  width: 40%;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(200,184,168,0.24) 25%, rgba(248,245,240,0.9) 37%, rgba(200,184,168,0.24) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.3s ease infinite;
}

.skeleton-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(200,184,168,0.24) 25%, rgba(248,245,240,0.9) 37%, rgba(200,184,168,0.24) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.3s ease infinite;
}

.skeleton-text {
  width: 30px;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(200,184,168,0.24) 25%, rgba(248,245,240,0.9) 37%, rgba(200,184,168,0.24) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.3s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(200, 184, 168, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-secondary);
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0;
}

.empty-btn {
  margin-top: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(58, 40, 27, 0.2);
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 32px 80px 1fr 80px 100px 80px 32px;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-md);
  border: 1px solid rgba(200, 184, 168, 0.2);
  transition: all 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(58, 40, 27, 0.08);
  border-color: rgba(200, 184, 168, 0.4);
}

.item-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(200,184,168,.18), rgba(248,245,240,.9));
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
  line-height: 1.4;
}

.item-category {
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(200, 184, 168, 0.15);
  color: var(--color-muted);
  font-size: 11px;
  width: fit-content;
}

.item-weight {
  font-size: 12px;
  color: var(--color-muted);
}

.item-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.price-symbol {
  font-size: 12px;
  color: var(--color-muted);
}

.price-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'SF Mono', monospace;
}

.item-quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid rgba(58,40,27,.12);
  background: #fff;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: rgba(200,184,168,.15);
  border-color: var(--color-secondary);
  transform: scale(1.08);
}

.qty-btn:active {
  transform: scale(0.95);
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'SF Mono', monospace;
  transition: transform 0.2s ease;
}

.qty-value.animating {
  transform: scale(1.2);
}

.item-subtotal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.subtotal-label {
  font-size: 11px;
  color: var(--color-muted);
}

.subtotal-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'SF Mono', monospace;
}

.item-delete {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 100, 100, 0.08);
  color: #FF6464;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.item-delete:hover {
  opacity: 1;
  background: rgba(255, 100, 100, 0.15);
  transform: scale(1.1);
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 24px;
  border-top: 1px solid var(--color-line);
  background: linear-gradient(0deg, rgba(255,255,255,0.3) 0%, transparent 100%);
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.price-row span:first-child {
  color: var(--color-muted);
}

.price-row span:last-child {
  color: var(--color-text);
  font-family: 'SF Mono', monospace;
}

.price-row.shipping {
  color: var(--color-muted);
}

.price-row.shipping .free {
  color: #64B432;
}

.price-divider {
  height: 1px;
  background: var(--color-line);
  margin: 8px 0;
}

.price-row.total {
  font-size: 16px;
}

.price-row.total span:first-child {
  color: var(--color-primary);
  font-weight: 500;
}

.total-price {
  display: flex;
  align-items: baseline;
}

.total-symbol {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
}

.total-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  font-family: 'SF Mono', monospace;
  letter-spacing: -0.02em;
}

.checkout-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.selected-info {
  font-size: 13px;
  color: var(--color-muted);
}

.selected-info strong {
  color: var(--color-primary);
}

.checkout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #3A281B 0%, #5C4033 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.checkout-btn:hover:not(.disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(58, 40, 27, 0.3);
}

.checkout-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkout-price {
  font-family: 'SF Mono', monospace;
  font-size: 18px;
}

.cart-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: rgba(58, 40, 27, 0.9);
  color: #fff;
  font-size: 14px;
  border-radius: 999px;
  z-index: 1000;
}

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
  height: 0;
  padding: 0;
  margin: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

@media (max-width: 960px) {
  .cart-item {
    grid-template-columns: 32px 64px 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "checkbox image info"
      "checkbox price quantity"
      "checkbox subtotal delete";
    gap: 8px;
  }
  
  .item-checkbox { grid-area: checkbox; }
  .item-image { grid-area: image; width: 64px; height: 64px; }
  .item-info { grid-area: info; }
  .item-price { grid-area: price; justify-content: flex-start; }
  .item-quantity { grid-area: quantity; justify-content: flex-end; }
  .item-subtotal { grid-area: subtotal; align-items: flex-start; }
  .item-delete { grid-area: delete; justify-self: flex-end; }
  
  .cart-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .checkout-area {
    align-items: stretch;
  }
  
  .checkout-btn {
    justify-content: center;
  }
}
</style>