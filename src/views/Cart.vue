<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ShoppingCart, Delete, Minus, Plus, Check, 
  MapLocation, Edit, Upload, ArrowRight, ArrowDown
} from '@element-plus/icons-vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const selectAll = ref(false)
const selectedIds = ref(new Set())
const isAnimating = ref(false)
const deletingId = ref(null)
const collapsed = ref(false)

const cartItems = computed(() => cartStore.items || [])
const selectedItems = computed(() => cartItems.value.filter(item => selectedIds.value.has(item.id)))
const totalPrice = computed(() => selectedItems.value.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0))
const totalCount = computed(() => selectedItems.value.reduce((sum, item) => sum + item.quantity, 0))

const isCheckoutDisabled = computed(() => selectedItems.value.length === 0)

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : price
}

const syncSelection = () => {
  if (selectAll.value) {
    cartItems.value.forEach(item => selectedIds.value.add(item.id))
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    cartItems.value.forEach(item => selectedIds.value.add(item.id))
  } else {
    selectedIds.value.clear()
  }
}

const toggleItem = (itemId) => {
  if (selectedIds.value.has(itemId)) {
    selectedIds.value.delete(itemId)
  } else {
    selectedIds.value.add(itemId)
  }
  selectAll.value = selectedIds.value.size === cartItems.value.length && cartItems.value.length > 0
}

const decreaseQuantity = async (item) => {
  if (item.quantity <= 1) return
  await cartStore.updateQuantity(item.id, item.quantity - 1)
}

const increaseQuantity = async (item) => {
  if (item.quantity >= 99) return
  await cartStore.updateQuantity(item.id, item.quantity + 1)
}

const removeItem = async (id) => {
  deletingId.value = id
  await new Promise(resolve => setTimeout(resolve, 300))
  await cartStore.removeItem(id)
  selectedIds.value.delete(id)
  deletingId.value = null
}

