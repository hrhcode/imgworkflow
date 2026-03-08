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

  /**
   * 根据质量参数计算目标文件大小
   * browser-image-compression 主要通过 maxSizeMB 控制压缩程度
   * initialQuality 只是初始值，库会迭代调整直到满足大小要求
   */
  const originalSizeMB = file.size / 1024 / 1024
  const targetSizeMB = Math.max(0.1, originalSizeMB * quality * 0.8)

  const compressionOptions = {
    maxSizeMB: targetSizeMB,
    maxWidthOrHeight: maxWidth || maxHeight ? Math.max(maxWidth || 1920, maxHeight || 1920) : 1920,
    useWebWorker: true,
    initialQuality: quality,
    alwaysKeepResolution: false,
    maxIteration: 20
  }

  if (maxWidth || maxHeight) {
    compressionOptions.maxWidthOrHeight = Math.max(maxWidth || 1920, maxHeight || 1920)
  }

  try {
    console.log(`压缩前: ${originalSizeMB.toFixed(2)}MB, 目标: ${targetSizeMB.toFixed(2)}MB, 质量: ${quality}`)
    const compressedFile = await imageCompression(file, compressionOptions)
    const compressedSizeMB = compressedFile.size / 1024 / 1024
    console.log(`压缩后: ${compressedSizeMB.toFixed(2)}MB, 压缩率: ${((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1)}%`)
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
