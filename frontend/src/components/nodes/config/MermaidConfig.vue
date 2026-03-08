<template>
  <div class="mermaid-config">
    <el-form label-position="top" size="small">
      <el-form-item label="Mermaid代码">
        <el-input
          v-model="code"
          type="textarea"
          :rows="10"
          placeholder="输入Mermaid代码"
        />
      </el-form-item>
      <el-form-item label="输出格式">
        <el-select v-model="outputFormat">
          <el-option label="PNG" value="png" />
          <el-option label="SVG" value="svg" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="preview" :loading="loading">预览</el-button>
      </el-form-item>
    </el-form>
    <div class="preview-area" v-if="previewSvg" v-html="previewSvg"></div>
    <div class="help-text">
      <el-link type="primary" href="https://mermaid.js.org/intro/" target="_blank">
        Mermaid语法帮助
      </el-link>
    </div>
  </div>
</template>

<script setup>
/**
 * Mermaid节点配置面板
 */
import { ref, watch } from 'vue'
import { renderMermaid } from '@/services/mermaidService'
import { ElMessage } from 'element-plus'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const code = ref('graph TD\n    A[开始] --> B[结束]')
const outputFormat = ref('png')
const previewSvg = ref('')
const loading = ref(false)

watch(() => props.node.data, (data) => {
  if (data && data.code) {
    code.value = data.code
    outputFormat.value = data.outputFormat || 'png'
  }
}, { immediate: true })

watch([code, outputFormat], () => {
  emit('update', { 
    code: code.value,
    outputFormat: outputFormat.value
  })
})

/**
 * 预览图片
 */
async function preview() {
  loading.value = true
  try {
    const svg = await renderMermaid(code.value)
    previewSvg.value = svg
    emit('update', { code: code.value, previewSvg: svg })
    ElMessage.success('预览成功')
  } catch (error) {
    ElMessage.error('预览失败：' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.mermaid-config {
  padding: 0;
}

:deep(.el-textarea__inner) {
  font-family: monospace;
  font-size: 12px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}

:deep(.el-textarea__inner:focus) {
  border-color: var(--border-focus);
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

:deep(.el-select .el-input__inner) {
  color: var(--text-primary);
}

:deep(.el-form-item__label) {
  color: var(--text-primary);
}

.preview-area {
  margin-top: 12px;
  text-align: center;
  overflow: auto;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
}

.preview-area :deep(svg) {
  max-width: 100%;
}

.help-text {
  margin-top: 12px;
  text-align: center;
}
</style>
