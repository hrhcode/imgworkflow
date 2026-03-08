<template>
  <div class="workflow-node plantuml-node">
    <div class="node-header">
      <el-icon><DataLine /></el-icon>
      <span>PlantUML</span>
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
 * PlantUML绘图节点组件
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
  border: 2px solid #8b5cf6;
  border-radius: 12px;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
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
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  padding: 10px;
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #ddd6fe;
}

.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: #8b5cf6 !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
}

.handle-source:hover {
  width: 18px !important;
  height: 18px !important;
  background: #a78bfa !important;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.6);
}
</style>
