<template>
  <div class="workflow-node compress-node">
    <div class="node-header">
      <el-icon><DocumentCopy /></el-icon>
      <span>图片压缩</span>
    </div>
    <div class="node-content">
      <div class="level-badge" :class="levelClass">
        {{ levelName }}
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
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const levelNames = {
  light: '轻度',
  normal: '普通',
  strong: '强力',
  extreme: '极强'
}

const levelName = computed(() => {
  return levelNames[props.data.compressLevel] || '普通'
})

const levelClass = computed(() => {
  return `level-${props.data.compressLevel || 'normal'}`
})
</script>

<style scoped>
.workflow-node {
  background: #fff;
  border: 2px solid #10b981;
  border-radius: 12px;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  transition: all 0.2s ease;
}

.workflow-node:hover {
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #fff;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  font-weight: 600;
}

.node-header .el-icon {
  margin-right: 8px;
}

.node-content {
  padding: 12px 14px;
}

.level-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.level-light {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.level-normal {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.level-strong {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.level-extreme {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: #10b981 !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

.handle-target:hover,
.handle-source:hover {
  width: 18px !important;
  height: 18px !important;
  background: #34d399 !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
}
</style>
