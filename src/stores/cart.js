import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cart } from '../api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isLoaded = ref(false)

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const price = item.product?.price || 0
      return sum + price * item.quantity
    }, 0)
  })

  const loadCart = async () => {
    try {
      const data = await cart.getItems()
      items.value = data || []
    } catch (error) {
      console.error('Failed to load cart:', error)
      items.value = []
    }
    isLoaded.value = true
  }

  const addItem = async (product, productType, quantity = 1) => {
    try {
      const result = await cart.addItem({
        productType,
        productId: product.id,
        quantity
      })
      await loadCart()
      return result
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) {
      await removeItem(cartId)
      return
    }
    try {
      await cart.updateQuantity(cartId, { quantity })
      await loadCart()
    } catch (error) {
      console.error('Failed to update cart item:', error)
      throw error
    }
  }

  const removeItem = async (cartId) => {
    try {
      await cart.removeItem(cartId)
      await loadCart()
    } catch (error) {
      console.error('Failed to remove cart item:', error)
      throw error
    }
  }

  const clearAll = async () => {
    try {
      await cart.clearCart()
      items.value = []
    } catch (error) {
      console.error('Failed to clear cart:', error)
      throw error
    }
  }

  const getItems = () => {
    return items.value
  }

  return {
    items,
    isLoaded,
    totalCount,
    totalPrice,
    loadCart,
    addItem,
    updateQuantity,
    removeItem,
    clearAll,
    getItems
  }
})
