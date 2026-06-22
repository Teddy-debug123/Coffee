<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Star, CaretLeft, CaretRight, ShoppingCart } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'
import SideMenu from '../components/SideMenu.vue'
import CartSidebar from '../components/CartSidebar.vue'
import { products } from '../api'
import { mockGetBeanById } from '../api/mock'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const isLoading = ref(true)
const selectedWeight = ref('250g')
const product = ref(null)
const currentImageIndex = ref(0)
const isImageModalOpen = ref(false)
const activeTab = ref('story')
const isAddingToCart = ref(false)

const flavorDescriptions = {
  '坚果': '坚果风味通常带有杏仁、核桃或榛子的香气，口感醇厚',
  '奶油': '奶油般丝滑的口感，带有牛奶或香草的甜感',
  '巧克力': '黑巧克力或牛奶巧克力的浓郁风味，回味悠长',
  '柑橘': '明亮的柑橘酸度，如柠檬、橙子般清新',
  '蜂蜜': '天然蜂蜜的甜美感，带有花香和果糖甜',
  '茉莉花': '清新的茉莉花香，优雅细腻',
  '红莓': '红色浆果的酸甜，如草莓、覆盆子',
  '黑醋栗': '黑加仑的浓郁果香，酸度明亮',
  '番茄': '独特的番茄般明亮酸度，肯尼亚咖啡特征',
  '佛手柑': '柑橘与花香的结合，类似伯爵茶香气',
  '白茶': '淡雅的白茶风味，口感清爽',
  '荔枝': '热带水果的香甜，类似荔枝的风味',
  '草莓': '新鲜草莓的果香，酸甜可口',
  '蓝莓': '蓝莓的酸甜风味，带有莓果香气',
  '芒果': '热带芒果的香甜，浓郁多汁',
  '果脯': '风干水果的浓缩甜感，如葡萄干、杏干',
  '草本': '草本植物的香气，如薄荷、青草',
  '丁香': '香料丁香的芬芳，带有温暖感',
  '松木': '木质香气，带有松树般的清新',
  '梨子': '清新梨果香，口感清爽',
  '白桃': '白桃的柔和甜味，香气淡雅',
  '白花香': '白色花朵的香气，如栀子花、茉莉花',
  '麦芽糖': '麦芽的香甜，带有谷物风味',
  '水蜜桃': '水蜜桃的甜美多汁，香气浓郁',
  '蜜饯': '蜜饯水果的浓缩甜味，如蜜枣、桂圆',
  '香草': '香草的香甜，带有奶油感',
  '黄糖': '黄糖的焦糖甜味，口感醇厚',
  '烤坚果': '烘烤后的坚果香气，更浓郁醇厚',
  '可可': '可可粉的浓郁风味，略带苦涩',
  '核桃': '核桃的坚果香气，口感饱满',
  '黑巧克力': '黑巧克力的浓郁苦味，回味持久',
  '黑樱桃': '黑樱桃的酸甜，带有果香',
  '烟草': '淡淡的烟草香气，口感醇厚',
  '焦糖': '焦糖的香甜，带有焦糖化风味',
  '黑莓': '黑莓的酸甜果香，浓郁饱满',
  '蔗糖': '蔗糖的纯净甜味，口感清爽'
}

const specs = computed(() => {
  const s = product.value?.specs || product.value?.weights || []
  return s.length > 0 ? s : ['250g']
})

const selectedSpec = computed(() => {
  const spec = specs.value.find(item => item === selectedWeight.value)
  return spec || specs.value[0] || '250g'
})

const price = computed(() => {
  if (product.value?.prices && product.value.prices[selectedSpec.value] !== undefined) {
    return product.value.prices[selectedSpec.value]
  }
  return product.value?.price || 0
})

const specOptions = computed(() => Array.isArray(specs.value) ? specs.value : [])

const images = computed(() => {
  if (!product.value?.image) return []
  const baseUrl = product.value.image.replace(/&image_size=\w+/, '')
  return [
    baseUrl + '&image_size=square',
    baseUrl + '&image_size=square',
    baseUrl + '&image_size=square'
  ]
})

const currentImage = computed(() => images.value[currentImageIndex.value] || product.value?.image)

