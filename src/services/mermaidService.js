import mermaid from 'mermaid'
import { nextTick } from 'vue'

let initialized = false

/**
 * 初始化Mermaid
 */
function initMermaid() {
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Microsoft YaHei, sans-serif'
    })
    initialized = true
  }
}

/**
 * 渲染Mermaid图表
 * @param {string} code - Mermaid代码
 * @returns {Promise<string>} - SVG字符串
 */
export async function renderMermaid(code) {
  initMermaid()
  
  try {
    const id = 'mermaid-' + Date.now()
    const { svg } = await mermaid.render(id, code)
    return svg
  } catch (error) {
    console.error('Mermaid渲染失败:', error)
    throw new Error('Mermaid渲染失败: ' + error.message)
  }
}

/**
 * 将Mermaid图表导出为图片
 * @param {string} code - Mermaid代码
 * @param {string} format - 输出格式 (png/svg)
 * @returns {Promise<Blob>} - 图片Blob
 */
export async function exportMermaidToImage(code, format = 'png') {
  const svg = await renderMermaid(code)
  
  if (format === 'svg') {
    return new Blob([svg], { type: 'image/svg+xml' })
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = 2 // 提高分辨率
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('图片生成失败'))
          }
        },
        'image/png',
        1.0
      )
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('SVG加载失败'))
    }
    
    img.src = url
  })
}

export default {
  renderMermaid,
  exportMermaidToImage
}
