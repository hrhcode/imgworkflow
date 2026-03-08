<template>
  <div class="workflow-node compress-node">
    <div class="node-header">
      <el-icon><Compress /></el-icon>
      <span>图片压缩</span>
    </div>
    <div class="node-content">
      <div class="info-item">
        <span class="label">质量：</span>
        <span class="value">{{ data.quality }}%</span>
      </div>
      <div class="info-item" v-if="data.width || data.height">
        <span class="label">尺寸：</span>
        <span class="value">{{ data.width || 'auto' }} x {{ data.height || 'auto' }}</span>
      </div>
    </div>
    <Handle type="target" :position="Position.Left" class="handle-target" />
    <Handle type="source" :position="Position.Right" class="handle-source" />
  </div>
</template>

<script setup>
/**
 * 图片压缩节点组件
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
  border: 2px solid #67c23a;
  border-radius: 12px;
  min-width: 160px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 4px 20px rgba(103, 194, 58, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 500;
}

.node-header .el-icon {
  margin-right: 8px;
}

.node-content {
  padding: 12px 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.info-item .label {
  color: #909399;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

/* 增大Handle感应区域 */
.handle-target,
.handle-source {
  width: 16px !important;
  height: 16px !important;
  background: #67c23a !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.4);
  transition: all 0.2s ease;
}

.handle-target:hover,
.handle-source:hover {
  width: 20px !important;
  height: 20px !important;
  background: #85ce61 !important;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.6);
}
</style>
