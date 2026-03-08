<template>
  <div class="workflow-node convert-node">
    <div class="node-header">
      <el-icon><Switch /></el-icon>
      <span>格式转换</span>
    </div>
    <div class="node-content">
      <div class="format-badge">
        {{ data.format?.toUpperCase() }}
      </div>
    </div>
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
/**
 * 图片格式转换节点组件
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
  border: 2px solid #e6a23c;
  border-radius: 8px;
  min-width: 140px;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #e6a23c;
  color: #fff;
  border-radius: 6px 6px 0 0;
  font-size: 14px;
  font-weight: 500;
}

.node-header .el-icon {
  margin-right: 8px;
}

.node-content {
  padding: 16px 12px;
  display: flex;
  justify-content: center;
}

.format-badge {
  padding: 6px 16px;
  background: #fdf6ec;
  color: #e6a23c;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
}
</style>
