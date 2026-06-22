﻿<script setup>
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'
import CoffeeBeanCard from '../components/CoffeeBeanCard.vue'
import SeasonCalendar from '../components/SeasonCalendar.vue'
import CoffeeScale from '../components/CoffeeScale.vue'
import CoffeeBean3D from '../components/CoffeeBean3D.vue'
import StatsCard from '../components/StatsCard.vue'
import TestimonialCard from '../components/TestimonialCard.vue'
import FeatureCard from '../components/FeatureCard.vue'
import { products } from '../api'
import { ElMessageBox } from 'element-plus'
import { Coffee } from '@element-plus/icons-vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const IS_MOBILE = window.innerWidth < 768
const ANIM_CONFIG = {
  duration: 0.8,
  stagger: 0.12,
  delay: 0.2,
  ease: 'power3.out',
  bounceEase: 'back.out(1.7)',
  rootMargin: '-100px 0',
  once: true
}

let ctx = null

const initGSAPAnimations = () => {
  ctx = gsap.context(() => {
    animateHeroSection()
    animateStatsSection()
    animateFeaturesSection()
    animateBeansSection()
    animateSeasonSection()
    animateBlendSection()
    animateTestimonialsSection()
    animateAboutSection()
    animateCardsHover()
    animateButtons()
    animateNavBarScroll()
    addClickRippleEffect()
  }, document.querySelector('.home-container'))
}

const animateHeroSection = () => {
  if (IS_MOBILE) return
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top 80%',
      once: ANIM_CONFIG.once
    }
  })
  
  tl.from('.eyebrow', {
    x: -40,
    opacity: 0,
    duration: ANIM_CONFIG.duration * 0.6,
    ease: ANIM_CONFIG.ease
  })
  .from('.hero-title', {
    y: 30,
    opacity: 0,
    filter: 'grayscale(100%)',
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.bounceEase
  }, '-=0.2')
  .from('.hero-desc', {
    x: 40,
    y: 20,
    opacity: 0,
    filter: 'blur(8px)',
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  }, '-=0.3')
  .from('.hero-actions .hero-btn', {
    y: 20,
    opacity: 0,
    stagger: ANIM_CONFIG.stagger,
    duration: ANIM_CONFIG.duration * 0.7,
    ease: ANIM_CONFIG.ease
  }, '-=0.3')
  .from('.hero-visual', {
    scale: 0.85,
    y: 40,
    opacity: 0,
    duration: ANIM_CONFIG.duration * 1.2,
    ease: ANIM_CONFIG.ease
  }, '-=0.4')
}

const animateStatsSection = () => {
  if (IS_MOBILE) return
  
  gsap.from('.stats-grid > div', {
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 40,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
  
  const statValues = document.querySelectorAll('.stats-grid .stat-value')
  statValues.forEach((el, index) => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''))
    const unit = el.textContent.replace(/[0-9.]/g, '')
    
    gsap.to(el, {
      innerHTML: target,
      roundProps: 'innerHTML',
      duration: 1.5,
      delay: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 60%',
        once: ANIM_CONFIG.once,
        onEnter: () => {
          gsap.from(el, {
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            ease: ANIM_CONFIG.bounceEase
          })
          gsap.to(el, {
            scale: [1, 1.1, 1],
            duration: 0.4,
            delay: 1.5,
            ease: 'power3.out'
          })
        }
      }
    })
    if (unit) {
      el.innerHTML = target + unit
    }
  })
}

