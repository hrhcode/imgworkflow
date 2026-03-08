<template>
  <div class="workflow-node mermaid-node">
    <div class="node-header">
      <el-icon><Share /></el-icon>
      <span>Mermaid</span>
    </div>
    <div class="node-content">
      <div class="code-preview">
        {{ data.code?.substring(0, 30) }}...
      </div>
    </div>
    <Handle type="source" :position="Position.Right" class="handle-source" />
  </div>
</template>

<script setup>
/**
 * Mermaid绘图节点组件
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
  background: #fff;
  border: 2px solid #ff69b4;
  border-radius: 12px;
  min-width: 160px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 4px 20px rgba(255, 105, 180, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #ff69b4 0%, #ff8dc7 100%);
  color: #fff;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 500;
}

.node-header .el-icon {
  margin-right: 8px;
}

.node-content {
  padding: 12px;
}

.code-preview {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 11px;
  color: #606266;
  background: linear-gradient(135deg, #fff5f8 0%, #ffe8f0 100%);
  padding: 10px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 增大Handle感应区域 */
.handle-source {
  width: 16px !important;
  height: 16px !important;
  background: #ff69b4 !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.4);
  transition: all 0.2s ease;
}

.handle-source:hover {
  width: 20px !important;
  height: 20px !important;
  background: #ff8dc7 !important;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.6);
}
</style>
