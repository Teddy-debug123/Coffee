<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElEmpty, ElCard, ElImage, ElIcon, ElCheckbox } from 'element-plus'
import { ShoppingCart as CartIcon, Delete, Minus, Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 购物车商品列表（模拟数据）
const cartItems = ref([
  {
    id: 1,
    name: '埃塞俄比亚 耶加雪菲',
    origin: '埃塞俄比亚',
    price: 128,
    quantity: 2,
    weight: '250g',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=premium%20ethiopian%20coffee%20beans%20in%20elegant%20packaging%20minimalist%20style%20warm%20tones&image_size=square'
  },
  {
    id: 2,
    name: '哥伦比亚 慧兰',
    origin: '哥伦比亚',
    price: 98,
    quantity: 1,
    weight: '250g',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=colombian%20huila%20coffee%20beans%20premium%20packaging%20coffee%20shop%20aesthetic&image_size=square'
  },
  {
    id: 3,
    name: '云南 普洱咖啡豆',
    origin: '中国云南',
    price: 68,
    quantity: 3,
    weight: '250g',
    image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=yunnan%20chinese%20coffee%20beans%20traditional%20packaging%20warm%20earth%20tones&image_size=square'
  }
])

// 全选状态
const selectAll = ref(false)

// 计算总价
const totalPrice = ref(0)

const calculateTotal = () => {
  totalPrice.value = cartItems.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
}

calculateTotal()

// 减少数量
const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    calculateTotal()
  }
}

// 增加数量
const increaseQuantity = (item) => {
  item.quantity++
  calculateTotal()
}

// 删除商品
const removeItem = (id) => {
  const index = cartItems.value.findIndex(item => item.id === id)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    calculateTotal()
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
}

// 去结算
const checkout = () => {
  if (cartItems.value.length === 0) {
    return
  }
  router.push('/profile')
}
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <ElIcon :size="28" color="#8B7355">
              <CartIcon />
            </ElIcon>
          </div>
          <div class="header-text">
            <h1>购物车</h1>
            <p class="subtitle">共 {{ cartItems.length }} 件商品</p>
          </div>
        </div>
      </div>

      <div class="cart-content">
        <div class="cart-list">
          <div v-if="cartItems.length > 0" class="cart-header">
            <ElCheckbox v-model="selectAll" @change="toggleSelectAll" />
            <span>全选</span>
          </div>

          <div v-if="cartItems.length > 0">
            <ElCard 
              v-for="item in cartItems" 
              :key="item.id" 
              class="cart-item-card"
            >
              <div class="cart-item">
                <ElCheckbox />
                <div class="item-image">
                  <ElImage :src="item.image" :alt="item.name" fit="cover" />
                </div>
                <div class="item-info">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-origin">{{ item.origin }} · {{ item.weight }}</p>
                  <div class="item-price">¥{{ item.price }}</div>
                </div>
                <div class="item-actions">
                  <div class="quantity-control">
                    <button class="qty-btn" @click="decreaseQuantity(item)">
                      <Minus :size="16" />
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button class="qty-btn" @click="increaseQuantity(item)">
                      <Plus :size="16" />
                    </button>
                  </div>
                  <div class="item-total">¥{{ item.price * item.quantity }}</div>
                  <button class="delete-btn" @click="removeItem(item.id)">
                    <Delete :size="18" />
                  </button>
                </div>
              </div>
            </ElCard>
          </div>

          <div v-else class="empty-cart">
            <ElEmpty description="购物车是空的" />
            <ElButton class="continue-shopping" @click="router.push('/home')">
              去逛逛
            </ElButton>
          </div>
        </div>

        <div v-if="cartItems.length > 0" class="cart-summary">
          <div class="summary-card">
            <div class="summary-header">
              <h3>订单摘要</h3>
            </div>
            <div class="summary-row">
              <span>商品数量</span>
              <span>{{ cartItems.reduce((sum, item) => sum + item.quantity, 0) }} 件</span>
            </div>
            <div class="summary-row">
              <span>运费</span>
              <span class="free">免运费</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-total">
              <span>合计</span>
              <span class="total-price">¥{{ totalPrice }}</span>
            </div>
            <ElButton class="checkout-btn" @click="checkout">
              去结算
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: 2rem 0;
}

.page-header {
  background: var(--bg-card);
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h1 {
  font-size: 1.75rem;
  font-weight: 300;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.cart-item-card {
  margin-bottom: 1rem;
  border: none;
  border-radius: var(--radius-lg);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
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
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-origin {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
}

.item-price {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--coffee-primary);
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: var(--radius-md);
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.qty-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-weight: 500;
  color: var(--text-primary);
}

.item-total {
  font-size: 1rem;
  font-weight: 600;
  color: var(--coffee-primary);
}

.delete-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.delete-btn:hover {
  background: var(--bg-secondary);
  color: var(--error);
}

.empty-cart {
  text-align: center;
  padding: 4rem 0;
}

.continue-shopping {
  margin-top: 1.5rem;
  background: var(--coffee-primary);
  color: #fff;
  border: none;
}

.continue-shopping:hover {
  background: var(--coffee-secondary);
}

.summary-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 2rem;
}

.summary-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.summary-row .free {
  color: var(--success);
}

.summary-divider {
  height: 1px;
  background: var(--bg-secondary);
  margin: 0.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.summary-total span:first-child {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--coffee-primary);
}

.checkout-btn {
  width: 100%;
  background: var(--coffee-primary);
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-top: 1rem;
}

.checkout-btn:hover {
  background: var(--coffee-secondary);
}

@media (max-width: 960px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .item-actions {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid var(--bg-secondary);
  }
}
</style>