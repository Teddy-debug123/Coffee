<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MapLocation, Edit, Plus, Delete, Check, ShoppingCart, ArrowRight, User, Phone, CreditCard, PriceTag, Present, OfficeBuilding } from '@element-plus/icons-vue'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const addresses = ref([
  { id: 1, name: '张三', phone: '138****8888', province: '浙江省', city: '杭州市', district: '西湖区', detail: '88号HOHO大厦1001室', isDefault: true },
  { id: 2, name: '李四', phone: '139****9999', province: '上海市', city: '浦东新区', district: '陆家嘴', detail: '环路1000号环球金融中心', isDefault: false }
])

const enterprises = ref([
  { id: 1, name: '浙江咖啡贸易有限公司', taxId: '91110105MA01234567', invoiceTitle: '浙江咖啡贸易有限公司', isDefault: true }
])

const selectedAddressId = ref(1)
const selectedEnterpriseId = ref(null)
const showAddressModal = ref(false)
const showEnterpriseModal = ref(false)
const isSubmitting = ref(false)

const cartItems = computed(() => cartStore.items || [])
const totalCount = computed(() => cartItems.value.reduce((sum, item) => sum + (item.quantity || 0), 0))
const totalPrice = computed(() => cartItems.value.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0))

const formatPrice = (price) => {
  return typeof price === 'number' ? price.toFixed(2) : price
}

const getProductImage = (item) => {
  const img = item.product?.image
  if (img && img.startsWith('http')) return img
  if (img && img.includes('picture') && img.endsWith('.png')) return img
  return '/picture/slide-1.png'
}

const submitOrder = async () => {
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  isSubmitting.value = true
  try {
    await ElMessageBox.confirm(`确认订单金额 ${formatPrice(totalPrice.value)}`, '确认支付', {
      confirmButtonText: '确认支付',
      cancelButtonText: '返回修改',
      type: 'info'
    })
    await cartStore.clearAll()
    ElMessage.success('订单提交成功')
    setTimeout(() => router.push('/orders'), 1500)
  } catch {
    ElMessage.info('已取消支付')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (userStore.isLoggedIn && !cartStore.isLoaded) {
    await cartStore.loadCart()
  }
})
</script>

