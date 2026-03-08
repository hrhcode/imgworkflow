<template>
  <div class="compress-config">
    <el-form label-position="top" size="small">
      <el-form-item label="压缩质量">
        <el-slider v-model="quality" :min="1" :max="100" show-input />
      </el-form-item>
      <el-form-item label="目标宽度">
        <el-input-number v-model="width" :min="1" :max="10000" placeholder="自动" />
      </el-form-item>
      <el-form-item label="目标高度">
        <el-input-number v-model="height" :min="1" :max="10000" placeholder="自动" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="keepAspectRatio">保持宽高比</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 图片压缩节点配置面板
 */
import { ref, watch } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const quality = ref(80)
const width = ref(null)
const height = ref(null)
const keepAspectRatio = ref(true)

watch(() => props.node.data, (data) => {
  if (data) {
    quality.value = data.quality || 80
    width.value = data.width || null
    height.value = data.height || null
    keepAspectRatio.value = data.keepAspectRatio !== false
  }
}, { immediate: true })

watch([quality, width, height, keepAspectRatio], () => {
  emit('update', {
    quality: quality.value,
    width: width.value,
    height: height.value,
    keepAspectRatio: keepAspectRatio.value
  })
})
</script>

<style scoped>
.compress-config {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-slider) {
  margin-left: 8px;
  margin-right: 8px;
}
</style>
