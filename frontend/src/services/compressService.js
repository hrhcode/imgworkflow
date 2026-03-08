import imageCompression from 'browser-image-compression'

/**
 * 压缩等级配置
 */
export const COMPRESS_LEVELS = {
  light: {
    name: '轻度',
    quality: 0.92,
    maxSizeRatio: 0.95,
    desc: '轻度压缩，保持最佳画质，体积略减'
  },
  normal: {
    name: '普通',
    quality: 0.80,
    maxSizeRatio: 0.70,
    desc: '普通压缩，画质与体积平衡'
  },
  strong: {
    name: '强力',
    quality: 0.60,
    maxSizeRatio: 0.40,
    desc: '强力压缩，画质略有损失，体积显著减小'
  },
  extreme: {
    name: '极强',
    quality: 0.40,
    maxSizeRatio: 0.20,
    desc: '极强压缩，画质损失较大，体积最小'
  }
}

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.quality - 压缩质量 (0-1)
 * @param {number} options.maxWidth - 最大宽度
 * @param {number} options.maxHeight - 最大高度
 * @param {number} options.maxSizeRatio - 目标文件大小比例 (0-1)
 * @returns {Promise<File>} - 压缩后的图片文件
 */
export async function compressImage(file, options = {}) {
  const {
    quality = 0.8,
    maxWidth = undefined,
    maxHeight = undefined,
    maxSizeRatio = 0.7
  } = options

  const originalSizeMB = file.size / 1024 / 1024
  const targetSizeMB = Math.max(0.1, originalSizeMB * maxSizeRatio)

  const compressionOptions = {
    maxSizeMB: targetSizeMB,
    useWebWorker: true,
    initialQuality: quality,
    alwaysKeepResolution: false,
    maxIteration: 20
  }

  if (maxWidth || maxHeight) {
    compressionOptions.maxWidthOrHeight = Math.max(maxWidth || maxHeight, maxHeight || maxWidth)
  }

  try {
    console.log(`压缩前: ${originalSizeMB.toFixed(2)}MB, 目标: ${targetSizeMB.toFixed(2)}MB, 质量: ${(quality * 100).toFixed(0)}%`)
    const compressedFile = await imageCompression(file, compressionOptions)
    const compressedSizeMB = compressedFile.size / 1024 / 1024
    const compressionRatio = ((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1)
    console.log(`压缩后: ${compressedSizeMB.toFixed(2)}MB, 压缩率: ${compressionRatio}%`)
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
  compressImages,
  COMPRESS_LEVELS
}