<template>
  <div class="checkout-page">
    <div class="container">
      <div class="page-header card animate-fade-in">
        <div class="header-content">
          <div class="icon-wrapper">
            <ShoppingCart :size="24" />
          </div>
          <div class="header-text">
            <h1>确认订单</h1>
            <p class="subtitle">共 {{ totalCount }} 件商品</p>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <div class="checkout-left">
          <div class="section card animate-slide-up">
            <div class="section-header">
              <MapLocation :size="18" class="section-icon" style="width: 18px; height: 18px;" />
              <span>收货地址</span>
              <button class="edit-btn" @click="showAddressModal = true">
                <Edit :size="12" style="width: 12px; height: 12px;" />
                <span>管理</span>
              </button>
            </div>
            <div class="address-list">
              <div 
                v-for="addr in addresses" 
                :key="addr.id" 
                class="address-item"
                :class="{ selected: selectedAddressId === addr.id }"
                @click="selectedAddressId = addr.id"
              >
                <div class="address-radio">
                  <div class="radio-circle" :class="{ checked: selectedAddressId === addr.id }">
                    <Check v-if="selectedAddressId === addr.id" :size="14" />
                  </div>
                </div>
                <div class="address-info">
                  <div class="address-header">
                    <span class="address-name">{{ addr.name }}</span>
                    <span class="address-phone">{{ addr.phone }}</span>
                    <span v-if="addr.isDefault" class="default-tag">默认</span>
                  </div>
                  <p class="address-detail">{{ addr.province }} {{ addr.city }} {{ addr.district }} {{ addr.detail }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="section card animate-slide-up" style="animation-delay: 0.1s">
            <div class="section-header">
              <ShoppingCart :size="18" class="section-icon" style="width: 18px; height: 18px;" />
              <span>商品清单</span>
            </div>
            <div class="product-list">
              <div 
                v-for="item in cartItems" 
                :key="item.id" 
                class="product-item"
              >
                <div class="product-image">
                  <img :src="getProductImage(item)" :alt="item.product?.name" />
                </div>
                <div class="product-info">
                  <h4>{{ item.product?.name || '咖啡商品' }}</h4>
                  <p class="product-spec">
                    {{ item.product?.origin || '精选产地' }}  {{ item.product?.weight || '标准规格' }}
                  </p>
                </div>
                <div class="product-price">{{ formatPrice(item.product?.price || 0) }}</div>
                <div class="product-quantity">x{{ item.quantity }}</div>
                <div class="product-total">{{ formatPrice((item.product?.price || 0) * (item.quantity || 1)) }}</div>
              </div>
            </div>
          </div>

          <div class="section card animate-slide-up" style="animation-delay: 0.2s">
            <div class="section-header">
              <OfficeBuilding :size="18" class="section-icon" style="width: 18px; height: 18px;" />
              <span>企业采购</span>
              <button class="edit-btn" @click="showEnterpriseModal = true">
                <Edit :size="12" style="width: 12px; height: 12px;" />
                <span>编辑</span>
              </button>
            </div>
            <div v-if="selectedEnterpriseId" class="enterprise-info">
              <p class="enterprise-name">{{ enterprises.find(e => e.id === selectedEnterpriseId)?.name }}</p>
              <p class="enterprise-tax">税号: {{ enterprises.find(e => e.id === selectedEnterpriseId)?.taxId }}</p>
            </div>
            <div v-else class="enterprise-empty">
              <p class="hint">添加企业信息可开具发票</p>
            </div>
          </div>

          <div class="section card animate-slide-up" style="animation-delay: 0.3s">
            <div class="section-header">
              <PriceTag :size="18" class="section-icon" style="width: 18px; height: 18px;" />
              <span>优惠券</span>
              <ArrowRight :size="14" style="width: 14px; height: 14px;" />
            </div>
            <div class="coupon-list">
              <div class="coupon-item">
                <div class="coupon-left">
                  <span class="coupon-value">0</span>
                  <span class="coupon-condition">暂无可用优惠券</span>
                </div>
                <div class="coupon-right">
                  <Present :size="18" class="section-icon" style="width: 18px; height: 18px;" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="checkout-right">
          <div class="summary-card card animate-slide-in-right">
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
            <div class="summary-row">
              <span>优惠</span>
              <span class="discount">-0.00</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-total">
              <span>合计</span>
              <span class="total-price">{{ formatPrice(totalPrice) }}</span>
            </div>
            <button 
              class="submit-btn btn" 
              :class="{ submitting: isSubmitting }"
              @click="submitOrder"
            >
              {{ isSubmitting ? '提交中...' : '提交订单' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 24px 0;
  padding-bottom: calc(120px + 80px);
}

.checkout-page svg {
  max-width: 24px !important;
  max-height: 24px !important;
}

.page-header {
  padding: 28px;
  margin-top: 96px;
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(58, 40, 27, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7A6B5D;
}

.header-text h1 {
  font-size: var(--fs-h1);
  color: var(--color-primary);
  margin: 0;
}

.subtitle {
  font-size: var(--fs-body);
  color: var(--color-muted);
  margin: 4px 0 0;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

.checkout-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.section-header span {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--color-primary);
}

.section-icon {
  color: #7A6B5D;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  font-size: 18px;
}

.section-icon svg {
  width: 18px !important;
  height: 18px !important;
}

.checkout-page :deep(.el-icon) {
  width: 18px !important;
  height: 18px !important;
  font-size: 18px !important;
}

.edit-btn {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(58, 40, 27, 0.06);
  color: var(--color-primary);
  font-size: var(--fs-small);
  display: flex;
  align-items: center;
  gap: 4px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-item:hover {
  border-color: rgba(58, 40, 27, 0.1);
}

.address-item.selected {
  border-color: var(--color-primary);
  background: rgba(58, 40, 27, 0.04);
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.radio-circle.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.address-name {
  font-weight: 600;
  color: var(--color-primary);
}

.address-phone {
  font-size: var(--fs-body);
  color: var(--color-text);
}

.default-tag {
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(58, 40, 27, 0.08);
  color: var(--color-primary);
  font-size: var(--fs-small);
}

.address-detail {
  font-size: var(--fs-body);
  color: var(--color-text);
  margin: 0;
  line-height: 1.5;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-line);
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 4px;
}

.product-spec {
  font-size: var(--fs-small);
  color: var(--color-muted);
  margin: 0;
}

.product-price {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}

.product-quantity {
  font-size: var(--fs-body);
  color: var(--color-text);
  white-space: nowrap;
}

.product-total {
  font-size: var(--fs-body);
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.enterprise-info {
  padding: 12px;
  border-radius: 10px;
  background: rgba(58, 40, 27, 0.04);
}

.enterprise-name {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 4px;
}

.enterprise-tax {
  font-size: var(--fs-small);
  color: var(--color-muted);
  margin: 0;
}

.enterprise-empty {
  padding: 12px;
}

.hint {
  font-size: var(--fs-body);
  color: var(--color-muted);
  margin: 0;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
}

.coupon-left {
  flex: 1;
}

.coupon-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.coupon-condition {
  font-size: var(--fs-small);
  color: var(--color-muted);
  margin-left: 8px;
}

.coupon-right {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(58, 40, 27, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkout-right {
  position: sticky;
  top: 120px;
}

.summary-card {
  padding: 24px;
}

.summary-header h3 {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: var(--fs-body);
  color: var(--color-text);
}

.summary-row .free {
  color: #4CAF50;
}

.summary-row .discount {
  color: #FF6464;
}

.summary-divider {
  height: 1px;
  background: var(--color-line);
  margin: 12px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--color-primary);
}

.total-price {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--fs-h3);
  font-weight: 600;
  margin-top: 16px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(58, 40, 27, 0.3);
}

.submit-btn.submitting {
  opacity: 0.7;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in { animation: fade-in 0.4s ease-out; }
.animate-slide-up { opacity: 0; animation: slide-up 0.4s ease-out forwards; }
.animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
</style>