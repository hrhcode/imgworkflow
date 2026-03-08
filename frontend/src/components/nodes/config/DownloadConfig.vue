<template>
  <div class="download-config">
    <el-form label-position="top" size="small">
      <el-form-item label="下载方式">
        <el-radio-group v-model="downloadMode">
          <el-radio label="single">单张下载</el-radio>
          <el-radio label="batch">批量打包</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="输出格式">
        <el-select v-model="format" placeholder="选择输出格式">
          <el-option label="PNG" value="png" />
          <el-option label="JPG" value="jpg" />
          <el-option label="WebP" value="webp" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件名前缀" v-if="downloadMode === 'batch'">
        <el-input v-model="filePrefix" placeholder="images" />
      </el-form-item>
    </el-form>
    <div class="action-buttons">
      <el-button type="primary" @click="download" :disabled="!hasFiles">
        <el-icon><Download /></el-icon>
        下载
      </el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 图片下载节点配置面板
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const downloadMode = ref('batch')
const filePrefix = ref('images')
const format = ref('png')

const hasFiles = computed(() => {
  return props.node.data?.files?.length > 0
})

watch(() => props.node.data, (data) => {
  if (data) {
    downloadMode.value = data.downloadMode || 'batch'
    filePrefix.value = data.filePrefix || 'images'
    format.value = data.format || 'png'
  }
}, { immediate: true })

watch([downloadMode, filePrefix, format], () => {
  emit('update', {
    downloadMode: downloadMode.value,
    filePrefix: filePrefix.value,
    format: format.value
  })
})

/**
 * 下载文件
 */
function download() {
  // 下载功能在工作流执行时处理
  emit('update', { triggerDownload: true })
}
</script>

<style scoped>
.download-config {
  padding: 0;
}

.action-buttons {
  margin-top: 16px;
}

.action-buttons .el-button {
  width: 100%;
}
</style>
