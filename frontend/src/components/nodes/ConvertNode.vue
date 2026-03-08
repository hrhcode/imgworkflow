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
  border: 2px solid #e6a23c;
  border-radius: 12px;
  min-width: 140px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 4px 20px rgba(230, 162, 60, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
  color: #fff;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 500;
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
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  color: #e6a23c;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
}

/* 增大Handle感应区域 */
.handle-target,
.handle-source {
  width: 16px !important;
  height: 16px !important;
  background: #e6a23c !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.4);
  transition: all 0.2s ease;
}

.handle-target:hover,
.handle-source:hover {
  width: 20px !important;
  height: 20px !important;
  background: #f0c78a !important;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.6);
}
</style>