const animateFeaturesSection = () => {
  if (IS_MOBILE) return
  
  gsap.from('.features-section .section-title', {
    scrollTrigger: {
      trigger: '.features-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 20,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.features-section .section-subtitle', {
    scrollTrigger: {
      trigger: '.features-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 15,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    delay: 0.15,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.features-grid > div', {
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top 70%',
      once: ANIM_CONFIG.once
    },
    y: 50,
    x: (i) => (i % 2 === 0 ? -20 : 20),
    opacity: 0,
    stagger: ANIM_CONFIG.stagger,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
}

const animateBeansSection = () => {
  if (IS_MOBILE) return
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.beans-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    }
  })
  
  tl.from('.beans-section .section-title', {
    y: 20,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
  .from('.beans-section .section-subtitle', {
    y: 15,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    delay: 0.1,
    ease: ANIM_CONFIG.ease
  })
  .from('.beans-grid > div', {
    y: 60,
    opacity: 0,
    stagger: ANIM_CONFIG.stagger,
    duration: ANIM_CONFIG.duration * 0.9,
    ease: ANIM_CONFIG.ease
  }, '-=0.3')
}

const animateSeasonSection = () => {
  if (IS_MOBILE) return
  
  gsap.from('.season-main-title', {
    scrollTrigger: {
      trigger: '.season-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 20,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.season-subtitle', {
    scrollTrigger: {
      trigger: '.season-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 15,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    delay: 0.1,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.season-list .season-item', {
    scrollTrigger: {
      trigger: '.season-card',
      start: 'top 70%',
      once: ANIM_CONFIG.once
    },
    y: 40,
    opacity: 0,
    stagger: ANIM_CONFIG.stagger * 1.5,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
}

const animateBlendSection = () => {
  if (IS_MOBILE) return
  
  gsap.from('.blend-title', {
    scrollTrigger: {
      trigger: '.blend-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 20,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.blend-section .blend-desc', {
    scrollTrigger: {
      trigger: '.blend-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    x: 30,
    y: 10,
    opacity: 0,
    filter: 'blur(6px)',
    duration: ANIM_CONFIG.duration,
    delay: 0.15,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.blend-right', {
    scrollTrigger: {
      trigger: '.blend-card',
      start: 'top 70%',
      once: ANIM_CONFIG.once
    },
    scale: 0.9,
    opacity: 0,
    duration: ANIM_CONFIG.duration * 1.1,
    ease: ANIM_CONFIG.bounceEase
  })
}

const animateTestimonialsSection = () => {
  if (IS_MOBILE) return
  
  gsap.from('.testimonials-section .section-title', {
    scrollTrigger: {
      trigger: '.testimonials-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 20,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.testimonials-section .section-subtitle', {
    scrollTrigger: {
      trigger: '.testimonials-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 15,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    delay: 0.1,
    ease: ANIM_CONFIG.ease
  })
  
  gsap.from('.testimonials-grid > div', {
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 70%',
      once: ANIM_CONFIG.once
    },
    y: 50,
    x: (i) => (i % 2 === 0 ? -15 : 15),
    opacity: 0,
    stagger: ANIM_CONFIG.stagger,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.ease
  })
}

const animateAboutSection = () => {
  if (IS_MOBILE) return
  
  gsap.from('.about-title', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 30,
    opacity: 0,
    duration: ANIM_CONFIG.duration,
    ease: ANIM_CONFIG.bounceEase
  })
  
  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 75%',
      once: ANIM_CONFIG.once
    },
    y: 20,
    opacity: 0,
    filter: 'blur(6px)',
    duration: ANIM_CONFIG.duration,
    delay: 0.2,
    ease: ANIM_CONFIG.ease
  })
}

const animateCardsHover = () => {
  if (IS_MOBILE) return
  
  const cards = document.querySelectorAll('.card, .stats-grid > div, .season-item')
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      
      gsap.to(card, {
        rotateX: y * -8,
        rotateY: x * 8,
        scale: 1.02,
        duration: 0.4,
        ease: 'power3.out'
      })
      
      gsap.to(card, {
        boxShadow: '0 20px 40px rgba(58, 40, 27, 0.2)',
        duration: 0.4,
        ease: 'power3.out'
      })
    })
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out'
      })
      
      gsap.to(card, {
        boxShadow: '',
        duration: 0.4,
        ease: 'power3.out'
      })
    })
  })
}

const animateButtons = () => {
  if (IS_MOBILE) return
  
  const buttons = document.querySelectorAll('.btn, .hero-btn')
  
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        y: -3,
        duration: 0.3,
        ease: 'power3.out'
      })
      
      gsap.fromTo(btn, 
        { backgroundPosition: '-200% 0' },
        { 
          backgroundPosition: '200% 0',
          duration: 1.5,
          repeat: -1,
          ease: 'linear'
        }
      )
    })
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        y: 0,
        duration: 0.3,
        ease: 'power3.out'
      })
    })
    
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const ripple = document.createElement('span')
      ripple.style.position = 'absolute'
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.width = '10px'
      ripple.style.height = '10px'
      ripple.style.borderRadius = '50%'
      ripple.style.background = 'rgba(255, 255, 255, 0.4)'
      ripple.style.transform = 'translate(-50%, -50%)'
      ripple.style.pointerEvents = 'none'
      ripple.style.zIndex = '100'
      
      btn.style.position = 'relative'
      btn.appendChild(ripple)
      
      gsap.to(ripple, {
        width: 300,
        height: 300,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => ripple.remove()
      })
    })
  })
}

const animateNavBarScroll = () => {
  gsap.to('.nav-panel', {
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'top -100px',
      scrub: 0.3
    },
    backgroundColor: 'rgba(245, 240, 232, 0.95)',
    boxShadow: '0 4px 20px rgba(58, 40, 27, 0.1)',
    paddingTop: '12px',
    paddingBottom: '12px'
  })
}