const filledStars = computed(() => Math.floor(product.value?.rating || 0))
const hasHalfStar = computed(() => (product.value?.rating || 0) % 1 >= 0.5)
const emptyStars = computed(() => 5 - filledStars.value - (hasHalfStar.value ? 1 : 0))

const mockProducts = {
  beans: {
    id: Number(route.params.id || 1),
    name: '埃塞俄比亚 耶加雪菲',
    origin: '埃塞俄比亚',
    category: '咖啡豆',
    rating: 4.9,
    reviews: 328,
    description: '花香浓郁，柑橘酸甜，带有清晰蜂蜜余韵，适合手冲与浅烘焙爱好者。',
    brewingGuide: '水温 92℃，粉水比 1:15，建议 2-3 段注水。',
    notes: ['茉莉花', '柑橘', '蜂蜜', '红茶'],
    specs: ['100g', '250g'],
    prices: { '100g': 68, '250g': 128 },
    image: '/picture/yejiaxuefei.png',
    story: '耶加雪菲位于埃塞俄比亚西南部，海拔1800-2200米，是世界上最著名的咖啡产区之一。',
    process: '水洗处理',
    altitude: '1800-2200m',
    variety: 'Heirloom'
  },
  beansList: [
    { id: 1, name: '耶加雪菲 果丁丁', origin: '埃塞俄比亚', category: '咖啡豆', rating: 4.8, description: '花香明亮，柑橘蜂蜜甜感，清爽水洗浅烘。', notes: ['茉莉花', '柑橘', '蜂蜜', '红茶'], specs: ['100g', '250g'], prices: { '100g': 68, '250g': 128 }, image: '/picture/yejiaxuefei.png', story: '果丁丁村落坐落于埃塞俄比亚西南部耶加雪菲产区，海拔 1800-2200 米，百年原生 Heirloom 老树种，传统水洗处理法，是全球知名花香型精品豆标杆。', brewingGuide: '水温 92℃，粉水比 1:15，2-3 段分段注水，浅烘萃取时长 1 分 50 秒。', process: '水洗单一产地', variety: 'Heirloom 原生种' },
    { id: 2, name: '哥伦比亚 蕙兰 玫瑰谷', origin: '哥伦比亚', category: '咖啡豆', rating: 4.8, description: '平衡坚果焦糖，柔和莓果酸度，中度烘焙日常口粮。', notes: ['坚果', '焦糖', '红莓', '巧克力'], specs: ['100g', '250g'], prices: { '100g': 52, '250g': 98 }, image: '/picture/yejiaxuefei.png', story: '哥伦比亚蕙兰产区玫瑰谷庄园，山地火山土壤，人工全红果采摘，水洗处理，均衡度极高，新手入门首选综合风味豆。', brewingGuide: '水温 90℃，粉水比 1:14，标准一刀流，萃取 2 分 10 秒。', process: '水洗单一产地', variety: 'Castillo 卡杜拉混种' },
    { id: 3, name: '巴西 桑托斯 半日晒', origin: '巴西', category: '咖啡豆', rating: 4.7, description: '醇厚坚果可可，低酸顺滑，奶咖适配度拉满。', notes: ['烤坚果', '可可', '奶油', '核桃'], specs: ['100g', '250g'], prices: { '100g': 36, '250g': 68 }, image: '/picture/yejiaxuefei.png', story: '巴西米纳斯吉拉斯桑托斯产区，平缓高原种植，半日晒处理，果肉糖分缓慢渗入豆体，酸度极低，适配意式与牛奶咖啡。', brewingGuide: '水温 88℃，粉水比 1:13，适合做奶咖，手冲缩短萃取时间。', process: '半日晒单一产地', variety: 'Bourbon 波旁种' },
    { id: 4, name: '危地马拉 安提瓜 火山豆', origin: '危地马拉', category: '咖啡豆', rating: 4.9, description: '烟熏巧克力，黑樱桃回甘，厚重温润中深烘。', notes: ['黑巧克力', '黑樱桃', '烟草', '焦糖'], specs: ['100g', '250g'], prices: { '100g': 62, '250g': 118 }, image: '/picture/yejiaxuefei.png', story: '安提瓜产区紧邻活火山，火山灰土壤富含矿物质，传统水洗处理，厚实醇厚度，回甘持久，重度咖啡爱好者优选。', brewingGuide: '水温 91℃，粉水比 1:14，3 段慢注水，萃取 2 分 20 秒。', process: '水洗单一产地', variety: 'Caturra 卡杜拉' },
    { id: 5, name: 'AA 涅里', origin: '肯尼亚', category: '咖啡豆', rating: 4.9, description: '浓郁黑醋栗，番茄明亮酸，层次复杂顶级果酸。', notes: ['黑醋栗', '番茄', '黑莓', '蔗糖'], specs: ['100g', '250g'], prices: { '100g': 72, '250g': 138 }, image: '/picture/yejiaxuefei.png', story: '肯尼亚涅里产区严格 AA 分级，双重水洗发酵，高海拔冷凉环境造就极致明亮果酸，酸度干净锐利，是果酸爱好者天花板单品。', brewingGuide: '水温 93℃，粉水比 1:16，细粉慢萃，时长 2 分整。', process: '双重水洗单一产地', variety: 'SL28/SL34' },
    { id: 6, name: '巴拿马 瑰夏 水洗', origin: '巴拿马', category: '咖啡豆', rating: 4.8, description: '顶级瑰夏花香，佛手柑白茶，高端浅烘稀缺单品。', notes: ['佛手柑', '白茶', '荔枝', '蜂蜜'], specs: ['100g', '250g'], prices: { '100g': 78, '250g': 142 }, image: '/picture/yejiaxuefei.png', story: '巴拿马翡翠庄园同风土瑰夏树种，高海拔遮阴种植，精细水洗处理，标志性茉莉佛手柑花香，精品咖啡高端代表。', brewingGuide: '水温 90℃，粉水比 1:16，极浅烘，分段轻柔注水避免过萃。', process: '水洗单一产地', variety: 'Gesha 瑰夏种' },
    { id: 7, name: '哥斯达黎加 蜜处理 黑蜜', origin: '哥斯达黎加', category: '咖啡豆', rating: 4.7, description: '蜜饯桃子甜，柔和果汁感，中度蜜处理特色甜感。', notes: ['水蜜桃', '蜜饯', '香草', '黄糖'], specs: ['100g', '250g'], prices: { '100g': 58, '250g': 108 }, image: '/picture/yejiaxuefei.png', story: '哥斯达黎加塔拉珠庄园黑蜜处理，保留大量果胶晾晒，糖分富集，果汁甜感突出，酸度柔和不刺激。', brewingGuide: '水温 90℃，粉水比 1:15，两段注水，萃取 2 分钟。', process: '黑蜜处理单一产地', variety: 'Catuai 卡杜艾' },
    { id: 8, name: '埃塞 罕贝拉 日晒花魁', origin: '埃塞俄比亚', category: '咖啡豆', rating: 4.8, description: '草莓蓝莓果汁，浓郁热带水果，日晒发酵饱满果香。', notes: ['草莓', '蓝莓', '芒果', '果脯'], specs: ['100g', '250g'], prices: { '100g': 70, '250g': 132 }, image: '/picture/yejiaxuefei.png', story: '埃塞俄比亚罕贝拉日晒产区，完整果荚晾晒长时间发酵，浓郁热带浆果风味，网红爆款日晒精品豆。', brewingGuide: '水温 91℃，粉水比 1:15，浅中烘，充分释放果香。', process: '日晒单一产地', variety: 'Heirloom 原生种' },
    { id: 9, name: '印尼 苏门答腊 曼特宁', origin: '印尼', category: '咖啡豆', rating: 4.7, description: '草本泥土香料，低酸厚重，草本木质醇厚深烘。', notes: ['草本', '丁香', '黑巧克力', '松木'], specs: ['100g', '250g'], prices: { '100g': 46, '250g': 88 }, image: '/picture/mantening.png', story: '苏门答腊湿刨法独特处理，潮湿环境带来标志性泥土草本调性，醇厚度极高，适合偏爱厚重低酸咖啡人群。', brewingGuide: '水温 89℃，粉水比 1:13，深烘缩短萃取，避免苦涩。', process: '湿刨法单一产地', variety: 'Tim Tim 蒂姆蒂姆' },
    { id: 10, name: '秘鲁 有机 水洗波旁', origin: '秘鲁', category: '咖啡豆', rating: 4.8, description: '干净梨子花香，柔和均衡，有机认证温和口粮豆。', notes: ['梨子', '白桃', '白花香', '麦芽糖'], specs: ['100g', '250g'], prices: { '100g': 64, '250g': 122 }, image: '/picture/yejiaxuefei.png', story: '秘鲁北部有机认证庄园，无化肥农药种植，波旁种水洗处理，风味干净柔和，低刺激适合日常每日饮用。', brewingGuide: '水温 92℃，粉水比 1:15，三段均衡萃取。', process: '有机水洗单一产地', variety: 'Bourbon 波旁' }
  ],
  equipment: {
    id: Number(route.params.id || 1),
    name: 'Breville 870 意式咖啡机',
    category: '咖啡机',
    description: '双锅炉系统，精准控温，专业奶泡系统。',
    notes: ['专业', '精准', '高端'],
    specs: ['标准版'],
    price: 4999,
    image: '/picture/store1.png',
    story: 'Breville是澳大利亚著名的小家电品牌，以创新设计和卓越品质著称。',
    process: '全自动',
    altitude: '-',
    variety: '意式'
  }
}

