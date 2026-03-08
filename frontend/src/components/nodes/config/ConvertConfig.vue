<template>
  <div class="convert-config">
    <el-form label-position="top" size="small">
      <el-form-item label="目标格式">
        <el-select v-model="format" placeholder="选择目标格式">
          <el-option label="PNG" value="png" />
          <el-option label="JPG" value="jpg" />
          <el-option label="WebP" value="webp" />
        </el-select>
      </el-form-item>
      <el-form-item label="JPG质量" v-if="format === 'jpg'">
        <el-slider v-model="jpgQuality" :min="1" :max="100" show-input />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 图片格式转换节点配置面板
 */
import { ref, watch } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const format = ref('png')
const jpgQuality = ref(92)

watch(() => props.node.data, (data) => {
  if (data) {
    format.value = data.format || 'png'
    jpgQuality.value = data.jpgQuality || 92
  }
}, { immediate: true })

watch([format, jpgQuality], () => {
  emit('update', {
    format: format.value,
    jpgQuality: jpgQuality.value
  })
})
</script>

<style scoped>
.convert-config {
  padding: 0;
}

:deep(.el-select) {
  width: 100%;
}
</style>
