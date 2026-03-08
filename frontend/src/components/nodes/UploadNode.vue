<template>
  <div class="workflow-node upload-node">
    <div class="node-header">
      <el-icon><Upload /></el-icon>
      <span>图片上传</span>
    </div>
    <div class="node-content">
      <div v-if="data.files.length === 0" class="placeholder">
        点击配置上传图片
      </div>
      <div v-else class="file-info">
        <el-icon><Picture /></el-icon>
        <span>{{ data.files.length }} 张图片</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" class="handle-source" />
  </div>
</template>

<script setup>
/**
 * 图片上传节点组件
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
  border: 2px solid #409eff;
  border-radius: 12px;
  min-width: 180px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 4px 20px rgba(64, 158, 255, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
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
  color: #67c23a;
  font-size: 14px;
}

.file-info .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

/* 增大Handle感应区域 */
.handle-source {
  width: 16px !important;
  height: 16px !important;
  background: #409eff !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.4);
  transition: all 0.2s ease;
}

.handle-source:hover {
  width: 20px !important;
  height: 20px !important;
  background: #66b1ff !important;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.6);
}
</style>