const normalizeProduct = (data) => {
  if (!data) return null
  
  const isEquipment = data.category === '咖啡机' || 
                      data.category === '冲煮器具' || 
                      data.category === '研磨器具' || 
                      data.category === '杯具' || 
                      data.category === '辅助器具'
  
  const sizes = data.specs || data.weights || (isEquipment ? ['标准版'] : ['100g', '250g'])
  const prices = data.prices || (typeof data.price === 'number' ? { [sizes[0]]: data.price } : {})
  
  const aromaNotes = data.aroma ? data.aroma.split('、').filter(n => n.trim()) : []
  
  return {
    id: data.id || Number(route.params.id || 1),
    name: data.name || (isEquipment ? mockProducts.equipment.name : mockProducts.beans.name),
    origin: data.origin || '',
    category: data.category || (isEquipment ? '咖啡机' : '咖啡豆'),
    rating: data.rating ?? 4.8,
    reviews: data.reviews ?? data.reviewCount ?? 0,
    description: data.description || (isEquipment ? mockProducts.equipment.description : mockProducts.beans.description),
    brewingGuide: data.brewingGuide || data.brewing_guide || (isEquipment ? '-' : mockProducts.beans.brewingGuide),
    notes: (data.notes && data.notes.length > 0) ? data.notes : 
        (data.flavorNotes && data.flavorNotes.length > 0) ? data.flavorNotes : 
        (aromaNotes.length > 0 ? aromaNotes : (isEquipment ? ['专业', '优质'] : mockProducts.beans.notes)),
    specs: sizes,
    prices,
    price: data.price || (isEquipment ? 4999 : 128),
    image: data.image || (isEquipment ? `/picture/store${Number(route.params.id || 1)}.png` : mockProducts.beans.image),
    story: data.story || `${data.name}产自${data.origin}${data.region ? ' '+data.region : ''}地区，海拔${data.altitude || '1700-2000m'}，采用${data.process || '水洗'}处理法，${data.variety ? '品种为'+data.variety+'。' : ''}是一款风味独特的精品咖啡豆。`,
    process: data.process || (isEquipment ? '专业级' : '水洗处理'),
    altitude: data.altitude || (isEquipment ? '-' : '1800-2200m'),
    variety: data.variety || (isEquipment ? data.category : 'Heirloom')
  }
}

