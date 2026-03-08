import imageCompression from 'browser-image-compression'

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.quality - 压缩质量 (0-1)
 * @param {number} options.maxWidth - 最大宽度
 * @param {number} options.maxHeight - 最大高度
 * @returns {Promise<File>} - 压缩后的图片文件
 */
export async function compressImage(file, options = {}) {
  const {
    quality = 0.8,
    maxWidth = undefined,
    maxHeight = undefined
  } = options

  const compressionOptions = {
    maxSizeMB: 10,
    maxWidthOrHeight: Math.max(maxWidth || 4096, maxHeight || 4096),
    useWebWorker: true,
    initialQuality: quality
  }

  if (maxWidth && maxHeight) {
    compressionOptions.maxWidthOrHeight = Math.max(maxWidth, maxHeight)
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    return compressedFile
  } catch (error) {
    console.error('图片压缩失败:', error)
    throw new Error('图片压缩失败: ' + error.message)
  }
}

/**
 * 批量压缩图片
 * @param {File[]} files - 图片文件数组
 * @param {Object} options - 压缩选项
 * @returns {Promise<File[]>} - 压缩后的图片文件数组
 */
export async function compressImages(files, options = {}) {
  const results = []
  for (const file of files) {
    try {
      const compressed = await compressImage(file, options)
      results.push(compressed)
    } catch (error) {
      console.error(`压缩图片 ${file.name} 失败:`, error)
    }
  }
  return results
}

export default {
  compressImage,
  compressImages
}
