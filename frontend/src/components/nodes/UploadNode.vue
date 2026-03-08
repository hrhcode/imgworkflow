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
    <!-- 输出端口 -->
    <Handle type="source" :position="Position.Right" />
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
  border-radius: 8px;
  min-width: 180px;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #409eff;
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
  color: #67c23a;
  font-size: 14px;
}

.file-info .el-icon {
  margin-right: 8px;
  font-size: 20px;
}
</style>
