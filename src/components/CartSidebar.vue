<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, ShoppingCart, Plus, Minus, Delete, Check, ArrowRight } from '@element-plus/icons-vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const props = defineProps({ isOpen: { type: Boolean, default: false } })
const emit = defineEmits(['close'])
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const selectedItems = ref(new Set())
const allSelected = ref(false)
const deletingId = ref(null)
const animatingItems = ref(new Set())

const items = computed(() => cartStore.items)
const totalCount = computed(() => cartStore.totalCount)

const selectedTotal = computed(() => {
  let total = 0
  items.value.forEach(item => {
    if (selectedItems.value.has(item.id)) {
      const price = typeof item.product?.price === 'number' ? item.product.price : 0
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1
      total += price * quantity
    }
  })
  return total
})

const selectedCount = computed(() => {
  let count = 0
  items.value.forEach(item => {
    if (selectedItems.value.has(item.id)) {
      count += (item.quantity || 1)
    }
  })
  return count
})

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : price
}

const handleCheckout = () => {
  if (!userStore.isLoggedIn) {
    router.push('/login?redirect=/cart')
    return
  }
  if (selectedItems.value.size === 0) {
    ElMessage.warning('请勾选需要购买的商品')
    return
  }
  router.push('/checkout')
}

const updateQuantity = async (item, delta) => {
  if (delta === -1 && (item.quantity || 1) <= 1) return
  if (delta === 1 && (item.quantity || 1) >= 99) return
  await cartStore.updateQuantity(item.id, Number(item.quantity || 0) + delta)
}

const toggleSelect = (itemId) => {
  if (selectedItems.value.has(itemId)) {
    selectedItems.value.delete(itemId)
  } else {
    selectedItems.value.add(itemId)
  }
  allSelected.value = selectedItems.value.size === items.value.length && items.value.length > 0
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value.clear()
  } else {
    items.value.forEach(item => selectedItems.value.add(item.id))
  }
  allSelected.value = !allSelected.value
}