const loadProduct = async () => {
  try {
    const { code, data } = await mockGetBeanById(route.params.id)
    if (code === 200 && data) {
      product.value = normalizeProduct(data)
    } else {
      const id = Number(route.params.id || 1)
      const { code: fallbackCode, data: fallbackData } = await mockGetBeanById(id)
      product.value = normalizeProduct(fallbackCode === 200 ? fallbackData : mockProducts.beans)
    }
  } catch {
    const id = Number(route.params.id || 1)
    const { code, data } = await mockGetBeanById(id)
    product.value = normalizeProduct(code === 200 ? data : mockProducts.beans)
  } finally {
    isLoading.value = false
  }
}

const addToCart = async () => {
  if (!userStore.isLoggedIn) {
    router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  if (isAddingToCart.value) return
  isAddingToCart.value = true
  await cartStore.addItem({ 
    id: product.value.id, 
    name: product.value.name, 
    price: price.value, 
    image: product.value.image, 
    weight: selectedSpec.value, 
    category: product.value.category, 
    origin: product.value.origin 
  })
  ElMessage.success('已加入购物车')
  setTimeout(() => { isAddingToCart.value = false }, 600)
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + images.value.length) % images.value.length
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

const openImageModal = () => {
  isImageModalOpen.value = true
}

const closeImageModal = () => {
  isImageModalOpen.value = false
}

const tabs = [
  { key: 'story', label: '产品故事' },
  { key: 'brewing', label: '冲泡建议' },
  { key: 'info', label: '产品信息' }
]

const getTabContent = (key) => {
  switch (key) {
    case 'story': return product.value?.story || ''
    case 'brewing': return product.value?.brewingGuide || ''
    case 'info': return null
    default: return ''
  }
}

watch(selectedWeight, () => {
})

onMounted(() => {
  loadProduct()
})
</script>

<template>
  <div class="detail-page">
    <NavBar @toggle-menu="isMenuOpen = true" @toggle-cart="isCartOpen = true" />
    <SideMenu :is-open="isMenuOpen" @close="isMenuOpen = false" />
    <CartSidebar :is-open="isCartOpen" @close="isCartOpen = false" />

    <section class="container detail-shell">
      <button class="back-btn" @click="router.back()">
        <ArrowLeft :size="18" />
        <span>返回</span>
      </button>
      
      <div v-if="isLoading" class="detail-grid">
        <div class="image-box skeleton"></div>
        <div class="info-box card skeleton"></div>
      </div>

      <div v-else-if="product" class="detail-grid">
        <div class="image-box card">
          <div class="image-carousel" @click="openImageModal">
            <div class="carousel-main">
              <img 
                :src="currentImage" 
                :alt="product.name" 
                loading="lazy" 
                class="carousel-image"
              />
              <div class="carousel-overlay">
                <span class="view-hint">点击查看大图</span>
              </div>
            </div>
            <button class="carousel-btn prev" @click.stop="prevImage">
              <CaretLeft :size="24" />
            </button>
            <button class="carousel-btn next" @click.stop="nextImage">
              <CaretRight :size="24" />
            </button>
            <div class="carousel-indicators">
              <span 
                v-for="(_, index) in images" 
                :key="index" 
                class="indicator"
                :class="{ active: index === currentImageIndex }"
                @click.stop="currentImageIndex = index"
              ></span>
            </div>
          </div>
        </div>
        
        <div class="info-box card">
          <p class="eyebrow">{{ product.category }}</p>
          <div class="title-row">
            <h1 class="title">{{ product.name }}</h1>
            <span v-if="product.origin" class="origin-tag">{{ product.origin }}</span>
          </div>
          
          <div v-if="product.rating > 0" class="rating-row">
            <div class="stars">
              <Star v-for="n in filledStars" :key="'filled-' + n" :size="16" fill="#4A3C31" color="#4A3C31" />
              <span v-if="hasHalfStar" :key="'half'" class="half-star">
                <Star :size="16" fill="#4A3C31" color="#4A3C31" />
              </span>
              <Star v-for="n in emptyStars" :key="'empty-' + n" :size="16" color="#B8A999" />
            </div>
            <strong class="rating-value">{{ product.rating }}</strong>
            <span class="reviews-count">{{ product.reviews }} 条评价</span>
          </div>
          
          <p class="desc">{{ product.description }}</p>

          <div class="section">
            <h3>规格选择</h3>
            <div class="specs">
              <button 
                v-for="spec in specOptions" 
                :key="spec" 
                class="spec-btn" 
                :class="{ active: selectedWeight === spec }" 
                @click="selectedWeight = spec"
              >
                {{ spec }}
              </button>
            </div>
          </div>

          <div class="section">
            <h3>风味关键词</h3>
            <div class="tags">
              <div 
                v-for="note in product.notes" 
                :key="note" 
                class="tag-wrapper"
              >
                <span class="tag">{{ note }}</span>
                <span v-if="flavorDescriptions[note]" class="tag-tooltip">{{ flavorDescriptions[note] }}</span>
              </div>
            </div>
          </div>

          <div class="buy-row">
            <div class="price-wrap">
              <span class="price-label">售价</span>
              <span class="price">¥{{ price }}</span>
            </div>
            <div class="buy-actions">
              <button class="add-cart-btn" :class="{ adding: isAddingToCart }" @click="addToCart">
                <ShoppingCart :size="16" />
                <span>加入购物车</span>
              </button>
              <button class="buy-now-btn btn" @click="addToCart">立即购买</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="product" class="container info-section">
      <div class="tabs-header">
        <button 
          v-for="tab in tabs" 
          :key="tab.key" 
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      <Transition name="tab-content" mode="out-in">
        <div v-if="activeTab === 'info'" key="info" class="info-grid">
          <div class="info-card card">
            <h3 class="card-title">产品信息</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">类型</span>
                <span class="info-value">{{ product.process }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">规格</span>
                <span class="info-value">{{ product.variety }}</span>
              </div>
              <div v-if="product.altitude !== '-'" class="info-item">
                <span class="info-label">海拔</span>
                <span class="info-value">{{ product.altitude }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else key="content" class="tab-content-box card">
          <h3 class="card-title">{{ tabs.find(t => t.key === activeTab)?.label }}</h3>
          <p class="card-text">{{ getTabContent(activeTab) }}</p>
        </div>
      </Transition>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isImageModalOpen" class="image-modal-overlay" @click="closeImageModal">
          <div class="image-modal-content" @click.stop>
            <button class="modal-close" @click="closeImageModal">
              <span>×</span>
            </button>
            <img :src="currentImage" :alt="product?.name" class="modal-image" />
            <div class="modal-nav">
              <button class="modal-nav-btn" @click="prevImage">
                <CaretLeft :size="32" />
              </button>
              <button class="modal-nav-btn" @click="nextImage">
                <CaretRight :size="32" />
              </button>
            </div>
            <div class="modal-indicators">
              <span 
                v-for="(_, index) in images" 
                :key="index" 
                class="indicator"
                :class="{ active: index === currentImageIndex }"
                @click="currentImageIndex = index"
              ></span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--color-bg);
}

.detail-shell {
  padding-top: 120px;
  padding-bottom: 64px;
}

.info-section {
  padding-bottom: 64px;
}

.back-btn {
  margin-bottom: 20px;
  color: var(--color-muted);
  font-size: var(--fs-body);
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  padding: 8px 0;
  transition: all 0.3s ease;
}

.back-btn:hover {
  color: var(--color-primary);
  transform: translateX(-3px);
}

.back-btn svg {
  transition: transform 0.3s ease;
}

.back-btn:hover svg {
  transform: translateX(-2px);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 24px;
  align-items: start;
}

.image-box {
  min-height: 560px;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
}

.image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-main {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carousel-main:hover .carousel-image {
  transform: scale(1.02);
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0,0,0,0.3));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.carousel-main:hover .carousel-overlay {
  opacity: 1;
}

.view-hint {
  color: rgba(255,255,255,0.8);
  font-size: 13px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  border: 1px solid var(--color-line);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-btn.prev {
  left: 16px;
}

.carousel-btn.next {
  right: 16px;
}

.image-carousel:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 24px;
  border-radius: 4px;
  background: #fff;
}

.info-box {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
  animation: infoSlideIn 0.5s ease 0.2s forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes infoSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.eyebrow {
  font-size: var(--fs-small);
  letter-spacing: 0.22em;
  color: var(--color-muted);
  text-transform: uppercase;
  margin: 0;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  font-size: var(--fs-h1);
  font-family: var(--font-display);
  color: var(--color-primary);
  line-height: 1.15;
  margin: 0;
}

.origin-tag {
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(200, 184, 168, 0.15);
  color: #7A6B5A;
  font-size: 13px;
  margin-top: 8px;
}

.rating-row {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--color-muted);
}

.stars {
  display: flex;
  gap: 2px;
}

.half-star {
  position: relative;
  overflow: hidden;
  width: 10px;
}

.rating-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
}