const addClickRippleEffect = () => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn, .hero-btn')) return
    
    const ripple = document.createElement('div')
    ripple.className = 'global-ripple'
    ripple.style.left = `${e.clientX}px`
    ripple.style.top = `${e.clientY}px`
    document.body.appendChild(ripple)
    
    gsap.to(ripple, {
      width: 600,
      height: 600,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => ripple.remove()
    })
  })
}

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const selectedSeason = ref({ season: null, date: null })
const selectedWeight = ref(150)

const coffeeBeans = ref([
  { id: 1, name: '耶加雪菲 果丁丁', origin: '埃塞俄比亚', price: 128, weight: '250g', rating: 4.8, image: '/coffee-images/1.jpg', description: '花香明亮，柑橘蜂蜜甜感，清爽水洗浅烘。', flavors: ['茉莉花', '柑橘', '蜂蜜', '红茶'], story: '果丁丁村落坐落于埃塞俄比亚西南部耶加雪菲产区，海拔 1800-2200 米，百年原生 Heirloom 老树种，传统水洗处理法，是全球知名花香型精品豆标杆。', brew: '水温 92，粉水比 1:15，2-3 段分段注水，浅烘萃取时长 1 分 50 秒。', info: '类型｜水洗单一产地；规格｜Heirloom 原生种', season: 'summer', processing: '水洗处理', roastLevel: 'light', flavor: '柑橘、茉莉、蜂蜜甜感' },
  { id: 2, name: '哥伦比亚 蕙兰 玫瑰谷', origin: '哥伦比亚', price: 98, weight: '250g', rating: 4.8, image: '/coffee-images/2.jpg', description: '平衡坚果焦糖，柔和莓果酸度，中度烘焙日常口粮。', flavors: ['坚果', '焦糖', '红莓', '巧克力'], story: '哥伦比亚蕙兰产区玫瑰谷庄园，山地火山土壤，人工全红果采摘，水洗处理，均衡度极高，新手入门首选综合风味豆。', brew: '水温 90，粉水比 1:14，标准一刀流，萃取 2 分 10 秒。', info: '类型｜水洗单一产地；规格｜Castillo 卡杜拉混种', season: 'autumn', processing: '水洗处理', roastLevel: 'medium', flavor: '坚果、焦糖、柔和莓果' },
  { id: 3, name: '巴西 桑托斯 半日晒', origin: '巴西', price: 68, weight: '250g', rating: 4.7, image: '/coffee-images/3.jpg', description: '醇厚坚果可可，低酸顺滑，奶咖适配度拉满。', flavors: ['烤坚果', '可可', '奶油', '核桃'], story: '巴西米纳斯吉拉斯桑托斯产区，平缓高原种植，半日晒处理，果肉糖分缓慢渗入豆体，酸度极低，适配意式与牛奶咖啡。', brew: '水温 88，粉水比 1:13，适合做奶咖，手冲缩短萃取时间。', info: '类型｜半日晒单一产地；规格｜Bourbon 波旁种', season: 'winter', processing: '半日晒处理', roastLevel: 'medium', flavor: '烤坚果、可可、奶油' },
  { id: 4, name: '危地马拉 安提瓜 火山豆', origin: '危地马拉', price: 118, weight: '250g', rating: 4.9, image: '/coffee-images/4.jpg', description: '烟熏巧克力，黑樱桃回甘，厚重温润中深烘。', flavors: ['黑巧克力', '黑樱桃', '烟草', '焦糖'], story: '安提瓜产区紧邻活火山，火山灰土壤富含矿物质，传统水洗处理，厚实醇厚度，回甘持久，重度咖啡爱好者优选。', brew: '水温 91，粉水比 1:14，3 段慢注水，萃取 2 分 20 秒。', info: '类型｜水洗单一产地；规格｜Caturra 卡杜拉', season: 'winter', processing: '水洗处理', roastLevel: 'dark', flavor: '黑巧克力、黑樱桃、焦糖' },
  { id: 5, name: '肯尼亚 AA 涅里', origin: '肯尼亚', price: 138, weight: '250g', rating: 4.9, image: '/coffee-images/5.jpg', description: '浓郁黑醋栗，番茄明亮酸，层次复杂顶级果酸。', flavors: ['黑醋栗', '番茄', '黑莓', '蔗糖'], story: '肯尼亚涅里产区严格 AA 分级，双重水洗发酵，高海拔冷凉环境造就极致明亮果酸，酸度干净锐利，是果酸爱好者天花板单品。', brew: '水温 93，粉水比 1:16，细粉慢萃，时长 2 分整。', info: '类型｜双重水洗单一产地；规格｜SL28/SL34', season: 'summer', processing: '双重水洗', roastLevel: 'light', flavor: '黑醋栗、番茄、明亮酸' },
  { id: 6, name: '巴拿马 瑰夏 水洗', origin: '巴拿马', price: 142, weight: '250g', rating: 4.8, image: '/coffee-images/6.jpg', description: '顶级瑰夏花香，佛手柑白茶，高端浅烘稀缺单品。', flavors: ['佛手柑', '白茶', '荔枝', '蜂蜜'], story: '巴拿马翡翠庄园同风土瑰夏树种，高海拔遮阴种植，精细水洗处理，标志性茉莉佛手柑花香，精品咖啡高端代表。', brew: '水温 90，粉水比 1:16，极浅烘，分段轻柔注水避免过萃。', info: '类型｜水洗单一产地；规格｜Gesha 瑰夏种', season: 'spring', processing: '水洗处理', roastLevel: 'light', flavor: '佛手柑、白茶、茉莉花香' },
  { id: 7, name: '哥斯达黎加 蜜处理 黑蜜', origin: '哥斯达黎加', price: 108, weight: '250g', rating: 4.7, image: '/coffee-images/7.jpg', description: '蜜饯桃子甜，柔和果汁感，中度蜜处理特色甜感。', flavors: ['水蜜桃', '蜜饯', '香草', '黄糖'], story: '哥斯达黎加塔拉珠庄园黑蜜处理，保留大量果胶晾晒，糖分富集，果汁甜感突出，酸度柔和不刺激。', brew: '水温 90，粉水比 1:15，两段注水，萃取 2 分钟。', info: '类型｜黑蜜处理单一产地；规格｜Catuai 卡杜艾', season: 'spring', processing: '黑蜜处理', roastLevel: 'medium', flavor: '水蜜桃、蜜饯、香草' },
  { id: 8, name: '埃塞 罕贝拉 日晒花魁', origin: '埃塞俄比亚', price: 132, weight: '250g', rating: 4.8, image: '/coffee-images/8.jpg', description: '草莓蓝莓果汁，浓郁热带水果，日晒发酵饱满果香。', flavors: ['草莓', '蓝莓', '芒果', '果脯'], story: '埃塞俄比亚罕贝拉日晒产区，完整果荚晾晒长时间发酵，浓郁热带浆果风味，网红爆款日晒精品豆。', brew: '水温 91，粉水比 1:15，浅中烘，充分释放果香。', info: '类型｜日晒单一产地；规格｜Heirloom 原生种', season: 'summer', processing: '日晒处理', roastLevel: 'light', flavor: '草莓、蓝莓、热带水果' },
  { id: 9, name: '印尼 苏门答腊 曼特宁', origin: '印尼', price: 88, weight: '250g', rating: 4.7, image: '/coffee-images/9.jpg', description: '草本泥土香料，低酸厚重，草本木质醇厚深烘。', flavors: ['草本', '丁香', '黑巧克力', '松木'], story: '苏门答腊湿刨法独特处理，潮湿环境带来标志性泥土草本调性，醇厚度极高，适合偏爱厚重低酸咖啡人群。', brew: '水温 89，粉水比 1:13，深烘缩短萃取，避免苦涩。', info: '类型｜湿刨法单一产地；规格｜Tim Tim 蒂姆蒂姆', season: 'winter', processing: '湿刨法', roastLevel: 'dark', flavor: '草本、丁香、黑巧克力' },
  { id: 10, name: '秘鲁 有机 水洗波旁', origin: '秘鲁', price: 122, weight: '250g', rating: 4.8, image: '/coffee-images/10.jpg', description: '干净梨子花香，柔和均衡，有机认证温和口粮豆。', flavors: ['梨子', '白桃', '白花香', '麦芽糖'], story: '秘鲁北部有机认证庄园，无化肥农药种植，波旁种水洗处理，风味干净柔和，低刺激适合日常每日饮用。', brew: '水温 92，粉水比 1:15，三段均衡萃取。', info: '类型｜有机水洗单一产地；规格｜Bourbon 波旁', season: 'autumn', processing: '有机水洗', roastLevel: 'medium', flavor: '梨子、白桃、白花香' }
])

