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
  background: #fff;
  border: 2px solid #ec4899;
  border-radius: 12px;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.25);
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
  color: #64748b;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  padding: 10px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #fbcfe8;
}

.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: #ec4899 !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
}

.handle-source:hover {
  width: 18px !important;
  height: 18px !important;
  background: #f472b6 !important;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.6);
}
</style>
