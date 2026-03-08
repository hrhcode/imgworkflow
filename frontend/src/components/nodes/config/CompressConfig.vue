<template>
  <div class="compress-config">
    <el-form label-position="top" size="small">
      <el-form-item label="压缩等级">
        <el-radio-group v-model="compressLevel" class="level-group">
          <el-radio-button value="light">
            <div class="level-option">
              <span class="level-name">轻度</span>
              <span class="level-desc">最佳质量</span>
            </div>
          </el-radio-button>
          <el-radio-button value="normal">
            <div class="level-option">
              <span class="level-name">普通</span>
              <span class="level-desc">较高质量</span>
            </div>
          </el-radio-button>
          <el-radio-button value="strong">
            <div class="level-option">
              <span class="level-name">强力</span>
              <span class="level-desc">较低质量</span>
            </div>
          </el-radio-button>
          <el-radio-button value="extreme">
            <div class="level-option">
              <span class="level-name">极强</span>
              <span class="level-desc">最小体积</span>
            </div>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <div class="level-info">
      <el-tag :type="getLevelTagType(compressLevel)" size="small">
        {{ getLevelDescription(compressLevel) }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
/**
 * 图片压缩节点配置面板
 */
import { ref, watch } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const compressLevel = ref('normal')

/**
 * 压缩等级配置映射
 */
const levelConfig = {
  light: { quality: 85, maxSizeRatio: 0.90, desc: '轻度压缩，保持较佳画质，体积略减' },
  normal: { quality: 60, maxSizeRatio: 0.60, desc: '普通压缩，画质与体积平衡' },
  strong: { quality: 40, maxSizeRatio: 0.35, desc: '强力压缩，画质有损失，体积显著减小' },
  extreme: { quality: 20, maxSizeRatio: 0.15, desc: '极强压缩，画质损失较大，体积最小' }
}

/**
 * 获取等级标签类型
 */
function getLevelTagType(level) {
  const types = {
    light: 'success',
    normal: '',
    strong: 'warning',
    extreme: 'danger'
  }
  return types[level] || ''
}

/**
 * 获取等级描述
 */
function getLevelDescription(level) {
  return levelConfig[level]?.desc || ''
}

watch(() => props.node.data, (data) => {
  if (data && data.compressLevel) {
    compressLevel.value = data.compressLevel
  }
}, { immediate: true })

watch(compressLevel, () => {
  const config = levelConfig[compressLevel.value]
  emit('update', {
    compressLevel: compressLevel.value,
    quality: config.quality,
    maxSizeRatio: config.maxSizeRatio
  })
})
</script>

<style scoped>
.compress-config {
  padding: 0;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

.level-group {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.level-group :deep(.el-radio-button) {
  margin: 0;
}

.level-group :deep(.el-radio-button__inner) {
  width: 100%;
  padding: 8px 4px;
  border-radius: 8px !important;
  border: 1px solid #dcdfe6 !important;
}

.level-group :deep(.el-radio-button.is-active .el-radio-button__inner) {
  border-color: #409eff !important;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.level-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.level-name {
  font-size: 13px;
  font-weight: 600;
}

.level-desc {
  font-size: 10px;
  color: #909399;
}

.level-group :deep(.el-radio-button.is-active .level-desc) {
  color: #fff;
}

.level-info {
  margin-top: 12px;
  text-align: center;
}
</style>