const testimonials = ref([
  { id: 1, name: '陈柏霖', role: '资深咖啡师', rating: 5, content: '耶加雪菲的花香层次分明，每一口都是惊喜。' },
  { id: 2, name: '林小美', role: '居家咖啡爱好者', rating: 5, content: '云南普洱让我重新认识了国产咖啡，甜度恰到好处。' },
  { id: 3, name: '张老板', role: '咖啡馆店主', rating: 4.5, content: '哥伦比亚慧兰是我店里的常客选择，稳定可靠。' },
  { id: 4, name: '王程序员', role: '深夜码农', rating: 5, content: '危地马拉的浓郁口感，陪我度过了无数个debug之夜。' }
])

const features = ref([
  { 
    title: 'Elevate Your Coffee', 
    subtitle: '提升体验',
    description: '精选单一产地咖啡豆，让每一杯咖啡都讲述独特的风味故事。',
    specs: [
      { label: '产地', value: '全球精选' },
      { label: '烘焙', value: '中浅烘' },
      { label: '风味', value: '明亮活泼' }
    ]
  },
  { 
    title: 'Thermodynamic Stability', 
    subtitle: '热力稳定',
    description: '从高温手冲到冰滴冷萃，咖啡豆始终保持完美风味表现。',
    specs: [
      { label: '耐温范围', value: '0-98C' },
      { label: '保存期限', value: '6个月' },
      { label: '最佳赏味期', value: '烘焙后1-4周' }
    ]
  },
  { 
    title: 'Perfectly Roasted', 
    subtitle: '精准烘焙',
    description: '专业烘焙师严格把控每一批次，确保品质稳定如一。',
    specs: [
      { label: '烘焙度', value: '中浅/中度' },
      { label: '批次控制', value: '小批次' },
      { label: '新鲜度', value: '<7天发货' }
    ]
  }
])

