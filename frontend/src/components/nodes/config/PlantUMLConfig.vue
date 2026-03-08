<template>
  <div class="plantuml-config">
    <el-form label-position="top" size="small">
      <el-form-item label="PlantUML代码">
        <el-input
          v-model="code"
          type="textarea"
          :rows="10"
          placeholder="输入PlantUML代码"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="preview" :loading="loading">预览</el-button>
      </el-form-item>
    </el-form>
    <div class="preview-area" v-if="previewUrl">
      <img :src="previewUrl" alt="预览" />
    </div>
    <div class="help-text">
      <el-link type="primary" href="https://plantuml.com/zh/" target="_blank">
        PlantUML语法帮助
      </el-link>
    </div>
  </div>
</template>

<script setup>
/**
 * PlantUML节点配置面板
 */
import { ref, watch } from 'vue'
import { previewPlantUML } from '@/services/plantumlService'
import { ElMessage } from 'element-plus'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const code = ref('@startuml\nalice -> bob\n@enduml')
const previewUrl = ref('')
const loading = ref(false)

watch(() => props.node.data, (data) => {
  if (data && data.code) {
    code.value = data.code
  }
}, { immediate: true })

watch(code, () => {
  emit('update', { code: code.value })
})

/**
 * 预览图片
 */
async function preview() {
  loading.value = true
  try {
    const url = await previewPlantUML(code.value)
    previewUrl.value = url
    emit('update', { code: code.value, previewUrl: url })
    ElMessage.success('预览成功')
  } catch (error) {
    ElMessage.error('预览失败：' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.plantuml-config {
  padding: 0;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
  font-size: 12px;
}

.preview-area {
  margin-top: 12px;
  text-align: center;
}

.preview-area img {
  max-width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.help-text {
  margin-top: 12px;
  text-align: center;
}
</style>
