import plantumlEncoder from 'plantuml-encoder'

const PLANTUML_SERVER = 'https://www.plantuml.com/plantuml'

/**
 * 渲染PlantUML图表
 * @param {string} code - PlantUML代码
 * @param {string} format - 输出格式 (png/svg)
 * @returns {Promise<string>} - 图片URL
 */
export async function renderPlantUML(code, format = 'png') {
  const encoded = plantumlEncoder.encode(code)
  return `${PLANTUML_SERVER}/${format}/${encoded}`
}

/**
 * 获取PlantUML图片Blob
 * @param {string} code - PlantUML代码
 * @param {string} format - 输出格式 (png/svg)
 * @returns {Promise<Blob>} - 图片Blob
 */
export async function getPlantUMLBlob(code, format = 'png') {
  const url = await renderPlantUML(code, format)
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('图片获取失败')
    }
    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('PlantUML渲染失败:', error)
    throw new Error('PlantUML渲染失败: ' + error.message)
  }
}

/**
 * 预览PlantUML图表
 * @param {string} code - PlantUML代码
 * @returns {Promise<string>} - 图片URL
 */
export async function previewPlantUML(code) {
  return await renderPlantUML(code, 'svg')
}

export default {
  renderPlantUML,
  getPlantUMLBlob,
  previewPlantUML
}