const filteredBeans = computed(() => {
  if (!selectedSeason.value.season) return coffeeBeans.value
  return coffeeBeans.value.filter(bean => bean.season?.includes(selectedSeason.value.season))
})

const seasonalBeans = computed(() => {
  if (!selectedSeason.value.season) return coffeeBeans.value.slice(0, 3)
  return coffeeBeans.value.filter(bean => bean.season?.includes(selectedSeason.value.season))
})

const statsData = computed(() => {
  const beans = coffeeBeans.value
  const origins = new Set(beans.map(b => b.origin).filter(Boolean)).size
  const total = beans.length
  const avgRating = beans.length > 0 ? (beans.reduce((sum, b) => sum + (b.rating || 0), 0) / beans.length).toFixed(1) : '0'
  const ratingPercent = Math.round((parseFloat(avgRating) / 5) * 100)
  
  return {
    originCount: `${origins}+`,
    beanCount: total,
    ratingPercent: `${ratingPercent}%`,
    shippingHours: 24
  }
})

const goToMap = () => router.push('/origin-map')

const showSeasonHint = ref(false)
const currentSeasonHint = ref('')

const seasonNames = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季'
}

watch(selectedSeason, (newVal) => {
  if (newVal.season) {
    currentSeasonHint.value = `已切换至${seasonNames[newVal.season]}限定推荐`
    showSeasonHint.value = true
    setTimeout(() => { showSeasonHint.value = false }, 2000)
  }
})

const getRoastLabel = (level) => {
  const labels = {
    light: '浅烘',
    medium: '中烘',
    dark: '深烘'
  }
  return labels[level] || '浅烘'
}

const showBeanDetail = (bean) => {}
const hideBeanDetail = () => {}

