<template>
  <div class="workflow-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="executeWorkflow" :loading="workflowStore.isExecuting">
        <el-icon><VideoPlay /></el-icon>
        执行工作流
      </el-button>
      <el-button @click="saveWorkflow">
        <el-icon><FolderOpened /></el-icon>
        保存
      </el-button>
      <el-button @click="loadWorkflow">
        <el-icon><FolderRemove /></el-icon>
        加载
      </el-button>
      <el-button @click="clearWorkflow" type="danger">
        <el-icon><Delete /></el-icon>
        清空
      </el-button>
    </div>

    <div class="editor-container">
      <!-- 节点面板 -->
      <div class="node-panel">
        <div class="panel-title">节点列表</div>
        <div
          v-for="nodeType in nodeTypes"
          :key="nodeType.type"
          class="node-item"
          draggable="true"
          @dragstart="onDragStart($event, nodeType)"
        >
          <div class="icon">
            <el-icon :size="24"><component :is="nodeType.icon" /></el-icon>
          </div>
          <div class="label">{{ nodeType.label }}</div>
        </div>
      </div>

      <!-- 画布区域 -->
      <div class="canvas-container" @drop="onDrop" @dragover.prevent>
        <VueFlow
          v-model:nodes="workflowStore.nodes"
          v-model:edges="workflowStore.edges"
          @node-click="onNodeClick"
          @edge-click="onEdgeClick"
          @connect="onConnect"
          :default-viewport="{ zoom: 1 }"
          :min-zoom="0.2"
          :max-zoom="4"
          fit-view-on-init
        >
          <template #node-upload="{ data }">
            <UploadNode :data="data" />
          </template>
          <template #node-compress="{ data }">
            <CompressNode :data="data" />
          </template>
          <template #node-convert="{ data }">
            <ConvertNode :data="data" />
          </template>
          <template #node-plantuml="{ data }">
            <PlantUMLNode :data="data" />
          </template>
          <template #node-mermaid="{ data }">
            <MermaidNode :data="data" />
          </template>
          <template #node-download="{ data }">
            <DownloadNode :data="data" />
          </template>
          <Background />
          <Controls />
        </VueFlow>
      </div>

      <!-- 配置面板 -->
      <div class="config-panel" v-if="workflowStore.selectedNode">
        <div class="title">节点配置</div>
        <component
          :is="getConfigPanel(workflowStore.selectedNode.type)"
          :node="workflowStore.selectedNode"
          @update="updateNodeConfig"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 工作流编辑器主页面
 */
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import { useWorkflowStore } from '@/stores/workflow'
import { ElMessage } from 'element-plus'

const { addEdges } = useVueFlow()

// 节点组件
import UploadNode from '@/components/nodes/UploadNode.vue'
import CompressNode from '@/components/nodes/CompressNode.vue'
import ConvertNode from '@/components/nodes/ConvertNode.vue'
import PlantUMLNode from '@/components/nodes/PlantUMLNode.vue'
import MermaidNode from '@/components/nodes/MermaidNode.vue'
import DownloadNode from '@/components/nodes/DownloadNode.vue'

// 配置面板组件
import UploadConfig from '@/components/nodes/config/UploadConfig.vue'
import CompressConfig from '@/components/nodes/config/CompressConfig.vue'
import ConvertConfig from '@/components/nodes/config/ConvertConfig.vue'
import PlantUMLConfig from '@/components/nodes/config/PlantUMLConfig.vue'
import MermaidConfig from '@/components/nodes/config/MermaidConfig.vue'
import DownloadConfig from '@/components/nodes/config/DownloadConfig.vue'

const workflowStore = useWorkflowStore()