const removeSelected = async () => {
  if (selectedItems.value.size === 0) return
  try {
    await ElMessageBox.confirm(
      `确定删除选中的 ${selectedItems.value.size} 件商品吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    for (const id of selectedItems.value) {
      deletingId.value = id
      await new Promise(resolve => setTimeout(resolve, 200))
      await cartStore.removeItem(id)
    }
    selectedItems.value.clear()
    allSelected.value = false
    deletingId.value = null
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const clearCart = async () => {
  try {
    await ElMessageBox.confirm(
      '确定清空购物车所有商品吗？',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await cartStore.clearAll()
    selectedItems.value.clear()
    allSelected.value = false
    ElMessage.success('购物车已清空')
  } catch {
    ElMessage.info('已取消清空')
  }
}

const removeItem = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定移除这件商品吗？',
      '确认移除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    deletingId.value = id
    await new Promise(resolve => setTimeout(resolve, 300))
    await cartStore.removeItem(id)
    selectedItems.value.delete(id)
    deletingId.value = null
  } catch {
    ElMessage.info('已取消移除')
  }
}

const getProductImage = (item) => {
  const img = item.product?.image
  if (img && img.startsWith('http')) return img
  if (img && img.includes('picture')) return img
  return '/picture/yejiaxuefei.png'
}

const handleItemClick = (item) => {
  emit('close')
  const productType = item.product?.category || item.product?.type
  if (productType === '咖啡机' || productType === '冲煮器具' || productType === '研磨器具' || productType === '杯具' || productType === '辅助器具') {
    router.push(`/tool/detail/${item.product?.id}`)
  } else {
    router.push(`/product/${item.product?.id}`)
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    items.value.forEach((_, index) => {
      setTimeout(() => {
        animatingItems.value.add(index)
      }, index * 80)
    })
  } else {
    document.body.style.overflow = ''
    animatingItems.value.clear()
  }
})

watch(items, () => {
  allSelected.value = selectedItems.value.size === items.value.length && items.value.length > 0
})

onMounted(() => {
  if (props.isOpen) {
    items.value.forEach((_, index) => {
      setTimeout(() => {
        animatingItems.value.add(index)
      }, index * 80)
    })
  }
})
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="overlay" @click.self="emit('close')">
      <aside class="sidebar animate-slide-in-right">
        <div class="header animate-fade-in">
          <div class="header-left">
            <div class="cart-icon-wrapper">
              <ShoppingCart :size="24" />
            </div>
            <div class="header-text">
              <h3>购物车</h3>
              <p class="item-count">共 {{ items.length }} 件商品</p>
            </div>
          </div>
          <button class="close" @click="emit('close')">
            <Close :size="20" />
          </button>
        </div>

        <div v-if="items.length > 0" class="cart-header animate-fade-in" style="animation-delay: 0.1s;">
          <label class="select-all" @click="toggleSelectAll">
            <span class="custom-checkbox" :class="{ checked: allSelected }">
              <Check v-if="allSelected" :size="14" />
            </span>
            <span>全选</span>
          </label>
          <div class="cart-actions">
            <button 
              class="cart-action-btn" 
              :class="{ disabled: selectedItems.size === 0 }"
              @click="removeSelected"
            >
              <Delete :size="14" />
              <span>批量删除</span>
            </button>
            <button class="cart-action-btn" @click="clearCart">
              <Delete :size="14" />
              <span>清空</span>
            </button>
          </div>
        </div>

        <div class="items">
          <div v-if="!items.length" class="empty animate-fade-in">
            <div class="empty-icon">
              <ShoppingCart :size="48" />
            </div>
            <h3>购物车空空如也</h3>
            <p>挑选季节限定咖啡豆</p>
            <button class="empty-action-btn" @click="router.push('/home')">去选购</button>
          </div>

          <article 
            v-for="(item, index) in items" 
            :key="item.id" 
            class="item"
            :class="{ 
              'selected': selectedItems.has(item.id),
              'deleting': deletingId === item.id,
              'animate-slide-up': animatingItems.has(index)
            }"
            :style="{ animationDelay: `${index * 0.08}s` }"
            @click="handleItemClick(item)"
          >
            <label class="item-checkbox" @click.stop="toggleSelect(item.id)">
              <span class="custom-checkbox" :class="{ checked: selectedItems.has(item.id) }">
                <Check v-if="selectedItems.has(item.id)" :size="14" />
              </span>
            </label>
            <div class="thumb">
              <img 
                :src="getProductImage(item)" 
                :alt="item.product?.name || 'coffee item'" 
                loading="lazy"
              />
            </div>
            <div class="meta">
              <h4>{{ item.product?.name || '咖啡商品' }}</h4>
              <p class="item-spec">
                {{ item.product?.origin || item.product?.category || '精选产地' }} · {{ item.product?.weight || item.product?.spec || '标准规格' }}
              </p>
              <span class="item-price">¥{{ formatPrice(item.product?.price || 0) }}</span>
            </div>
            <div class="quantity">
              <button 
                @click.stop="updateQuantity(item, -1)" 
                :class="{ disabled: (item.quantity || 1) <= 1 }"
              >
                <Minus :size="14" />
              </button>
              <span>{{ item.quantity || 1 }}</span>
              <button 
                @click.stop="updateQuantity(item, 1)"
                :class="{ disabled: (item.quantity || 1) >= 99 }"
              >
                <Plus :size="14" />
              </button>
            </div>
            <div class="subtotal">
              <span>¥{{ formatPrice((item.product?.price || 0) * (item.quantity || 1)) }}</span>
            </div>
            <button class="delete-btn" @click.stop="removeItem(item.id)">
              <Delete :size="16" />
            </button>
          </article>
        </div>

        <div v-if="items.length > 0" class="footer">
          <div class="footer-left animate-fade-in" style="animation-delay: 0.3s;">
            <span>已选 {{ selectedCount }} 件</span>
            <span class="divider">|</span>
            <span>合计 <strong>¥{{ formatPrice(selectedTotal) }}</strong></span>
          </div>
          <button 
            class="checkout animate-fade-in" 
            :class="{ disabled: selectedItems.size === 0 }" 
            @click="handleCheckout"
            style="animation-delay: 0.35s;"
          >
            <span>去结算</span>
            <span class="checkout-arrow">
              <ArrowRight :size="16" />
            </span>
          </button>
          <div class="qr-code-section animate-fade-in" style="animation-delay: 0.4s;">
            <div class="qr-code-container">
              <div class="qr-placeholder">
                <span class="qr-icon">QR</span>
              </div>
              <p class="qr-text">扫码加客服领取咖啡豆优惠券</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(45, 31, 20, 0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 1100;
  backdrop-filter: blur(6px);
}

.sidebar {
  width: min(420px, 100%);
  height: 100%;
  background: #F5F0E8;
  border-radius: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-shadow: -8px 0 30px rgba(45, 31, 20, 0.15);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(184, 169, 153, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(58, 40, 27, 0.08);
  color: #4A3C31;
}

.header-text h3 {
  font-size: 20px;
  font-weight: 700;
  color: #4A3C31;
  margin: 0;
}

.item-count {
  font-size: 13px;
  color: #B8A999;
  margin: 4px 0 0;
}

.close {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(184, 169, 153, 0.15);
  border: none;
  color: #4A3C31;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close:hover {
  background: rgba(58, 40, 27, 0.12);
  transform: rotate(90deg);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #4A3C31;
  cursor: pointer;
  font-weight: 500;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #B8A999;
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.custom-checkbox.checked {
  background: #59473A;
  border-color: #59473A;
  color: #fff;
  transform: scale(1.05);
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.cart-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(184, 169, 153, 0.4);
  background: rgba(255, 255, 255, 0.6);
  color: #4A3C31;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.cart-action-btn:hover:not(:disabled) {
  background: rgba(58, 40, 27, 0.06);
  transform: translateY(-1px);
}

.cart-action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.items {
  flex: 1;
  overflow: auto;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #B8A999;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(184, 169, 153, 0.15);
  color: #4A3C31;
}

.empty h3 {
  font-size: 17px;
  font-weight: 500;
  color: #4A3C31;
  margin: 0;
}

.empty p {
  margin: 0;
  font-size: 13px;
}

.empty-action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  background: #59473A;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  opacity: 0.92;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 40, 27, 0.2);
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(184, 169, 153, 0.25);
  transition: all 0.35s ease-out;
  cursor: pointer;
  flex-wrap: nowrap;
  overflow: hidden;
}

.item:hover {
  box-shadow: 0 6px 20px rgba(58, 40, 27, 0.1);
  transform: translateY(-3px);
}

.item.selected {
  background: rgba(58, 40, 27, 0.06);
  border-color: rgba(58, 40, 27, 0.25);
}

.item.deleting {
  animation: slide-out-right 0.35s ease-out forwards;
}

@keyframes slide-out-right {
  to {
    opacity: 0;
    transform: translateX(100%);
    height: 0;
    padding: 0;
    margin: 0;
    gap: 0;
  }
}

.item-checkbox {
  cursor: pointer;
}

.thumb {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(184, 169, 153, 0.15), rgba(248, 245, 240, 0.95));
  flex-shrink: 0;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.meta h4 {
  font-size: 15px;
  font-weight: 600;
  color: #4A3C31;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec {
  font-size: 12px;
  color: #B8A999;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: #59473A;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  background: #F5F0E8;
  border-radius: 10px;
  border: 1px solid rgba(184, 169, 153, 0.3);
}

.quantity button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  color: #4A3C31;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.quantity button:hover:not(:disabled) {
  background: rgba(58, 40, 27, 0.08);
  transform: scale(1.05);
}

.quantity button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.quantity span {
  font-size: 14px;
  font-weight: 700;
  color: #4A3C31;
  min-width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.subtotal {
  font-size: 15px;
  font-weight: 700;
  color: #59473A;
  min-width: 65px;
  text-align: right;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.delete-btn {
  opacity: 0;
  transform: translateY(4px);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 100, 100, 0.05);
  border: 1px solid rgba(255, 100, 100, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #B8A999;
  transition: all 0.35s ease;
  flex-shrink: 0;
}

.item:hover .delete-btn {
  opacity: 1;
  transform: translateY(0);
}

.delete-btn:hover {
  background: rgba(255, 100, 100, 0.12);
  color: #FF6464;
  border-color: rgba(255, 100, 100, 0.3);
}

.footer {
  padding-top: 20px;
  border-top: 1px solid rgba(184, 169, 153, 0.3);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #6B5B4F;
}

.divider {
  color: rgba(184, 169, 153, 0.5);
}

.footer-left strong {
  font-size: 20px;
  color: #4A3C31;
  font-weight: 700;
}

.checkout {
  width: 100%;
  padding: 16px 20px;
  border-radius: 14px;
  background: #59473A;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.35s ease;
  gap: 12px;
}

.checkout:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(58, 40, 27, 0.3);
}

.checkout:hover:not(:disabled) .checkout-arrow {
  transform: translateX(4px);
}

.checkout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkout-arrow {
  transition: transform 0.35s ease;
}

.qr-code-section {
  margin-top: 8px;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid rgba(184, 169, 153, 0.3);
  background: rgba(255, 255, 255, 0.6);
  animation: breathing 6s ease-in-out infinite;
}

.qr-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(184, 169, 153, 0.12);
  display: grid;
  place-items: center;
  color: #B8A999;
}

.qr-icon {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
}

.qr-text {
  font-size: 12px;
  color: #B8A999;
  margin: 0;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes breathing {
  0%, 100% {
    opacity: 0.92;
    background: rgba(255, 255, 255, 0.6);
  }
  50% {
    opacity: 1;
    background: rgba(255, 255, 255, 0.75);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-up {
  opacity: 0;
  animation: slide-up 0.4s ease-out forwards;
}

.animate-slide-in-right {
  opacity: 0;
  animation: slide-in-right 0.4s ease-out forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.3s ease-out forwards;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .sidebar,
.slide-leave-to .sidebar {
  transform: translateX(100%);
}
</style>