const scrollToBeans = () => {
  const beansSection = document.getElementById('beans-section')
  if (beansSection) {
    beansSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleBlendClick = async () => {
  if (!userStore.isLoggedIn) {
    await ElMessageBox.confirm('需要登录后才能使用自定义拼配功能。', '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '继续浏览',
      type: 'info'
    }).then(() => {
      router.push('/login?redirect=/home')
    }).catch(() => {})
    return
  }
}

const loadBeans = async () => {
  try {
    const data = await products.getBeans()
    if (!Array.isArray(data) || data.length === 0) return

    const localById = new Map(coffeeBeans.value.map(item => [Number(item.id), item]))
    data.forEach((bean) => {
      const id = Number(bean?.id)
      if (!Number.isFinite(id)) return

      const patch = {
        id,
        name: bean?.name ?? '',
        origin: bean?.origin ?? '',
        price: bean?.price !== undefined && bean?.price !== null ? Number(bean.price) : undefined,
        weight: bean?.weight ?? '',
        rating: bean?.rating !== undefined && bean?.rating !== null ? Number(bean.rating) : undefined,
        image: bean?.image ?? '',
        description: bean?.description ?? ''
      }

      const target = localById.get(id)
      if (target) {
        Object.entries(patch).forEach(([key, value]) => {
          if (value === undefined || value === null) return
          if (typeof value === 'number' && Number.isNaN(value)) return
          if (typeof value === 'string' && value.trim() === '') return
          target[key] = value
        })
        return
      }

      coffeeBeans.value.push({
        ...patch,
        price: Number.isFinite(patch.price) ? patch.price : 0,
        rating: Number.isFinite(patch.rating) ? patch.rating : 0
      })
    })
  } catch {}
}

onMounted(() => { 
  if (userStore.isLoggedIn) {
    cartStore.loadCart()
  }
  loadBeans() 
  setTimeout(initGSAPAnimations, 100)
})

onUnmounted(() => {
  if (ctx) {
    ctx.revert()
  }
})
</script>

<template>
  <div class="home-container">
    <NavBar @toggle-menu="isMenuOpen = true" @toggle-cart="isCartOpen = true" />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />

    <section class="banner-section">
      <img src="/picture/slide-2.png" alt="Coffee Banner" class="banner-image" loading="lazy" />
    </section>

    <section class="hero-section container">
      <div class="hero-copy">
        <p class="eyebrow">COFFEE ONLINE</p>
        <h1 class="hero-title">在一杯咖啡里，找到日常的轻奢</h1>
        <p class="hero-desc">精选单一产地咖啡豆、器具与季节推荐，以更清晰的结构呈现更纯粹的咖啡体验</p>
        <div class="hero-actions">
          <button class="hero-btn btn" @click="scrollToBeans">探索咖啡</button>
          <button class="hero-btn ghost btn" @click="goToMap">查看产地地图</button>
        </div>
      </div>
      <div class="hero-visual">
        <CoffeeBean3D />
      </div>
    </section>

    <section class="stats-section container">
      <div class="stats-grid">
        <StatsCard :value="statsData.originCount" label="精选产地" unit="+" icon="map" color="#4A3C31" :index="0" />
        <StatsCard :value="statsData.beanCount" label="单品咖啡豆" unit="款" icon="coffee" color="#4A3C31" :index="1" />
        <StatsCard :value="statsData.ratingPercent" label="好评率" icon="star" color="#4A3C31" :index="2" />
        <StatsCard :value="statsData.shippingHours" label="小时内发货" icon="clock" color="#4A3C31" :index="3" />
      </div>
    </section>

    <section class="features-section container">
      <div class="section-head">
        <div>
          <h2 class="section-title">Features</h2>
          <p class="section-subtitle">为咖啡而生的设计</p>
        </div>
      </div>
      <div class="features-grid">
        <FeatureCard v-for="feature in features" :key="feature.title" :title="feature.title" :subtitle="feature.subtitle" :description="feature.description" :specs="feature.specs" />
      </div>
    </section>

    <section class="beans-section container" id="beans-section">
      <div class="section-head">
        <div>
          <h2 class="section-title">Single-Origin Coffee</h2>
          <p class="section-subtitle">精选单一产地咖啡豆</p>
        </div>
      </div>
      <div class="beans-grid">
        <CoffeeBeanCard v-for="bean in filteredBeans" :key="bean.id" :bean="bean" />
      </div>
    </section>

    <section class="season-section container">
      <div class="season-header">
        <div class="season-title-group">
          <h2 class="season-main-title">季节限定选豆</h2>
          <p class="season-subtitle">Seasonal Selection</p>
          <p class="season-hint">点击顶部季节标签 / 日历日期，右侧实时刷新对应季节咖啡豆推荐</p>
        </div>
        <div class="season-divider"></div>
      </div>
      
      <div class="season-card">
        <div class="season-left">
          <SeasonCalendar v-model="selectedSeason" />
        </div>
        
        <div class="season-dividing-line"></div>
        
        <div class="season-right">
          <div class="season-right-header">
            <h3 class="season-list-title">季节限定推荐</h3>
          </div>
          
          <Transition name="season-list">
            <div v-if="seasonalBeans.length === 0" class="season-empty">
              <div class="empty-icon">
                <Coffee :size="32" />
              </div>
              <p class="empty-text">本季限定咖啡豆尚未上线。</p>
              <p class="empty-hint">可查看其他季节的精选推荐</p>
            </div>
            
            <div v-else class="season-list">
              <div 
                v-for="bean in seasonalBeans" 
                :key="bean.id" 
                class="season-item"
                @click="router.push(`/product/${bean.id}`)"
                @mouseenter="showBeanDetail(bean)"
                @mouseleave="hideBeanDetail"
              >
                <div class="season-item-image">
                  <img :src="bean.image || '/picture/yejiaxuefei.png'" :alt="bean.name" />
                </div>
                <div class="season-item-info">
                  <h4 class="season-item-name">{{ bean.name }}</h4>
                  <div class="season-item-tags">
                    <span class="origin-tag">{{ bean.origin }}</span>
                    <span class="process-tag">{{ bean.processing || '水洗处理' }}</span>
                    <span class="roast-tag" :class="bean.roastLevel || 'light'">
                      <span class="roast-dot" :class="bean.roastLevel || 'light'"></span>
                      {{ getRoastLabel(bean.roastLevel) }}
                    </span>
                  </div>
                  <p class="season-item-flavor">{{ bean.flavor || '柑橘、茉莉、蜂蜜甜' }}</p>
                </div>
                <div class="season-item-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ bean.price }}</span>
                </div>
                <button class="season-item-view">查看</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
      
      <Transition name="fade">
        <div v-if="showSeasonHint" class="season-hint-toast">{{ currentSeasonHint }}</div>
      </Transition>
    </section>

    <section class="blend-section container">
      <div class="blend-card">
        <div class="blend-left">
          <div class="blend-header">
            <h3 class="blend-title">自定义拼配克重</h3>
            <p class="blend-subtitle"><span class="highlight">拖动刻度圆环</span> / <span class="highlight">点击±增减克重</span></p>
            <p class="blend-desc">修改数值后，自动同步至单人/双人/多人快捷方案</p>
          </div>
          <div class="blend-reference">
            <h4 class="reference-title">参考克重对照表</h4>
            <div class="reference-items">
              <div class="reference-item">
                <span class="reference-label">单人手冲</span>
                <span class="reference-value">12-15g</span>
                <div class="reference-color normal"></div>
              </div>
              <div class="reference-item">
                <span class="reference-label">双人分享</span>
                <span class="reference-value">24-30g</span>
                <div class="reference-color normal"></div>
              </div>
              <div class="reference-item">
                <span class="reference-label">多人分享</span>
                <span class="reference-value">80-150g</span>
                <div class="reference-color large"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="blend-right">
          <CoffeeScale v-model="selectedWeight" />
        </div>
      </div>
    </section>

    <section class="testimonials-section container">
      <div class="section-head">
        <div>
          <h2 class="section-title">Testimonials</h2>
          <p class="section-subtitle">听听他们怎么说</p>
        </div>
      </div>
      <div class="testimonials-grid">
        <TestimonialCard v-for="item in testimonials" :key="item.id" :name="item.name" :role="item.role" :rating="item.rating" :content="item.content" />
      </div>
    </section>

    <section class="about-section container">
      <div class="about-content">
        <h2 class="about-title">Our Philosophy</h2>
        <p class="about-text">咖啡在线致力于为每一位咖啡爱好者带来纯粹、清晰且更容易理解的精品咖啡体验。我们精选全球优质产区的单一产地咖啡豆，从源头把控品质，让每一杯咖啡都能呈现其独特的风味与个性。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container { min-height: 100vh; background: var(--color-bg); }

.banner-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
}

