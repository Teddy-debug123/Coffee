<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Star, CaretLeft, CaretRight, ShoppingCart } from '@element-plus/icons-vue'
import NavBar from '../../components/NavBar.vue'
import SideMenu from '../../components/SideMenu.vue'
import CartSidebar from '../../components/CartSidebar.vue'
import { useCartStore } from '../../stores/cart'
import { useUserStore } from '../../stores/user'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const isLoading = ref(false)
const selectedWeight = ref('100g')
const currentImageIndex = ref(0)
const isImageModalOpen = ref(false)
const activeTab = ref('story')
const isAddingToCart = ref(false)

const productData = {
  name: '巴拿马 瑰夏',
  origin: '巴拿马',
  category: '咖啡豆',
  rating: 4.8,
  reviews: 128,
  description: '顶级瑰夏花香，佛手柑白茶，高端浅烘稀缺单品。',
  brewingGuide: '水温 90，粉水比 1:16，极浅烘，分段轻柔注水避免过萃。',
  notes: ['佛手柑', '白茶', '荔枝', '蜂蜜'],
  specs: ['100g', '250g'],
  prices: { '100g': 78, '250g': 142 },
  image: '/coffee-images/6.jpg',
  images: ['/coffee-images/6.jpg', '/coffee-images/6.jpg', '/coffee-images/6.jpg'],
  story: '巴拿马翡翠庄园同风土瑰夏树种，高海拔遮阴种植，精细水洗处理，标志性茉莉佛手柑花香，精品咖啡高端代表。',
  process: '水洗单一产地',
  altitude: '1600-1800m',
  variety: 'Gesha 瑰夏种'
}

const flavorDescriptions = {
  '佛手柑': '清新佛手柑香气，优雅细腻',
  '白茶': '白茶般的清爽口感，带有花香',
  '荔枝': '新鲜荔枝的甜香，饱满多汁',
  '蜂蜜': '天然蜂蜜的甜美感，带有花香和果糖甜'
}

const selectedSpec = computed(() => selectedWeight.value)
const price = computed(() => productData.prices[selectedWeight.value])
const images = computed(() => productData.images)
const currentImage = computed(() => images.value[currentImageIndex.value] || productData.image)

const addToCart = async () => {
  if (!userStore.isLoggedIn) {
    router.push(\/login?redirect=\)
    return
  }
  if (isAddingToCart.value) return
  isAddingToCart.value = true
  await cartStore.addItem({ 
    id: route.params.beanId || 6, 
    name: productData.name, 
    price: price.value, 
    image: productData.image, 
    weight: selectedSpec.value, 
    category: productData.category, 
    origin: productData.origin 
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

const openImageModal = () => { isImageModalOpen.value = true }
const closeImageModal = () => { isImageModalOpen.value = false }

const tabs = [
  { key: 'story', label: '产品故事' },
  { key: 'brewing', label: '冲泡建议' },
  { key: 'info', label: '产品信息' }
]

const getTabContent = (key) => {
  switch (key) {
    case 'story': return productData.story
    case 'brewing': return productData.brewingGuide
    default: return ''
  }
}

watch(selectedWeight, () => {})
onMounted(() => { isLoading.value = false })
</script>
