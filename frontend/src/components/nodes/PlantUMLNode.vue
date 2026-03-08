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
    <Handle type="source" :position="Position.Right" />
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
  border: 2px solid #909399;
  border-radius: 8px;
  min-width: 160px;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #909399;
  color: #fff;
  border-radius: 6px 6px 0 0;
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
  font-family: monospace;
  font-size: 11px;
  color: #606266;
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
