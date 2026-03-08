<template>
  <div class="convert-config">
    <el-form label-position="top" size="small">
      <el-form-item label="目标格式">
        <div class="format-grid">
          <div
            v-for="fmt in formats"
            :key="fmt.value"
            class="format-card"
            :class="{ active: format === fmt.value }"
            @click="selectFormat(fmt.value)"
          >
            <div class="format-icon" :style="{ background: fmt.color }">
              <span>{{ fmt.label }}</span>
            </div>
            <div class="format-name">{{ fmt.label }}</div>
            <div class="format-desc">{{ fmt.desc }}</div>
          </div>
        </div>
      </el-form-item>

      <el-form-item v-if="showQualitySlider" class="quality-section">
        <template #label>
          <div class="quality-label">
            <span>{{ qualityLabel }}</span>
            <el-tag size="small" type="info">{{ quality }}%</el-tag>
          </div>
        </template>
        <el-slider
          v-model="quality"
          :min="1"
          :max="100"
          :format-tooltip="formatTooltip"
        />
        <div class="quality-presets">
          <el-button
            v-for="preset in qualityPresets"
            :key="preset.value"
            size="small"
            :type="quality === preset.value ? 'primary' : 'default'"
            @click="quality = preset.value"
          >
            {{ preset.label }}
          </el-button>
        </div>
      </el-form-item>

      <el-form-item v-if="format === 'png'" class="info-section">
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <template #title>
            PNG格式支持透明背景，适合图标、Logo等需要透明效果的图片
          </template>
        </el-alert>
      </el-form-item>

      <el-form-item v-if="format === 'gif'" class="info-section">
        <el-alert
          type="warning"
          :closable="false"
          show-icon
        >
          <template #title>
            GIF格式仅支持256色，适合简单动画和图标，不适合照片类图片
          </template>
        </el-alert>
      </el-form-item>

      <el-form-item v-if="format === 'avif'" class="info-section">
        <el-alert
          type="success"
          :closable="false"
          show-icon
        >
          <template #title>
            AVIF是新一代图片格式，压缩率更高，但部分浏览器可能不支持预览
          </template>
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 图片格式转换节点配置面板
 */
import { ref, watch, computed } from 'vue'

const props = defineProps({
  node: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

/**
 * 支持的图片格式列表
 */
const formats = [
  { value: 'png', label: 'PNG', desc: '无损压缩', color: '#3b82f6' },
  { value: 'jpg', label: 'JPG', desc: '有损压缩', color: '#10b981' },
  { value: 'webp', label: 'WebP', desc: '现代格式', color: '#f59e0b' },
  { value: 'gif', label: 'GIF', desc: '动图支持', color: '#ec4899' },
  { value: 'bmp', label: 'BMP', desc: '无压缩', color: '#8b5cf6' },
  { value: 'avif', label: 'AVIF', desc: '高效压缩', color: '#06b6d4' }
]

/**
 * 质量预设选项
 */
const qualityPresets = [
  { label: '低', value: 50 },
  { label: '中', value: 75 },
  { label: '高', value: 92 },
  { label: '最佳', value: 100 }
]

const format = ref('png')
const quality = ref(92)

/**
 * 是否显示质量滑块
 */
const showQualitySlider = computed(() => {
  return ['jpg', 'webp', 'avif'].includes(format.value)
})

/**
 * 质量标签文本
 */
const qualityLabel = computed(() => {
  const labels = {
    jpg: 'JPG 压缩质量',
    webp: 'WebP 压缩质量',
    avif: 'AVIF 压缩质量'
  }
  return labels[format.value] || '压缩质量'
})

/**
 * 选择格式
 */
function selectFormat(fmt) {
  format.value = fmt
}

/**
 * 格式化滑块提示
 */
function formatTooltip(val) {
  return `${val}%`
}

watch(() => props.node.data, (data) => {
  if (data) {
    format.value = data.format || 'png'
    quality.value = data.jpgQuality || data.quality || 92
  }
}, { immediate: true })

watch([format, quality], () => {
  emit('update', {
    format: format.value,
    jpgQuality: quality.value,
    quality: quality.value
  })
})
</script>

<style scoped>
.convert-config {
  padding: 0;
}

:deep(.el-form-item__label) {
  color: var(--text-primary);
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.format-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px;
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-secondary);
}

.format-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.format-card.active {
  border-color: var(--color-primary);
  background: var(--bg-hover);
}

.format-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 6px;
}

.format-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.format-desc {
  font-size: 10px;
  color: var(--text-tertiary);
}

.quality-section {
  margin-top: 12px;
}

.quality-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.quality-presets {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.quality-presets .el-button {
  flex: 1;
  font-size: 11px;
}

.info-section {
  margin-top: 8px;
}

.info-section :deep(.el-alert) {
  padding: 8px 12px;
}

.info-section :deep(.el-alert__title) {
  font-size: 11px;
  line-height: 1.4;
}
</style>
