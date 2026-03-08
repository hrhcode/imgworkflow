<template>
  <div class="upload-config">
    <el-upload
      class="upload-area"
      drag
      multiple
      accept="image/*"
      :auto-upload="false"
      :on-change="handleFileChange"
      :file-list="fileList"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text">
        拖拽图片到此处或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持 JPG、PNG、GIF、WebP、BMP 格式，图片存储在浏览器本地
        </div>
      </template>
    </el-upload>
    <div class="file-list" v-if="fileList.length > 0">
      <div class="file-count">已选择 {{ fileList.length }} 张图片</div>
      <el-button type="danger" size="small" @click="clearFiles">清空</el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 图片上传节点配置面板
 */
import { ref, watch } from 'vue'
import { storeImages, deleteImage } from '@/services/storageService'
import { ElMessage } from 'element-plus'

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const MAX_FILE_COUNT = 50

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const fileList = ref([])

watch(() => props.node.data.files, (newFiles) => {
  if (newFiles && newFiles.length > 0) {
    fileList.value = newFiles.map((file, index) => ({
      name: file.name || `图片${index + 1}`,
      raw: file
    }))
  }
}, { immediate: true })

/**
 * 验证文件是否为有效图片
 */
function validateFile(file) {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    ElMessage.warning(`${file.name} 不是有效的图片文件`)
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    ElMessage.warning(`${file.name} 超过50MB大小限制`)
    return false
  }
  return true
}

/**
 * 处理文件选择变化
 */
async function handleFileChange(file, files) {
  const validFiles = files.filter(f => validateFile(f.raw))
  
  if (validFiles.length === 0) {
    return
  }
  
  if (validFiles.length > MAX_FILE_COUNT) {
    ElMessage.warning(`最多支持上传${MAX_FILE_COUNT}张图片，已自动截取`)
    validFiles.splice(MAX_FILE_COUNT)
  }
  
  fileList.value = validFiles
  
  try {
    const storedImages = await storeImages(validFiles.map(f => f.raw))
    emit('update', { 
      files: validFiles.map(f => f.raw),
      fileIds: storedImages.map(img => img.id),
      fileCount: validFiles.length
    })
    ElMessage.success(`已存储 ${storedImages.length} 张图片`)
  } catch (error) {
    ElMessage.error('图片存储失败：' + error.message)
  }
}

/**
 * 清空文件列表
 */
async function clearFiles() {
  if (props.node.data.fileIds && props.node.data.fileIds.length > 0) {
    try {
      for (const id of props.node.data.fileIds) {
        await deleteImage(id)
      }
    } catch (error) {
      console.error('删除IndexedDB数据失败:', error)
    }
  }
  fileList.value = []
  emit('update', { files: [], fileIds: [], fileCount: 0 })
}
</script>

<style scoped>
.upload-config {
  padding: 0;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
}

.file-list {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-count {
  font-size: 12px;
  color: #67c23a;
}
</style>
