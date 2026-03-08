<template>
  <div class="plantuml-config">
    <div class="config-layout">
      <div class="editor-panel">
        <div class="panel-header">
          <span class="panel-title">代码编辑</span>
          <div class="header-actions">
            <el-select v-model="outputFormat" size="small" class="format-select">
              <el-option label="PNG" value="png" />
              <el-option label="SVG" value="svg" />
            </el-select>
            <el-button type="primary" size="small" @click="preview" :loading="loading">
              预览
            </el-button>
          </div>
        </div>
        <div class="editor-wrapper">
          <el-input
            v-model="code"
            type="textarea"
            :rows="20"
            placeholder="输入PlantUML代码"
            class="code-editor"
          />
        </div>
      </div>
      <div class="preview-panel">
        <div class="panel-header">
          <span class="panel-title">预览结果</span>
        </div>
        <div class="preview-wrapper">
          <div class="preview-area" v-if="previewUrl">
            <img :src="previewUrl" alt="预览" />
          </div>
          <div class="preview-placeholder" v-else>
            <el-icon :size="48"><Document /></el-icon>
            <p>点击"预览"按钮查看渲染结果</p>
          </div>
        </div>
      </div>
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
import { renderPlantUML } from '@/services/plantumlService'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const code = ref('@startuml\nalice -> bob\n@enduml')
const outputFormat = ref('png')
const previewUrl = ref('')
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
    const url = await renderPlantUML(code.value, outputFormat.value)
    previewUrl.value = url
    emit('update', { code: code.value, previewUrl: url, outputFormat: outputFormat.value })
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
  height: 100%;
  display: flex;
  flex-direction: column;
}

.config-layout {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.editor-panel,
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-radius: 8px 8px 0 0;
  border: 1px solid var(--border-primary);
  border-bottom: none;
}

.panel-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.format-select {
  width: 80px;
}

:deep(.format-select .el-input__wrapper) {
  background: var(--bg-primary);
  border-color: var(--border-primary);
}

:deep(.format-select .el-input__inner) {
  color: var(--text-primary);
}

.editor-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-primary);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.preview-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-primary);
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.code-editor {
  flex: 1;
}

:deep(.code-editor .el-textarea) {
  height: 100%;
}

:deep(.code-editor .el-textarea__inner) {
  height: 100% !important;
  min-height: 400px !important;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: 0 0 8px 8px;
  resize: none;
  padding: 12px;
}

:deep(.code-editor .el-textarea__inner:focus) {
  border: none;
  box-shadow: none;
}

.preview-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: auto;
}

.preview-area img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

.preview-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  gap: 12px;
}

.preview-placeholder p {
  margin: 0;
  font-size: 13px;
}

.help-text {
  margin-top: 12px;
  text-align: center;
  flex-shrink: 0;
}
</style>
