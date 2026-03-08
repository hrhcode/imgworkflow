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
      
      <el-divider>
        <el-checkbox v-model="showAdvanced" label="高级设置" />
      </el-divider>
      
      <template v-if="showAdvanced">
        <el-form-item label="压缩质量">
          <el-slider v-model="quality" :min="1" :max="100" show-input />
        </el-form-item>
        <el-form-item label="最大宽度">
          <el-input-number v-model="width" :min="1" :max="10000" placeholder="不限制" clearable />
        </el-form-item>
        <el-form-item label="最大高度">
          <el-input-number v-model="height" :min="1" :max="10000" placeholder="不限制" clearable />
        </el-form-item>
      </template>
    </el-form>
    
    <div class="level-info" v-if="!showAdvanced">
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
import { ref, watch, computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const compressLevel = ref('normal')
const quality = ref(80)
const width = ref(null)
const height = ref(null)
const showAdvanced = ref(false)

/**
 * 压缩等级配置映射
 */
const levelConfig = {
  light: { quality: 92, maxSizeRatio: 0.95, desc: '轻度压缩，保持最佳画质，体积略减' },
  normal: { quality: 80, maxSizeRatio: 0.7, desc: '普通压缩，画质与体积平衡' },
  strong: { quality: 60, maxSizeRatio: 0.4, desc: '强力压缩，画质略有损失，体积显著减小' },
  extreme: { quality: 40, maxSizeRatio: 0.2, desc: '极强压缩，画质损失较大，体积最小' }
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
  if (data) {
    if (data.compressLevel) {
      compressLevel.value = data.compressLevel
    }
    quality.value = data.quality || 80
    width.value = data.width || null
    height.value = data.height || null
    showAdvanced.value = data.showAdvanced || false
  }
}, { immediate: true })

watch([compressLevel, quality, width, height, showAdvanced], () => {
  const config = levelConfig[compressLevel.value]
  emit('update', {
    compressLevel: compressLevel.value,
    quality: showAdvanced.value ? quality.value : config.quality,
    maxSizeRatio: config.maxSizeRatio,
    width: width.value,
    height: height.value,
    showAdvanced: showAdvanced.value
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

:deep(.el-slider) {
  margin-left: 8px;
  margin-right: 8px;
}

:deep(.el-divider__text) {
  background: #fff;
  padding: 0 12px;
}

:deep(.el-divider) {
  margin: 20px 0;
}

:deep(.el-checkbox__label) {
  font-size: 12px;
  color: #909399;
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
