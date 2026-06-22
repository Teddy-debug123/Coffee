import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cart } from '../api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isLoaded = ref(false)

  const STORAGE_KEY = 'coffee-cart-items'

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch {
      items.value = []
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch {
      console.error('Failed to save cart to storage')
    }
  }

  const normalizeProductType = (productType, product) => {
    if (productType === 'bean' || productType === 'equipment') return productType
    const raw = (typeof productType === 'string' ? productType : '') || (typeof product?.type === 'string' ? product.type : '') || (typeof product?.category === 'string' ? product.category : '')
    const lowered = raw.trim().toLowerCase()
    if (lowered === 'brewing' || lowered === 'barista' || lowered === 'equipment') return 'equipment'
    if (lowered === 'bean' || lowered === 'beans' || lowered === 'coffee' || lowered === 'coffee_bean') return 'bean'
    if (raw.includes('器具') || raw.includes('咖啡机') || raw.includes('磨豆') || raw.includes('滤杯') || raw.includes('杯') || raw.includes('壶')) return 'equipment'
    return 'bean'
  }

  const normalizeItem = (item) => ({
    ...item,
    id: item.id ?? item.cartId ?? item.productId,
    quantity: Number(item.quantity || 0),
    product: item.product || {
      id: item.productId ?? item.id,
      name: item.name ?? item.productName ?? '咖啡商品',
      price: Number(item.price ?? item.productPrice ?? 0),
      image: item.image ?? item.productImage ?? '',
      weight: item.weight ?? item.spec ?? '',
      origin: item.origin ?? item.productOrigin ?? '',
      category: item.category ?? item.productType ?? ''
    }
  })

  const getItemPrice = (item) => Number(item?.product?.price ?? item?.price ?? 0)
  const totalCount = computed(() => items.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + getItemPrice(item) * Number(item.quantity || 0), 0))

  const loadCart = async () => {
    try {
      const data = await cart.getItems()
      items.value = Array.isArray(data) ? data.map(normalizeItem) : []
    } catch (error) {
      console.error('Failed to load cart from API, using local storage:', error)
      loadFromStorage()
    }
    isLoaded.value = true
  }

  const addItem = async (product, productType = product?.category || product?.type || 'bean', quantity = 1) => {
    const normalizedType = normalizeProductType(productType, product)
    const payload = {
      productType: normalizedType,
      productId: product.id,
      quantity,
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
      origin: product.origin,
      category: product.category
    }

    try {
      const result = await cart.addItem(payload)
      await loadCart()
      return result
    } catch (error) {
      console.error('Failed to add item via API, using local storage:', error)
      const existingIndex = items.value.findIndex(item => 
        item.productId === product.id && item.productType === normalizedType && item.spec === (product.spec || '')
      )
      if (existingIndex >= 0) {
        items.value[existingIndex].quantity += quantity
      } else {
        items.value.push({ ...payload, quantity, spec: product.spec || '' })
      }
      saveToStorage()
      return { success: true }
    }
  }

  const updateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) { await removeItem(cartId); return }
    try { 
      await cart.updateQuantity(cartId, { quantity })
      await loadCart() 
    } catch (error) { 
      console.error('Failed to update cart via API, using local storage:', error)
      const item = items.value.find(i => i.id === cartId || i.cartId === cartId)
      if (item) {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  const removeItem = async (cartId) => {
    try { 
      await cart.removeItem(cartId)
      await loadCart() 
    } catch (error) { 
      console.error('Failed to remove cart item via API, using local storage:', error)
      items.value = items.value.filter(i => i.id !== cartId && i.cartId !== cartId)
      saveToStorage()
    }
  }

  const clearAll = async () => {
    try { 
      await cart.clearCart()
      items.value = [] 
    } catch (error) { 
      console.error('Failed to clear cart via API, using local storage:', error)
      items.value = []
      saveToStorage()
    }
  }

  const getItems = () => items.value

  const addToCart = (product) => {
    return addItem(product, product.category || product.type || 'bean', product.quantity || 1)
  }

  return { items, isLoaded, totalCount, totalPrice, loadCart, addItem, addToCart, updateQuantity, removeItem, clearAll, getItems }
})