.reviews-count {
  font-size: 13px;
  color: var(--color-muted);
}

.desc, .section p {
  line-height: 1.8;
  color: var(--color-text);
  font-size: var(--fs-body);
  margin: 0;
}

.section {
  padding: 20px 0;
  border-top: 1px dashed var(--color-line);
}

.section:first-of-type {
  border-top: none;
}

.section h3 {
  font-size: var(--fs-h3);
  color: var(--color-primary);
  margin-bottom: 16px;
}

.specs, .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-btn {
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(245, 240, 232, 0.8);
  border: 1.5px solid rgba(184, 169, 153, 0.4);
  color: var(--color-primary);
  font-size: var(--fs-body);
  font-weight: 500;
  transition: all 0.3s ease;
}

.spec-btn:hover {
  border-color: var(--color-primary);
  background: rgba(200, 184, 168, 0.15);
}

.spec-btn.active {
  background: #4A3C31;
  color: #fff;
  border-color: #4A3C31;
  transform: scale(1.02);
}

.tag-wrapper {
  position: relative;
}

.tag {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(200, 184, 168, 0.16);
  color: var(--color-primary);
  font-size: var(--fs-body);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag:hover {
  background: rgba(200, 184, 168, 0.3);
  transform: translateY(-2px);
}

.tag-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 14px;
  background: rgba(74, 60, 49, 0.95);
  color: #fff;
  font-size: 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}

