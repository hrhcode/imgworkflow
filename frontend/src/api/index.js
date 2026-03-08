import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 60000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    console.error('响应错误：', error)
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request

/**
 * 上传图片
 * @param {FormData} formData - 包含图片文件的FormData
 * @returns {Promise}
 */
export function uploadImages(formData) {
  return request({
    url: '/upload/images',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 压缩图片
 * @param {Object} data - 压缩参数
 * @returns {Promise}
 */
export function compressImages(data) {
  return request({
    url: '/image/compress',
    method: 'post',
    data
  })
}

/**
 * 转换图片格式
 * @param {Object} data - 转换参数
 * @returns {Promise}
 */
export function convertFormat(data) {
  return request({
    url: '/image/convert',
    method: 'post',
    data
  })
}

/**
 * 渲染PlantUML
 * @param {Object} data - PlantUML参数
 * @returns {Promise}
 */
export function renderPlantUML(data) {
  return request({
    url: '/diagram/plantuml',
    method: 'post',
    data
  })
}

/**
 * 渲染Mermaid
 * @param {Object} data - Mermaid参数
 * @returns {Promise}
 */
export function renderMermaid(data) {
  return request({
    url: '/diagram/mermaid',
    method: 'post',
    data
  })
}

/**
 * 下载文件
 * @param {string} fileId - 文件ID
 * @returns {string} - 下载URL
 */
export function getDownloadUrl(fileId) {
  return `/api/download/${fileId}`
}

/**
 * 批量下载文件
 * @returns {string} - 下载URL
 */
export function getBatchDownloadUrl() {
  return '/api/download/batch'
}
