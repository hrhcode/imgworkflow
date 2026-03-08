<template>
  <div class="workflow-node upload-node">
    <div class="node-header">
      <el-icon><Upload /></el-icon>
      <span>图片上传</span>
    </div>
    <div class="node-content">
      <div v-if="!data.files?.length" class="placeholder">
        点击配置上传图片
      </div>
      <div v-else class="file-info">
        <el-icon><Picture /></el-icon>
        <span>{{ data.files.length }} 张图片</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" class="handle-source" />
  </div>
</template>

<script setup>
/**
 * 图片上传节点组件
 */
import { Handle, Position } from '@vue-flow/core'

defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.workflow-node {
  background: var(--bg-primary);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  min-width: 180px;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: var(--shadow-lg);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: #fff;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 600;
}

.node-header .el-icon {
  margin-right: 8px;
}

.node-content {
  padding: 16px 14px;
  background: var(--bg-secondary);
  border-radius: 0 0 10px 10px;
}

.placeholder {
  color: var(--text-secondary);
  font-size: 12px;
  text-align: center;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-success);
  font-size: 14px;
  font-weight: 500;
}

.file-info .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: #3b82f6 !important;
  border: 3px solid var(--bg-primary) !important;
  box-shadow: var(--handle-shadow);
}

.handle-source:hover {
  width: 18px !important;
  height: 18px !important;
  background: #60a5fa !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
}
</style>
