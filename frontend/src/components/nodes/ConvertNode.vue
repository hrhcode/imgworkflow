<template>
  <div class="workflow-node convert-node">
    <div class="node-header">
      <el-icon><SwitchFilled /></el-icon>
      <span>格式转换</span>
    </div>
    <div class="node-content">
      <div class="format-badge">
        {{ data.format?.toUpperCase() }}
      </div>
    </div>
    <Handle type="target" :position="Position.Left" class="handle-target" />
    <Handle type="source" :position="Position.Right" class="handle-source" />
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
  border: 2px solid #f59e0b;
  border-radius: 12px;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.25);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
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
  display: flex;
  justify-content: center;
}

.format-badge {
  padding: 8px 20px;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #d97706;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid #fcd34d;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: #f59e0b !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
}

.handle-target:hover,
.handle-source:hover {
  width: 18px !important;
  height: 18px !important;
  background: #fbbf24 !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.6);
}
</style>