const batchDelete = async () => {
  if (selectedItems.value.length === 0) return
  try {
    await ElMessageBox.confirm(
      `确定删除选中的 ${selectedItems.value.length} 件商品吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    for (const item of selectedItems.value) {
      await cartStore.removeItem(item.id)
    }
    selectedIds.value.clear()
    selectAll.value = false
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
    selectedIds.value.clear()
    selectAll.value = false
    ElMessage.success('购物车已清空')
  } catch {
    ElMessage.info('已取消清空')
  }
}

const checkout = () => {
  if (!selectedItems.value.length) {
    ElMessage.warning('请勾选需要购买的商品')
    return
  }
  if (!userStore.isLoggedIn) {
    router.push('/login?redirect=/cart')
    return
  }
  router.push('/checkout')
}

const getProductImage = (item) => {
  const img = item.product?.image
  if (img && img.startsWith('http')) return img
  if (img && img.includes('picture')) return img
  return '/picture/yejiaxuefei.png'
}

watch(() => cartItems.value.length, (newLen, oldLen) => {
  if (newLen === 0) {
    selectedIds.value.clear()
    selectAll.value = false
  }
})

onMounted(async () => {
  await cartStore.loadCart()
  syncSelection()
})
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header card animate-fade-in">
        <div class="header-content">
          <div class="header-text">
            <h1>购物车</h1>
            <p class="subtitle">共 {{ cartItems.length }} 件商品</p>
          </div>
        </div>
      </div>

      <div class="cart-content">
        <div class="cart-list">
          <div v-if="cartItems.length > 0" class="cart-header">
            <label class="select-all" @click="toggleSelectAll">
              <span class="custom-checkbox" :class="{ checked: selectAll }">
                <Check v-if="selectAll" :size="14" />
              </span>
              <span>全选</span>
            </label>
            <div class="header-actions">
              <button 
                class="action-btn" 
                :class="{ disabled: selectedItems.length === 0 }"
                @click="batchDelete"
              >
                <Delete :size="16" />
                <span>批量删除</span>
              </button>
              <button class="action-btn" @click="clearCart">
                <Delete :size="16" />
                <span>清空</span>
              </button>
            </div>
          </div>

          <div v-if="cartItems.length > 0" class="items-container">
            <article 
              v-for="(item, index) in cartItems" 
              :key="item.id" 
              class="cart-item-card card animate-slide-up"
              :style="{ animationDelay: `${index * 0.1}s` }"
              :class="{ 
                'selected': selectedIds.has(item.id),
                'deleting': deletingId === item.id
              }"
            >
              <div class="cart-item">
                <label class="item-check" @click="toggleItem(item.id)">
                  <span class="custom-checkbox" :class="{ checked: selectedIds.has(item.id) }">
                    <Check v-if="selectedIds.has(item.id)" :size="14" />
                  </span>
                </label>
                
                <div class="item-image">
                  <img 
                    :src="getProductImage(item)" 
                    :alt="item.product?.name || 'coffee item'" 
                    loading="lazy"
                  />
                </div>
                
                <div class="item-info">
                  <h3 class="item-name">{{ item.product?.name || '咖啡商品' }}</h3>
                  <p class="item-spec">
                    {{ item.product?.origin || '精选产地' }} · {{ item.product?.weight || item.product?.spec || '标准规格' }}
                    <span v-if="item.product?.process" class="process-tag">{{ item.product.process }}</span>
                  </p>
                  <div class="item-price">¥{{ formatPrice(item.product?.price || 0) }}</div>
                </div>
                
                <div class="item-actions">
                  <div class="quantity-control">
                    <button 
                      class="qty-btn" 
                      :class="{ disabled: item.quantity <= 1 }"
                      @click="decreaseQuantity(item)"
                    >
                      <Minus :size="14" />
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button 
                      class="qty-btn" 
                      :class="{ disabled: item.quantity >= 99 }"
                      @click="increaseQuantity(item)"
                    >
                      <Plus :size="14" />
                    </button>
                  </div>
                  <div class="item-total">¥{{ formatPrice((item.product?.price || 0) * item.quantity) }}</div>
                  <button class="delete-btn" @click="removeItem(item.id)">
                    <Delete :size="16" />
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="empty-cart card animate-fade-in">
            <div class="empty-icon">
              <ShoppingCart :size="48" />
            </div>
            <p>购物车是空的</p>
            <button class="continue-shopping btn" @click="router.push('/home')">去逛逛</button>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-summary animate-slide-in-right">
          <div class="summary-card card">
            <div class="summary-header">
              <h3>订单摘要</h3>
            </div>
            
            <div class="summary-row">
              <span>商品数量</span>
              <span>{{ totalCount }} 件</span>
            </div>
            
            <div class="summary-row">
              <span>运费</span>
              <span class="free">免运费</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-total">
              <span>合计</span>
              <span class="total-price">¥{{ formatPrice(totalPrice) }}</span>
            </div>
            
            <button 
              class="checkout-btn btn" 
              :class="{ disabled: isCheckoutDisabled }"
              @click="checkout"
            >
              <span>去结算</span>
              <ArrowRight :size="16" />
            </button>
            
            <div class="summary-extra">
              <div class="address-section">
                <div class="section-header">
                  <MapLocation :size="16" />
                  <span>收货地址</span>
                  <button class="edit-address" @click="router.push('/addresses')">
                    <Edit :size="14" />
                    <span>管理</span>
                  </button>
                </div>
                <p class="address-text">请选择收货地址</p>
              </div>
              
              <div class="enterprise-section">
                <div class="section-header">
                  <span>企业采购</span>
                  <button class="edit-enterprise">
                    <Edit :size="14" />
                    <span>编辑</span>
                  </button>
                </div>
                <p class="enterprise-text">添加企业信息可开具发票</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-footer animate-fade-in">
        <div class="footer-bar">
          <div class="footer-left">
            <span>已选 {{ totalCount }} 件</span>
            <span class="divider">|</span>
            <span>合计 <strong>¥{{ formatPrice(totalPrice) }}</strong></span>
          </div>
          <button 
            class="checkout-btn-mobile btn" 
            :class="{ disabled: isCheckoutDisabled }"
            @click="checkout"
          >
            去结算
          </button>
        </div>

        <div class="qr-code-section card">
          <div class="qr-container">
            <div class="qr-placeholder">
              <span class="qr-icon">QR</span>
            </div>
            <div class="qr-text">
              <p>扫码加客服领取咖啡豆优惠券</p>
              <p class="qr-subtext">专属客服在线解答咖啡疑问</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 24px 0;
  padding-bottom: calc(120px + 80px);
}

.page-header {
  padding: 28px;
  margin-top: 96px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-text h1 {
  font-size: var(--fs-h2);
  color: var(--color-primary);
  margin-bottom: 4px;
}

.subtitle {
  color: var(--color-muted);
  font-size: var(--fs-small);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 16px;
  color: var(--color-muted);
}

.select-all {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--color-primary);
  font-size: var(--fs-body);
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-line);
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.custom-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-text);
  font-size: var(--fs-small);
  transition: all 0.25s ease;
}

.action-btn:hover:not(.disabled) {
  background: rgba(200, 184, 168, 0.15);
  color: var(--color-primary);
}

.action-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.items-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item-card {
  margin-bottom: 0;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
}

.cart-item-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.cart-item-card.selected {
  background: rgba(58, 40, 27, 0.03);
}

.cart-item-card.deleting {
  animation: slide-out 0.3s ease-out forwards;
}

@keyframes slide-out {
  to {
    opacity: 0;
    transform: translateX(100%);
    height: 0;
    padding: 0;
    margin: 0;
  }
}

.cart-item {
  display: grid;
  grid-template-columns: auto 100px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.item-check {
  cursor: pointer;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(200, 184, 168, 0.18), rgba(248, 245, 240, 0.9));
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
  min-width: 0;
}

.item-name {
  font-size: var(--fs-h3);
  color: var(--color-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec {
  font-size: var(--fs-small);
  color: var(--color-muted);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.process-tag {
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(58, 40, 27, 0.08);
  color: var(--color-primary);
  font-size: 11px;
}

.item-price {
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--fs-price);
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  background: rgba(200, 184, 168, 0.16);
  border-radius: 999px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  color: var(--color-primary);
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(.disabled) {
  background: rgba(58, 40, 27, 0.08);
}

.qty-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  color: var(--color-primary);
}

.item-total {
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--fs-price);
}

.delete-btn {
  opacity: 0;
  transform: translateY(4px);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid var(--color-line);
  color: var(--color-muted);
  display: grid;
  place-items: center;
  transition: all 0.3s ease;
}

.cart-item-card:hover .delete-btn {
  opacity: 1;
  transform: translateY(0);
}

.delete-btn:hover {
  background: rgba(255, 100, 100, 0.08);
  color: #FF6464;
  border-color: rgba(255, 100, 100, 0.2);
}

.empty-cart {
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 40px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(200, 184, 168, 0.16);
  color: var(--color-primary);
  margin-bottom: 16px;
}

.empty-cart p {
  color: var(--color-muted);
  font-size: var(--fs-body);
}

.continue-shopping {
  margin-top: 20px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: #fff;
}

.summary-card {
  position: sticky;
  top: 108px;
  padding: 24px;
}

.summary-header h3 {
  font-size: var(--fs-h3);
  color: var(--color-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-row,
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  color: var(--color-text);
}

.free {
  color: var(--color-secondary);
}

.summary-divider {
  height: 1px;
  background: var(--color-line);
  margin: 8px 0;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.checkout-btn {
  margin-top: 16px;
  width: 100%;
  padding: 14px 18px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  justify-content: space-between;
}

.checkout-btn.disabled {
  background: var(--color-line);
  cursor: not-allowed;
}

.checkout-btn:not(.disabled):hover {
  background: #2D1F14;
}

.summary-extra {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed var(--color-line);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--color-primary);
  font-size: var(--fs-body);
}

.edit-address,
.edit-enterprise {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  color: var(--color-muted);
  font-size: var(--fs-small);
  padding: 4px 8px;
  border-radius: 4px;
}

.edit-address:hover,
.edit-enterprise:hover {
  color: var(--color-primary);
  background: rgba(200, 184, 168, 0.1);
}

.address-text,
.enterprise-text {
  font-size: var(--fs-small);
  color: var(--color-muted);
  margin: 0 0 16px;
}

.enterprise-text {
  margin-bottom: 0;
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-line);
  padding: 0 var(--page-padding);
  z-index: 100;
}

.footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-body);
  color: var(--color-text);
}

.divider {
  color: var(--color-line);
}

.footer-left strong {
  font-size: 20px;
  color: var(--color-primary);
}

.checkout-btn-mobile {
  padding: 12px 32px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.checkout-btn-mobile.disabled {
  background: var(--color-line);
  cursor: not-allowed;
}

.qr-code-section {
  padding: 16px 24px;
  background: var(--color-bg);
  border-top: 1px solid var(--color-line);
  border-bottom: none;
  border-radius: 0;
}

.qr-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.qr-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #fff;
  border: 2px dashed var(--color-line);
  display: grid;
  place-items: center;
  color: var(--color-muted);
}

.qr-icon {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
}

.qr-text {
  flex: 1;
}

.qr-text p {
  margin: 0;
  font-size: var(--fs-body);
  color: var(--color-primary);
}

.qr-subtext {
  font-size: var(--fs-small);
  color: var(--color-muted) !important;
  margin-top: 4px !important;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slide-up 0.4s ease-out forwards;
}

.animate-slide-in-right {
  opacity: 0;
  animation: slide-in-right 0.4s ease-out forwards;
  animation-delay: 0.3s;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-summary {
    display: none;
  }
  
  .cart-footer {
    padding: 0 20px;
  }
  
  .qr-code-section {
    padding: 12px 16px;
  }
}

@media (min-width: 1025px) {
  .cart-footer {
    display: none;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: auto 80px 1fr;
    gap: 12px;
    padding: 16px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-actions {
    grid-column: span 3;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid rgba(200, 184, 168, 0.2);
    margin-top: 8px;
  }
  
  .item-total {
    order: 2;
  }
  
  .delete-btn {
    opacity: 1;
    transform: none;
    order: 3;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 6px;
  }
  
  .action-btn {
    padding: 6px 10px;
  }
}
</style>