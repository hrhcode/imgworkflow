<template>
  <div class="compress-config">
    <el-form label-position="top" size="small">
      <el-form-item label="压缩等级">
        <el-radio-group v-model="compressLevel" class="level-group" :disabled="isAdvanced">
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

      <div class="advanced-toggle">
        <el-checkbox v-model="isAdvanced" @change="onAdvancedChange">
          高级设置
        </el-checkbox>
        <el-tooltip content="开启后可自定义压缩参数" placement="top">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>

      <el-collapse-transition>
        <div v-show="isAdvanced" class="advanced-settings">
          <el-form-item>
            <template #label>
              <div class="setting-label">
                <span>压缩质量</span>
                <el-tag size="small" type="info">{{ customQuality }}%</el-tag>
              </div>
            </template>
            <el-slider
              v-model="customQuality"
              :min="1"
              :max="100"
              :format-tooltip="val => `${val}%`"
            />
            <div class="quality-hints">
              <span>文件大</span>
              <span>质量高</span>
              <span>←</span>
              <span>→</span>
              <span>文件小</span>
              <span>质量低</span>
            </div>
          </el-form-item>

          <el-form-item>
            <template #label>
              <div class="setting-label">
                <span>最大尺寸比例</span>
                <el-tag size="small" type="info">{{ Math.round(customMaxSizeRatio * 100) }}%</el-tag>
              </div>
            </template>
            <el-slider
              v-model="customMaxSizeRatio"
              :min="0.1"
              :max="1"
              :step="0.05"
              :format-tooltip="val => `${Math.round(val * 100)}%`"
            />
            <div class="setting-desc">
              图片尺寸将按此比例缩放，100%表示保持原始尺寸
            </div>
          </el-form-item>

          <el-form-item label="最大宽度（像素）">
            <el-input-number
              v-model="customMaxWidth"
              :min="0"
              :max="10000"
              :step="100"
              placeholder="不限制"
              controls-position="right"
              class="full-width"
            />
            <div class="setting-desc">
              设置为0表示不限制宽度
            </div>
          </el-form-item>

          <el-form-item label="最大高度（像素）">
            <el-input-number
              v-model="customMaxHeight"
              :min="0"
              :max="10000"
              :step="100"
              placeholder="不限制"
              controls-position="right"
              class="full-width"
            />
            <div class="setting-desc">
              设置为0表示不限制高度
            </div>
          </el-form-item>

          <el-form-item label="输出格式">
            <el-select v-model="customFormat" placeholder="保持原格式" class="full-width">
              <el-option label="保持原格式" value="" />
              <el-option label="PNG" value="png" />
              <el-option label="JPG" value="jpg" />
              <el-option label="WebP" value="webp" />
            </el-select>
          </el-form-item>
        </div>
      </el-collapse-transition>

      <div v-if="!isAdvanced" class="level-info">
        <el-tag :type="getLevelTagType(compressLevel)" size="small">
          {{ getLevelDescription(compressLevel) }}
        </el-tag>
      </div>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 图片压缩节点配置面板
 */
import { ref, watch } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const compressLevel = ref('normal')
const isAdvanced = ref(false)

// 高级设置参数
const customQuality = ref(60)
const customMaxSizeRatio = ref(0.6)
const customMaxWidth = ref(0)
const customMaxHeight = ref(0)
const customFormat = ref('')

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

/**
 * 高级设置开关变化
 */
function onAdvancedChange(val) {
  if (val) {
    // 开启高级设置时，从当前等级初始化参数
    const config = levelConfig[compressLevel.value]
    customQuality.value = config.quality
    customMaxSizeRatio.value = config.maxSizeRatio
  }
}

/**
 * 发送更新
 */
function emitUpdate() {
  if (isAdvanced.value) {
    emit('update', {
      compressLevel: 'custom',
      isAdvanced: true,
      quality: customQuality.value,
      maxSizeRatio: customMaxSizeRatio.value,
      maxWidth: customMaxWidth.value,
      maxHeight: customMaxHeight.value,
      outputFormat: customFormat.value
    })
  } else {
    const config = levelConfig[compressLevel.value]
    emit('update', {
      compressLevel: compressLevel.value,
      isAdvanced: false,
      quality: config.quality,
      maxSizeRatio: config.maxSizeRatio,
      maxWidth: 0,
      maxHeight: 0,
      outputFormat: ''
    })
  }
}

watch(() => props.node.data, (data) => {
  if (data) {
    if (data.isAdvanced) {
      isAdvanced.value = true
      customQuality.value = data.quality || 60
      customMaxSizeRatio.value = data.maxSizeRatio || 0.6
      customMaxWidth.value = data.maxWidth || 0
      customMaxHeight.value = data.maxHeight || 0
      customFormat.value = data.outputFormat || ''
    } else if (data.compressLevel) {
      compressLevel.value = data.compressLevel
      isAdvanced.value = false
    }
  }
}, { immediate: true })

watch([compressLevel, isAdvanced, customQuality, customMaxSizeRatio, customMaxWidth, customMaxHeight, customFormat], emitUpdate)
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

.level-group :deep(.el-radio-button.is-disabled .el-radio-button__inner) {
  background-color: #f5f7fa;
  opacity: 0.6;
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

.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.help-icon {
  color: #909399;
  cursor: help;
}

.advanced-settings {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.quality-hints {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #909399;
  margin-top: 4px;
}

.setting-desc {
  font-size: 11px;
  color: #909399;
  margin-top: 4px;
}

.full-width {
  width: 100%;
}

.level-info {
  margin-top: 12px;
  text-align: center;
}
</style>
