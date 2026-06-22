<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { MapLocation } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'

const router = useRouter()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)

const addresses = [
  { id: 1, title: '张三 138****8888', meta: '北京市朝阳区建国路 88 号', isDefault: true },
  { id: 2, title: '李四 139****9999', meta: '上海市浦东新区陆家嘴环路 1000 号', isDefault: false }
]
</script>

<template>
  <div class='addresses-page'>
    <NavBar @toggle-menu='isMenuOpen = true' @toggle-cart='isCartOpen = true' />
    <SideMenu :is-open='isMenuOpen' @close='isMenuOpen = false' />
    <CartSidebar :is-open='isCartOpen' @close='isCartOpen = false' />
    <section class='container page-header'>
      <div class='header-content'>
        <div class='icon-wrapper'><MapLocation :size='28' /></div>
        <div class='header-text'>
          <h1>收货地址</h1>
          <p class='subtitle'>管理常用配送地址</p>
        </div>
      </div>
    </section>
    <section class='container addresses-content'>
      <article v-for='(item, index) in addresses' :key='index' class='address-card card'>
        <div class='address-header'>
          <h3 class='address-title'>{{ item.title }}</h3>
          <span v-if='item.isDefault' class='default-tag'>默认</span>
        </div>
        <p class='address-meta'>{{ item.meta }}</p>
        <div class='address-actions'>
          <button class='address-btn'>编辑</button>
          <button class='address-btn'>删除</button>
        </div>
      </article>
      <button class='add-address-btn'>+ 添加新地址</button>
    </section>
  </div>
</template>

<style scoped>
.addresses-page{min-height:100vh;background:var(--color-bg);}
.page-header{padding:28px;margin-top:96px;margin-bottom:24px;}
.header-content{display:flex;align-items:center;gap:16px;}
.icon-wrapper{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:rgba(200,184,168,.16);color:var(--color-primary);}
.header-text h1{font-size:var(--fs-h2);color:var(--color-primary);}
.subtitle{color:var(--color-muted);font-size:var(--fs-small);}
.addresses-content{padding-bottom:64px;display:flex;flex-direction:column;gap:20px;}
.address-card{padding:24px;}
.address-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.address-title{font-size:var(--fs-h3);color:var(--color-primary);margin:0;}
.default-tag{padding:4px 12px;border-radius:4px;background:rgba(58,40,27,.1);color:var(--color-primary);font-size:var(--fs-small);}
.address-meta{color:var(--color-text);font-size:var(--fs-body);margin:0 0 16px;}
.address-actions{display:flex;gap:12px;}
.address-btn{padding:8px 16px;border-radius:6px;background:rgba(200,184,168,.1);color:var(--color-primary);border:1px solid var(--color-line);}
.add-address-btn{padding:16px;border-radius:12px;border:2px dashed var(--color-line);color:var(--color-muted);background:transparent;font-size:var(--fs-body);}
</style>