<template>
  <div class="download-config">
    <el-form label-position="top" size="small">
      <el-form-item label="下载方式">
        <el-radio-group v-model="downloadMode">
          <el-radio label="single">单张下载</el-radio>
          <el-radio label="batch">批量打包</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件名" v-if="downloadMode === 'batch'">
        <el-input v-model="filePrefix" placeholder="images" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 图片下载节点配置面板
 */
import { ref, watch } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const downloadMode = ref('batch')
const filePrefix = ref('images')

watch(() => props.node.data, (data) => {
  if (data) {
    downloadMode.value = data.downloadMode || 'batch'
    filePrefix.value = data.filePrefix || 'images'
  }
}, { immediate: true })

watch([downloadMode, filePrefix], () => {
  emit('update', {
    downloadMode: downloadMode.value,
    filePrefix: filePrefix.value
  })
})
</script>

<style scoped>
.download-config {
  padding: 0;
}
</style>
