/**
 * MIME类型映射
 */
const MIME_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  avif: 'image/avif'
}

/**
 * 根据原始文件名创建File对象，更新扩展名
 * @param {Blob} blob - 图片Blob
 * @param {string} originalName - 原始文件名
 * @param {string} newFormat - 新格式
 * @returns {File} - 带有更新后文件名的File对象
 */
function createFileWithOriginalName(blob, originalName, newFormat) {
  const baseName = originalName.replace(/\.[^/.]+$/, '')
  const newFileName = `${baseName}.${newFormat}`
  const mimeType = MIME_TYPES[newFormat] || 'image/png'
  return new File([blob], newFileName, { type: mimeType })
}

/**
 * 检查浏览器是否支持AVIF格式
 */
function checkAvifSupport() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/avif').startsWith('data:image/avif')
}

/**
 * 转换图片格式
 * @param {File|Blob} file - 原始图片文件
 * @param {string} targetFormat - 目标格式 (png/jpg/webp/gif/bmp/avif)
 * @param {number} quality - 质量 (0-1)，仅对jpg、webp和avif有效
 * @returns {Promise<File>} - 转换后的图片File（保留原始文件名，扩展名根据格式更新）
 */
export async function convertImageFormat(file, targetFormat = 'png', quality = 0.92) {
  const format = targetFormat.toLowerCase()
  
  // BMP格式特殊处理 - 直接返回原始数据（如果已经是BMP）或简单转换
  if (format === 'bmp') {
    const bmpBlob = await convertToBmp(file)
    return createFileWithOriginalName(bmpBlob, file.name || 'image.png', format)
  }
  
  // AVIF格式检查支持性
  if (format === 'avif' && !checkAvifSupport()) {
    throw new Error('您的浏览器不支持AVIF格式，请使用Chrome 96+或其他支持AVIF的浏览器')
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        
        // 对于JPG格式，填充白色背景（因为JPG不支持透明）
        if (format === 'jpg' || format === 'jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        ctx.drawImage(img, 0, 0)
        
        const mimeType = MIME_TYPES[format] || 'image/png'
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resultFile = createFileWithOriginalName(blob, file.name || 'image.png', format)
              resolve(resultFile)
            } else {
              reject(new Error('图片格式转换失败'))
            }
          },
          mimeType,
          quality
        )
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 转换为BMP格式
 * @param {File|Blob} file - 原始图片文件
 * @returns {Promise<Blob>} - BMP格式的Blob
 */
async function convertToBmp(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        // 获取ImageData
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const bmpBlob = createBmpFromImageData(imageData)
        resolve(bmpBlob)
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 从ImageData创建BMP Blob
 * @param {ImageData} imageData - 图像数据
 * @returns {Blob} - BMP格式的Blob
 */
function createBmpFromImageData(imageData) {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  
  // BMP文件头 (14字节) + DIB头 (40字节)
  const headerSize = 54
  // 每行需要4字节对齐
  const rowSize = Math.ceil((width * 3) / 4) * 4
  const padding = rowSize - width * 3
  const imageSize = rowSize * height
  const fileSize = headerSize + imageSize
  
  const buffer = new ArrayBuffer(fileSize)
  const view = new DataView(buffer)
  
  // BMP文件头
  view.setUint8(0, 0x42) // 'B'
  view.setUint8(1, 0x4D) // 'M'
  view.setUint32(2, fileSize, true) // 文件大小
  view.setUint32(6, 0, true) // 保留
  view.setUint32(10, headerSize, true) // 像素数据偏移
  
  // DIB头 (BITMAPINFOHEADER)
  view.setUint32(14, 40, true) // DIB头大小
  view.setInt32(18, width, true) // 宽度
  view.setInt32(22, height, true) // 高度（正值表示从下到上）
  view.setUint16(26, 1, true) // 颜色平面数
  view.setUint16(28, 24, true) // 每像素位数
  view.setUint32(30, 0, true) // 压缩方式（无压缩）
  view.setUint32(34, imageSize, true) // 图像数据大小
  view.setInt32(38, 2835, true) // 水平分辨率 (72 DPI)
  view.setInt32(42, 2835, true) // 垂直分辨率 (72 DPI)
  view.setUint32(46, 0, true) // 调色板颜色数
  view.setUint32(50, 0, true) // 重要颜色数
  
  // 像素数据 (BGR格式，从下到上)
  let offset = headerSize
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      view.setUint8(offset++, data[i + 2]) // B
      view.setUint8(offset++, data[i + 1]) // G
      view.setUint8(offset++, data[i])     // R
    }
    // 添加行填充
    for (let p = 0; p < padding; p++) {
      view.setUint8(offset++, 0)
    }
  }
  
  return new Blob([buffer], { type: 'image/bmp' })
}

/**
 * 批量转换图片格式
 * @param {File[]} files - 图片文件数组
 * @param {string} targetFormat - 目标格式
 * @param {number} quality - 质量
 * @returns {Promise<Blob[]>} - 转换后的图片Blob数组
 */
export async function convertImagesFormat(files, targetFormat = 'png', quality = 0.92) {
  const results = []
  for (const file of files) {
    try {
      const converted = await convertImageFormat(file, targetFormat, quality)
      results.push(converted)
    } catch (error) {
      console.error(`转换图片 ${file.name} 失败:`, error)
    }
  }
  return results
}

/**
 * 调整图片尺寸
 * @param {File|Blob} file - 原始图片文件
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @param {boolean} keepAspectRatio - 是否保持宽高比
 * @returns {Promise<Blob>} - 调整后的图片Blob
 */
export async function resizeImage(file, width, height, keepAspectRatio = true) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        let targetWidth = width
        let targetHeight = height
        
        if (keepAspectRatio) {
          const aspectRatio = img.width / img.height
          if (width && height) {
            if (width / height > aspectRatio) {
              targetWidth = height * aspectRatio
              targetHeight = height
            } else {
              targetWidth = width
              targetHeight = width / aspectRatio
            }
          } else if (width) {
            targetWidth = width
            targetHeight = width / aspectRatio
          } else if (height) {
            targetHeight = height
            targetWidth = height * aspectRatio
          }
        }
        
        const canvas = document.createElement('canvas')
        canvas.width = targetWidth || img.width
        canvas.height = targetHeight || img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('图片尺寸调整失败'))
            }
          },
          file.type || 'image/png'
        )
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

export default {
  convertImageFormat,
  convertImagesFormat,
  resizeImage
}
