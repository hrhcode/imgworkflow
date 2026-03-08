import { openDB } from 'idb'

const DB_NAME = 'imgworkflow'
const DB_VERSION = 1
const STORE_NAME = 'images'

let dbInstance = null

/**
 * 获取数据库实例
 */
async function getDB() {
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })
  }
  return dbInstance
}

/**
 * 存储图片到IndexedDB
 * @param {File} file - 图片文件
 * @returns {Promise<Object>} - 图片信息
 */
export async function storeImage(file) {
  const db = await getDB()
  const id = generateId()
  
  const imageData = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    data: file,
    createdAt: Date.now()
  }
  
  await db.put(STORE_NAME, imageData)
  
  return {
    id,
    name: file.name,
    type: file.type,
    size: file.size
  }
}

/**
 * 批量存储图片
 * @param {File[]} files - 图片文件数组
 * @returns {Promise<Object[]>} - 图片信息数组
 */
export async function storeImages(files) {
  const results = []
  for (const file of files) {
    const info = await storeImage(file)
    results.push(info)
  }
  return results
}

/**
 * 从IndexedDB读取图片
 * @param {string} id - 图片ID
 * @returns {Promise<Object|null>} - 图片数据
 */
export async function getImage(id) {
  const db = await getDB()
  return await db.get(STORE_NAME, id)
}

/**
 * 删除图片
 * @param {string} id - 图片ID
 */
export async function deleteImage(id) {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

/**
 * 获取所有图片列表
 * @returns {Promise<Object[]>} - 图片信息数组
 */
export async function getAllImages() {
  const db = await getDB()
  const all = await db.getAll(STORE_NAME)
  return all.map(({ id, name, type, size, createdAt }) => ({
    id, name, type, size, createdAt
  }))
}

/**
 * 清空所有图片
 */
export async function clearAllImages() {
  const db = await getDB()
  await db.clear(STORE_NAME)
}

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export default {
  storeImage,
  storeImages,
  getImage,
  deleteImage,
  getAllImages,
  clearAllImages
}