.banner-image {
  width: 100%;
  max-width: 1920px;
  height: auto;
  aspect-ratio: 1920/400;
  object-fit: cover;
}

.hero-section { 
  min-height: calc(100vh - 400px); 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  align-items: center; 
  gap: 64px; 
  padding-top: 80px;
}

.hero-copy { padding: var(--card-padding); }

.eyebrow { 
  letter-spacing: .28em; 
  color: var(--color-muted); 
  font-size: var(--fs-small); 
  margin-bottom: 20px; 
  font-family: 'SF Mono', monospace;
}

.hero-title { 
  font-size: var(--fs-h1); 
  color: var(--color-primary); 
  line-height: 1.15; 
  margin-bottom: 24px; 
  font-family: var(--font-display); 
}

.hero-desc { 
  font-size: 18px; 
  color: var(--color-text); 
  margin-bottom: 32px; 
  max-width: 560px; 
  line-height: 1.8; 
}

.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }

.hero-btn { 
  padding: 14px 28px; 
  background: var(--color-primary); 
  color: #fff; 
  transition: all var(--transition);
}

.hero-btn.ghost { 
  background: transparent; 
  color: var(--color-primary); 
  border: 1px solid var(--color-line); 
}

.hero-btn:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 8px 24px rgba(58, 40, 27, 0.15);
}

.hero-visual { display: flex; justify-content: center; align-items: center; }

.stats-section {
  padding: 64px 0;
  position: relative;
}

.stats-section::before,
.stats-section::after {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  height: 1px;
  border-top: 1px dashed rgba(184, 169, 153, 0.4);
}

.stats-section::before {
  top: 0;
}

.stats-section::after {
  bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stats-grid > div {
  opacity: 1 !important;
}

.features-section { padding: 80px 0; }

.section-head { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 20px; 
  margin-bottom: 48px; 
}

.section-head > div {
  text-align: center;
}

.section-title { 
  font-size: var(--fs-h2); 
  color: var(--color-primary); 
  margin: 0;
  font-family: var(--font-display);
}

.section-subtitle { 
  font-size: var(--fs-body); 
  color: var(--color-muted); 
  margin: 8px 0 0; 
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.beans-section { padding: 80px 0; }

.beans-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 24px; 
}

.season-section { padding: 80px 0; }

.season-header {
  text-align: center;
  margin-bottom: 32px;
}

.season-title-group {
  margin-bottom: 16px;
}

.season-main-title {
  font-size: 2rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.season-subtitle {
  font-size: 1rem;
  color: var(--color-muted);
  font-style: italic;
  margin: 0 0 8px;
}

.season-hint {
  font-size: 14px;
  color: var(--color-muted);
  margin: 0;
}

.season-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(200, 184, 168, 0.6), transparent);
  margin: 0 auto;
}

