<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Coffee, Document } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'

const router = useRouter()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const orderFilter = ref('all')

const orderFilters = [
  { value: 'all', label: '全部' },
  { value: 'pending_payment', label: '待付款' },
  { value: 'pending_shipment', label: '待发货' },
  { value: 'completed', label: '已完成' },
  { value: 'after_sale', label: '售后' }
]

const orders = [
  { id: 1, title: '埃塞俄比亚 耶加雪菲', roastDate: '2026-06-15', spec: '250g', flavor: '花香', status: '待发货', meta: '订单号 20260616001', price: '128', shipping: '预计送达', image: '/picture/yejiaxuefei.png' }
]

const filteredOrders = computed(() => orders)
</script>

<template>
  <div class='orders-page'>
    <NavBar @toggle-menu='isMenuOpen = true' @toggle-cart='isCartOpen = true' />
    <SideMenu :is-open='isMenuOpen' @close='isMenuOpen = false' />
    <CartSidebar :is-open='isCartOpen' @close='isCartOpen = false' />
    <section class='container'><h1>我的订单</h1></section>
  </div>
</template>

<style scoped>
.orders-page{min-height:100vh;background:var(--color-bg);}
</style>