/**
 * 转换图片格式
 * @param {File|Blob} file - 原始图片文件
 * @param {string} targetFormat - 目标格式 (png/jpg/webp)
 * @param {number} quality - 质量 (0-1)，仅对jpg和webp有效
 * @returns {Promise<Blob>} - 转换后的图片Blob
 */
export async function convertImageFormat(file, targetFormat = 'png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        
        // 对于JPG格式，填充白色背景
        if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        ctx.drawImage(img, 0, 0)
        
        let mimeType = 'image/png'
        if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
          mimeType = 'image/jpeg'
        } else if (targetFormat === 'webp') {
          mimeType = 'image/webp'
        }
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
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
