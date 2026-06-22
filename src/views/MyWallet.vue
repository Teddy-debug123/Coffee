<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CreditCard, Star } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'

const router = useRouter()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)

const userInfo = {
  balance: 128.50,
  points: 2680,
  pointsDesc: '可兑换咖啡豆周边'
}

const coupons = [
  { title: '新人券包', meta: '满 199 减 20', value: 20 },
  { title: '会员专属券', meta: '满 399 减 50', value: 50 }
]
</script>

<template>
  <div class='wallet-page'>
    <NavBar @toggle-menu='isMenuOpen = true' @toggle-cart='isCartOpen = true' />
    <SideMenu :is-open='isMenuOpen' @close='isMenuOpen = false' />
    <CartSidebar :is-open='isCartOpen' @close='isCartOpen = false' />
    <section class='container page-header'>
      <div class='header-content'>
        <div class='icon-wrapper'><CreditCard :size='28' /></div>
        <div class='header-text'>
          <h1>我的钱包</h1>
          <p class='subtitle'>余额与优惠券管理</p>
        </div>
      </div>
    </section>
    <section class='container wallet-content'>
      <div class='balance-card card'>
        <div class='balance-header'>
          <CreditCard :size='24' />
          <span>账户余额</span>
        </div>
        <div class='balance-amount'>{{ userInfo.balance }}</div>
        <div class='balance-actions'>
          <button class='balance-btn'>充值</button>
          <button class='balance-btn'>提现</button>
        </div>
      </div>
      <div class='points-card-section card'>
        <div class='points-header'>
          <Star :size='20' />
          <span>我的积分</span>
        </div>
        <div class='points-amount'>{{ userInfo.points }}</div>
        <p class='points-desc'>{{ userInfo.pointsDesc }}</p>
      </div>
      <div class='coupon-list'>
        <h4 class='coupon-title'>我的优惠券</h4>
        <article v-for='(item, index) in coupons' :key='index' class='coupon-card card'>
          <div class='coupon-left'>
            <span class='coupon-value'>{{ item.value }}</span>
            <span class='coupon-condition'>{{ item.meta }}</span>
          </div>
          <div class='coupon-right'>
            <h5>{{ item.title }}</h5>
            <span class='coupon-expire'>有效期至 2026-12-31</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.wallet-page{min-height:100vh;background:var(--color-bg);}
.page-header{padding:28px;margin-top:96px;margin-bottom:24px;}
.header-content{display:flex;align-items:center;gap:16px;}
.icon-wrapper{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:rgba(200,184,168,.16);color:var(--color-primary);}
.header-text h1{font-size:var(--fs-h2);color:var(--color-primary);}
.subtitle{color:var(--color-muted);font-size:var(--fs-small);}
.wallet-content{padding-bottom:64px;display:flex;flex-direction:column;gap:20px;}
.balance-card{padding:32px;text-align:center;}
.balance-header{display:flex;align-items:center;justify-content:center;gap:8px;color:var(--color-muted);font-size:var(--fs-body);margin-bottom:16px;}
.balance-amount{font-size:48px;font-weight:700;color:var(--color-primary);margin-bottom:24px;}
.balance-actions{display:flex;gap:16px;justify-content:center;}
.balance-btn{padding:12px 24px;border-radius:8px;background:var(--color-primary);color:#fff;font-size:var(--fs-body);}
.points-card-section{padding:24px;}
.points-header{display:flex;align-items:center;gap:8px;color:var(--color-primary);font-size:var(--fs-body);font-weight:600;margin-bottom:12px;}
.points-amount{font-size:32px;font-weight:700;color:var(--color-primary);margin-bottom:8px;}
.points-desc{color:var(--color-muted);font-size:var(--fs-small);margin:0;}
.coupon-title{font-size:var(--fs-h3);color:var(--color-primary);margin-bottom:16px;}
.coupon-card{display:grid;grid-template-columns:120px 1fr;gap:16px;padding:0;overflow:hidden;border-radius:12px;}
.coupon-left{background:linear-gradient(135deg,rgba(58,40,27,.1),rgba(58,40,27,.05));display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;border-right:1px dashed var(--color-line);}
.coupon-value{font-size:32px;font-weight:700;color:var(--color-primary);}
.coupon-condition{font-size:var(--fs-small);color:var(--color-muted);margin-top:4px;}
.coupon-right{padding:20px;display:flex;flex-direction:column;justify-content:center;}
.coupon-right h5{font-size:var(--fs-body);color:var(--color-primary);margin:0 0 8px;}
.coupon-expire{font-size:var(--fs-small);color:var(--color-muted);}
</style>