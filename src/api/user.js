import request from '../utils/request'

/**
 * 用户登录接口
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 登录结果
 */
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册接口
 * @param {Object} data - 注册数据
 * @param {string} data.username - 用户名
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 密码
 * @returns {Promise} - 注册结果
 */
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

/**
 * 忘记密码接口
 * @param {Object} data - 忘记密码数据
 * @param {string} data.email - 邮箱
 * @returns {Promise} - 忘记密码结果
 */
export const forgotPassword = (data) => {
  return request({
    url: '/auth/forgot-password',
    method: 'post',
    data
  })
}

/**
 * 重置密码接口
 * @param {Object} data - 重置密码数据
 * @param {string} data.email - 邮箱
 * @param {string} data.password - 新密码
 * @returns {Promise} - 重置密码结果
 */
export const resetPassword = (data) => {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息接口
 * @returns {Promise} - 用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 更新用户信息接口
 * @param {Object} data - 更新数据
 * @returns {Promise} - 更新结果
 */
export const updateUserInfo = (data) => {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}