.season-card {
  display: grid;
  grid-template-columns: 45% 1px 55%;
  gap: 0;
  padding: 32px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  box-shadow: 0 4px 20px rgba(58, 40, 27, 0.06);
}

.season-left {
  padding-right: 24px;
}

.season-dividing-line {
  background: var(--color-line);
  width: 1px;
}

.season-right {
  padding-left: 24px;
  display: flex;
  flex-direction: column;
}

.season-right-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.season-list-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}



.season-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 8px;
}

.empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(200, 184, 168, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.empty-hint {
  font-size: 13px;
  color: var(--color-muted);
  margin: 0;
}

.season-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.season-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-md);
  border: 1px solid rgba(200, 184, 168, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.season-item:hover {
  background: rgba(200, 184, 168, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(58, 40, 27, 0.06);
  border-color: rgba(200, 184, 168, 0.3);
}

.season-item-image {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(200,184,168,.18), rgba(248,245,240,.9));
  flex-shrink: 0;
}

.season-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.season-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.season-item-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.season-item-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.origin-tag, .process-tag {
  padding: 3px 10px;
  border-radius: 4px;
  background: rgba(200, 184, 168, 0.15);
  color: var(--color-muted);
  font-size: 12px;
}

.roast-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.roast-tag.light {
  background: rgba(154, 184, 125, 0.15);
  color: #7A8A5D;
}

.roast-tag.medium {
  background: rgba(196, 163, 90, 0.15);
  color: #A48345;
}

.roast-tag.dark {
  background: rgba(139, 115, 85, 0.15);
  color: #6B5335;
}

.roast-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.roast-dot.light { background: #7A8A5D; }
.roast-dot.medium { background: #A48345; }
.roast-dot.dark { background: #6B5335; }

.season-item-flavor {
  font-size: 12px;
  color: var(--color-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.season-item-price {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.price-symbol {
  font-size: 12px;
  color: var(--color-muted);
}

.price-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'SF Mono', monospace;
}

.season-item-view {
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(200, 184, 168, 0.12);
  color: var(--color-secondary);
  font-size: 12px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.season-item:hover .season-item-view {
  opacity: 1;
  transform: translateX(0);
}

.season-item-view:hover {
  background: var(--color-primary);
  color: #fff;
}

.season-hint-toast {
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

.season-list-enter-active,
.season-list-leave-active {
  transition: all 0.3s ease;
}

.season-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.season-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.blend-section { padding: 80px 0; }

.blend-card {
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 32px;
  padding: 36px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  box-shadow: 0 4px 24px rgba(58, 40, 27, 0.06);
  align-items: center;
}

.blend-left {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.blend-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blend-title {
  font-size: var(--fs-h2);
  color: var(--color-primary);
  margin: 0;
  font-family: var(--font-display);
}

.blend-subtitle {
  font-size: var(--fs-body);
  color: var(--color-text);
}

.blend-subtitle .highlight {
  font-weight: 600;
  color: var(--color-primary);
}

.blend-desc {
  font-size: var(--fs-body);
  color: var(--color-muted);
  line-height: 1.8;
  margin: 0;
}

.blend-reference {
  padding: 20px;
  background: rgba(245, 240, 232, 0.8);
  border-radius: var(--radius-md);
}

.reference-title {
  font-size: var(--fs-small);
  color: var(--color-muted);
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.reference-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.reference-label {
  font-size: var(--fs-body);
  color: var(--color-primary);
  font-weight: 500;
}

.reference-value {
  font-size: var(--fs-body);
  color: var(--color-text);
  font-weight: 600;
}

.reference-color {
  width: 24px;
  height: 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.reference-color.normal {
  background: linear-gradient(90deg, #E8E0D5, #D4C4B0);
}

.reference-color.large {
  background: linear-gradient(90deg, #C8B8A8, #8B7355);
}

.blend-right {
  display: flex;
  justify-content: center;
}

.about-text { line-height: 1.8; color: var(--color-text); }

.testimonials-section { 
  padding: 80px 0; 
  background: rgba(237, 232, 224, 0.6);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.about-section { padding: 80px 0; }

.about-content { 
  max-width: 600px; 
  margin: 0 auto; 
  text-align: center; 
}

.about-title { 
  font-size: var(--fs-h2); 
  color: var(--color-primary); 
  margin-bottom: 20px; 
  font-family: var(--font-display); 
}

.about-text { font-size: var(--fs-body); }

@media (max-width: 960px) { 
  .hero-section, .season-grid, .blend-grid, .blend-card { grid-template-columns: 1fr; } 
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: repeat(1, 1fr); }
  .section-head { flex-direction: column; align-items: flex-start; } 
  .hero-section { gap: 32px; } 
  .blend-card { padding: 24px; }
  .blend-left { gap: 20px; }
}

.global-ripple {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(200, 184, 168, 0.15);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
}
</style>