.tag-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(74, 60, 49, 0.95);
}

.tag-wrapper:hover .tag-tooltip {
  opacity: 1;
  visibility: visible;
}

.buy-row {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px dashed var(--color-line);
}

.price-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label {
  font-size: 13px;
  color: var(--color-muted);
}

.price {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary);
  font-family: 'SF Mono', monospace;
  transition: all 0.3s ease;
}

.buy-actions {
  display: flex;
  gap: 12px;
}

.add-cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  background: rgba(245, 240, 232, 0.8);
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  font-size: var(--fs-body);
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.add-cart-btn svg {
  width: 18px !important;
  height: 18px !important;
}

.add-cart-btn:hover {
  background: rgba(74, 60, 49, 0.05);
  transform: translateY(-2px);
}

.add-cart-btn.adding {
  animation: cartBounce 0.4s ease;
}

@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}

.buy-now-btn {
  padding: 14px 32px;
  background: #4A3C31;
  color: #fff;
  font-size: var(--fs-body);
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.buy-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 60, 49, 0.25);
}

.tabs-header {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  background: var(--color-surface);
  padding: 6px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
}

.tab-btn {
  flex: 1;
  padding: 14px 20px;
  background: transparent;
  color: var(--color-muted);
  font-size: var(--fs-body);
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #fff;
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(74, 60, 49, 0.08);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.tab-content-box {
  padding: 28px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
}

.info-card {
  padding: 28px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-line);
  background: var(--color-surface);
}

.card-title {
  font-size: var(--fs-h3);
  color: var(--color-primary);
  margin-bottom: 14px;
}

.card-text {
  line-height: 1.8;
  color: var(--color-text);
  font-size: var(--fs-body);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed var(--color-line);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: var(--fs-body);
  color: var(--color-muted);
}

.info-value {
  font-size: var(--fs-body);
  color: var(--color-primary);
  font-weight: 500;
}

.tab-content-enter-active,
.tab-content-leave-active {
  transition: all 0.3s ease;
}

.tab-content-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.tab-content-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0,0,0,0.7);
}

.modal-image {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
}

.modal-nav {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.modal-nav-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.modal-nav-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

.modal-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.modal-indicators .indicator {
  background: rgba(255,255,255,0.4);
}

.modal-indicators .indicator.active {
  background: #fff;
}

@media (max-width: 960px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .image-box {
    min-height: 380px;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .info-box {
    padding: 24px;
  }
  .buy-row {
    flex-direction: column;
    align-items: stretch;
  }
  .buy-actions {
    width: 100%;
  }
  .add-cart-btn, .buy-now-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
