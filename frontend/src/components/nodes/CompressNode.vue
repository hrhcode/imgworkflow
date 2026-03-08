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
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
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
  border-radius: 8px;
  min-width: 160px;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #67c23a;
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
</style>
