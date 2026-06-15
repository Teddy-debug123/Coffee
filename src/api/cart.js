import request from '../utils/request'

/**
 * 获取购物车列表
 * @returns {Promise} - 购物车列表
 */
export const getCartItems = () => {
  return request({
    url: '/cart/list',
    method: 'get'
  })
}

/**
 * 添加购物车商品
 * @param {Object} data - 商品数据
 * @param {number} data.productId - 商品ID
 * @param {string} data.name - 商品名称
 * @param {number} data.price - 商品价格
 * @param {string} data.image - 商品图片
 * @param {number} data.quantity - 数量
 * @returns {Promise} - 添加结果
 */
export const addCartItem = (data) => {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

/**
 * 更新购物车商品
 * @param {number} itemId - 购物车商品ID
 * @param {Object} data - 更新数据
 * @param {number} data.quantity - 新数量
 * @returns {Promise} - 更新结果
 */
export const updateCartItem = (itemId, data) => {
  return request({
    url: `/cart/update/${itemId}`,
    method: 'put',
    data
  })
}

/**
 * 删除购物车商品
 * @param {number} itemId - 购物车商品ID
 * @returns {Promise} - 删除结果
 */
export const deleteCartItem = (itemId) => {
  return request({
    url: `/cart/delete/${itemId}`,
    method: 'delete'
  })
}

/**
 * 清空购物车
 * @returns {Promise} - 清空结果
 */
export const clearCart = () => {
  return request({
    url: '/cart/clear',
    method: 'delete'
  })
}