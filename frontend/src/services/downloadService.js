import JSZip from 'jszip'

/**
 * 下载单个文件
 * @param {Blob} blob - 文件Blob
 * @param {string} filename - 文件名
 */
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 批量下载文件（打包为ZIP）
 * @param {Array<{blob: Blob, name: string}>} files - 文件数组
 * @param {string} zipName - ZIP文件名
 */
export async function downloadAsZip(files, zipName = 'images.zip') {
  const zip = new JSZip()
  
  for (const file of files) {
    zip.file(file.name, file.blob)
  }
  
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  downloadFile(zipBlob, zipName)
}

/**
 * 下载图片
 * @param {string|Blob} source - 图片URL或Blob
 * @param {string} filename - 文件名
 */
export async function downloadImage(source, filename) {
  if (source instanceof Blob) {
    downloadFile(source, filename)
    return
  }
  
  try {
    const response = await fetch(source)
    const blob = await response.blob()
    downloadFile(blob, filename)
  } catch (error) {
    console.error('下载图片失败:', error)
    throw new Error('下载图片失败: ' + error.message)
  }
}

/**
 * 批量下载图片
 * @param {Array<{source: string|Blob, name: string}>} images - 图片数组
 * @param {string} zipName - ZIP文件名
 */
export async function downloadImagesAsZip(images, zipName = 'images.zip') {
  const files = []
  
  for (const image of images) {
    let blob
    if (image.source instanceof Blob) {
      blob = image.source
    } else {
      const response = await fetch(image.source)
      blob = await response.blob()
    }
    files.push({ blob, name: image.name })
  }
  
  await downloadAsZip(files, zipName)
}

export default {
  downloadFile,
  downloadAsZip,
  downloadImage,
  downloadImagesAsZip
}
