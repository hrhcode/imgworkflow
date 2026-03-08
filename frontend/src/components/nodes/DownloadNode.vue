<template>
  <div class="workflow-node download-node">
    <div class="node-header">
      <el-icon><Download /></el-icon>
      <span>图片下载</span>
    </div>
    <div class="node-content">
      <div v-if="!data.files?.length" class="placeholder">
        等待输入
      </div>
      <div v-else class="file-info">
        <el-icon><Folder /></el-icon>
        <span>{{ data.files?.length || 0 }} 个文件</span>
      </div>
    </div>
    <Handle type="target" :position="Position.Left" class="handle-target" />
  </div>
</template>

<script setup>
/**
 * 图片下载节点组件
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
  border: 2px solid #ef4444;
  border-radius: 12px;
  min-width: 160px;
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
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
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
  color: var(--color-danger);
  font-size: 14px;
  font-weight: 500;
}

.file-info .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.handle-target {
  width: 14px !important;
  height: 14px !important;
  background: #ef4444 !important;
  border: 3px solid var(--bg-primary) !important;
  box-shadow: var(--handle-shadow);
}

.handle-target:hover {
  width: 18px !important;
  height: 18px !important;
  background: #f87171 !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
}
</style>
