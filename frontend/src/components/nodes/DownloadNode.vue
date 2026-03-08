<template>
  <div class="workflow-node download-node">
    <div class="node-header">
      <el-icon><Download /></el-icon>
      <span>图片下载</span>
    </div>
    <div class="node-content">
      <div v-if="data.files?.length === 0" class="placeholder">
        等待输入
      </div>
      <div v-else class="file-info">
        <el-icon><Folder /></el-icon>
        <span>{{ data.files?.length || 0 }} 个文件</span>
      </div>
    </div>
    <Handle type="target" :position="Position.Left" />
  </div>
</template>

<script setup>
/**
 * 图片下载节点组件
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
  border: 2px solid #f56c6c;
  border-radius: 8px;
  min-width: 160px;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f56c6c;
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
}

.placeholder {
  color: #909399;
  font-size: 12px;
  text-align: center;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f56c6c;
  font-size: 14px;
}

.file-info .el-icon {
  margin-right: 8px;
  font-size: 20px;
}
</style>