// 节点类型定义
const nodeTypes = ref([
  { type: 'upload', label: '图片上传', icon: 'Upload' },
  { type: 'compress', label: '图片压缩', icon: 'Compress' },
  { type: 'convert', label: '格式转换', icon: 'Switch' },
  { type: 'plantuml', label: 'PlantUML绘图', icon: 'DataLine' },
  { type: 'mermaid', label: 'Mermaid绘图', icon: 'Share' },
  { type: 'download', label: '图片下载', icon: 'Download' }
])

// 配置面板映射
const configPanels = {
  upload: UploadConfig,
  compress: CompressConfig,
  convert: ConvertConfig,
  plantuml: PlantUMLConfig,
  mermaid: MermaidConfig,
  download: DownloadConfig
}

let nodeId = 0

/**
 * 获取配置面板组件
 */
function getConfigPanel(type) {
  return configPanels[type] || null
}

/**
 * 拖拽开始
 */
function onDragStart(event, nodeType) {
  event.dataTransfer.setData('application/vueflow', nodeType.type)
  event.dataTransfer.effectAllowed = 'move'
}

/**
 * 拖拽放置
 */
function onDrop(event) {
  const type = event.dataTransfer.getData('application/vueflow')
  if (!type) return

  const { left, top } = event.target.getBoundingClientRect()
  const position = {
    x: event.clientX - left,
    y: event.clientY - top
  }

  const newNode = {
    id: `node_${++nodeId}`,
    type,
    position,
    data: getDefaultNodeData(type)
  }

  workflowStore.addNode(newNode)
}

/**
 * 获取节点默认数据
 */
function getDefaultNodeData(type) {
  const defaults = {
    upload: { files: [], fileIds: [] },
    compress: { quality: 80, width: null, height: null },
    convert: { format: 'png' },
    plantuml: { code: '@startuml\nalice -> bob\n@enduml' },
    mermaid: { code: 'graph TD\n    A[开始] --> B[结束]' },
    download: { files: [] }
  }
  return { ...defaults[type] }
}

/**
 * 节点点击
 */
function onNodeClick(event) {
  workflowStore.setSelectedNode(event.node.id)
}

/**
 * 连线点击
 */
function onEdgeClick(event) {
  workflowStore.setSelectedNode(null)
}

/**
 * 创建连线
 */
function onConnect(params) {
  addEdges([params])
}

/**
 * 更新节点配置
 */
function updateNodeConfig(data) {
  if (workflowStore.selectedNodeId) {
    workflowStore.updateNodeData(workflowStore.selectedNodeId, data)
  }
}

/**
 * 执行工作流
 */
function executeWorkflow() {
  if (workflowStore.nodes.length === 0) {
    ElMessage.warning('请先添加节点')
    return
  }
  workflowStore.executeWorkflow()
}

/**
 * 保存工作流
 */
function saveWorkflow() {
  const workflow = workflowStore.exportWorkflow()
  localStorage.setItem('savedWorkflow', JSON.stringify(workflow))
  ElMessage.success('工作流已保存')
}

/**
 * 加载工作流
 */
function loadWorkflow() {
  const saved = localStorage.getItem('savedWorkflow')
  if (saved) {
    const workflow = JSON.parse(saved)
    workflowStore.importWorkflow(workflow)
    nodeId = updateNodeIdCounter(workflow.nodes)
    ElMessage.success('工作流已加载')
  } else {
    ElMessage.warning('没有已保存的工作流')
  }
}

/**
 * 更新节点ID计数器
 */
function updateNodeIdCounter(nodes) {
  if (!nodes || nodes.length === 0) return 0
  let maxId = 0
  for (const node of nodes) {
    const match = node.id.match(/node_(\d+)/)
    if (match) {
      const id = parseInt(match[1])
      if (id > maxId) maxId = id
    }
  }
  return maxId
}

/**
 * 清空工作流
 */
function clearWorkflow() {
  workflowStore.clearWorkflow()
  nodeId = 0
  ElMessage.success('工作流已清空')
}
</script>

<style scoped>
.workflow-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.canvas-container {
  flex: 1;
  height: 100%;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}
</style>
