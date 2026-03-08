<template>
  <div class="workflow-node mermaid-node">
    <div class="node-header">
      <el-icon><Connection /></el-icon>
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
import { Connection } from '@element-plus/icons-vue'

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
  border: 2px solid #ec4899;
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
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  color: #fff;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 600;
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
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  padding: 10px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid var(--border-primary);
}

.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: #ec4899 !important;
  border: 3px solid var(--bg-primary) !important;
  box-shadow: var(--handle-shadow);
}

.handle-source:hover {
  width: 18px !important;
  height: 18px !important;
  background: #f472b6 !important;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.6);
}
</style>
