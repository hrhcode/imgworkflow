<template>
  <el-drawer
    v-model="visible"
    title="工作流模板"
    direction="rtl"
    size="400px"
  >
    <div class="template-panel">
      <div class="template-list">
        <div
          v-for="template in templates"
          :key="template.id"
          class="template-item"
          @click="selectTemplate(template)"
        >
          <div class="template-icon">
            <el-icon :size="32"><component :is="template.icon" /></el-icon>
          </div>
          <div class="template-info">
            <div class="template-name">{{ template.name }}</div>
            <div class="template-desc">{{ template.description }}</div>
            <div class="template-nodes">
              <el-tag
                v-for="node in template.nodeTypes"
                :key="node"
                size="small"
                type="info"
                class="node-tag"
              >
                {{ node }}
              </el-tag>
            </div>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
/**
 * 工作流模板选择面板
 */
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const visible = ref(false)

watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

/**
 * 预设模板定义
 */
const templates = ref([
  {
    id: 'compress-download',
    name: '图片压缩下载',
    description: '上传图片后压缩并下载',
    icon: 'Compress',
    nodeTypes: ['上传', '压缩', '下载'],
    nodes: [
      { type: 'upload', position: { x: 100, y: 200 } },
      { type: 'compress', position: { x: 350, y: 200 } },
      { type: 'download', position: { x: 600, y: 200 } }
    ],
    edges: [
      { id: 'e1', source: 'node_1', target: 'node_2', sourceHandle: null, targetHandle: null },
      { id: 'e2', source: 'node_2', target: 'node_3', sourceHandle: null, targetHandle: null }
    ]
  },
  {
    id: 'convert-download',
    name: '格式转换下载',
    description: '上传图片后转换格式并下载',
    icon: 'Switch',
    nodeTypes: ['上传', '转换', '下载'],
    nodes: [
      { type: 'upload', position: { x: 100, y: 200 } },
      { type: 'convert', position: { x: 350, y: 200 } },
      { type: 'download', position: { x: 600, y: 200 } }
    ],
    edges: [
      { id: 'e1', source: 'node_1', target: 'node_2', sourceHandle: null, targetHandle: null },
      { id: 'e2', source: 'node_2', target: 'node_3', sourceHandle: null, targetHandle: null }
    ]
  },
  {
    id: 'full-pipeline',
    name: '图片处理流水线',
    description: '完整的图片处理流程',
    icon: 'Share',
    nodeTypes: ['上传', '压缩', '转换', '下载'],
    nodes: [
      { type: 'upload', position: { x: 100, y: 200 } },
      { type: 'compress', position: { x: 300, y: 200 } },
      { type: 'convert', position: { x: 500, y: 200 } },
      { type: 'download', position: { x: 700, y: 200 } }
    ],
    edges: [
      { id: 'e1', source: 'node_1', target: 'node_2', sourceHandle: null, targetHandle: null },
      { id: 'e2', source: 'node_2', target: 'node_3', sourceHandle: null, targetHandle: null },
      { id: 'e3', source: 'node_3', target: 'node_4', sourceHandle: null, targetHandle: null }
    ]
  },
  {
    id: 'mermaid-download',
    name: 'Mermaid绘图下载',
    description: '使用Mermaid语法绘制图表并下载',
    icon: 'Share',
    nodeTypes: ['Mermaid', '下载'],
    nodes: [
      { type: 'mermaid', position: { x: 200, y: 200 } },
      { type: 'download', position: { x: 450, y: 200 } }
    ],
    edges: [
      { id: 'e1', source: 'node_1', target: 'node_2', sourceHandle: null, targetHandle: null }
    ]
  },
  {
    id: 'plantuml-download',
    name: 'PlantUML绘图下载',
    description: '使用PlantUML语法绘制图表并下载',
    icon: 'DataLine',
    nodeTypes: ['PlantUML', '下载'],
    nodes: [
      { type: 'plantuml', position: { x: 200, y: 200 } },
      { type: 'download', position: { x: 450, y: 200 } }
    ],
    edges: [
      { id: 'e1', source: 'node_1', target: 'node_2', sourceHandle: null, targetHandle: null }
    ]
  }
])

/**
 * 选择模板
 */
function selectTemplate(template) {
  emit('select', template)
  visible.value = false
}
</script>

<style scoped>
.template-panel {
  height: 100%;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.template-item:hover {
  background: #fff;
  border-color: #409eff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.15);
  transform: translateX(4px);
}

.template-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
  overflow: hidden;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.template-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.template-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.node-tag {
  font-size: 11px;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 20px;
  flex-shrink: 0;
}

.template-item:hover .arrow-icon {
  color: #409eff;
}
</style>
