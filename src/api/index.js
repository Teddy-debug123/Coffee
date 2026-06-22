import request from '../utils/request'

export const auth = {
  login: (data) => request.post('/auth/login', data),
  register: (data) => request.post('/auth/register', data),
  forgotPassword: (data) => request.post('/auth/forgot-password', data),
  resetPassword: (data) => request.post('/auth/reset-password', data),
  getCaptcha: () => request.get('/auth/captcha')
}

export const user = {
  getInfo: () => request.get('/user/info'),
  updateInfo: (data) => request.put('/user/info', data)
}

export const products = {
  getBeans: (params) => request.get('/products/beans', { params }),
  getBeanById: (id) => request.get(`/products/beans/${id}`),
  getBeanOrigins: () => request.get('/products/beans/origins'),
  getTopSellingBeans: (params) => request.get('/products/beans/top-selling', { params }),
  getEquipment: (params) => request.get('/products/equipment', { params }),
  getEquipmentById: (id) => request.get(`/products/equipment/${id}`),
  getEquipmentCategories: () => request.get('/products/equipment/categories')
}

export const blend = {
  saveBlend: (data) => request.post('/blend/save', data),
  getRecords: () => request.get('/blend/records'),
  getDetails: (blendId) => request.get(`/blend/details/${blendId}`)
}

export const cart = {
  addItem: (data) => request.post('/cart/add', data),
  updateQuantity: (cartId, data) => request.put(`/cart/update/${cartId}`, data),
  removeItem: (cartId) => request.delete(`/cart/remove/${cartId}`),
  getItems: () => request.get('/cart/items'),
  clearCart: () => request.delete('/cart/clear')
}

export const origin = {
  getPoints: () => request.get('/origin/points'),
  getDetail: (id) => request.get(`/origin/${id}`),
  getList: () => request.get('/origin/list')
}

export const subscription = {
  subscribe: (email) => request.post('/subscription/subscribe', null, { params: { email } }),
  unsubscribe: (email) => request.post('/subscription/unsubscribe', null, { params: { email } }),
  checkStatus: (email) => request.get('/subscription/status', { params: { email } })
}
