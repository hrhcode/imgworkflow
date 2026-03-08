<template>
  <div class="workflow-node download-node">
    <div class="node-header">
      <el-icon><Download /></el-icon>
      <span>图片下载</span>
    </div>
    <div class="node-content">
      <div v-if="!data.files?.length" class="placeholder">
        等待输入
      </div>
      <div v-else class="file-info">
        <el-icon><Folder /></el-icon>
        <span>{{ data.files?.length || 0 }} 个文件</span>
      </div>
    </div>
    <Handle type="target" :position="Position.Left" class="handle-target" />
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
  border-radius: 12px;
  min-width: 160px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 4px 20px rgba(245, 108, 108, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
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

/* 增大Handle感应区域 */
.handle-target {
  width: 16px !important;
  height: 16px !important;
  background: #f56c6c !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.4);
  transition: all 0.2s ease;
}

.handle-target:hover {
  width: 20px !important;
  height: 20px !important;
  background: #f89898 !important;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.6);
}
</style>
