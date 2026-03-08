<template>
  <div class="workflow-editor" @keydown="handleKeyDown">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="logo">
          <el-icon :size="24" color="#409eff"><Share /></el-icon>
          <span class="logo-text">ImgWorkflow</span>
        </div>
        <div class="workflow-name">
          <el-input
            v-model="workflowStore.currentWorkflowName"
            size="small"
            placeholder="未命名工作流"
            @blur="updateWorkflowName"
          />
        </div>
      </div>
      
      <div class="toolbar-center">
        <el-button type="primary" @click="executeWorkflow" :loading="workflowStore.isExecuting">
          <el-icon><VideoPlay /></el-icon>
          执行
        </el-button>
        <el-button type="success" @click="saveCurrentWorkflow">
          <el-icon><Folder /></el-icon>
          保存
        </el-button>
        <el-button @click="showWorkflowManager = true">
          <el-icon><FolderOpened /></el-icon>
          工作流管理
        </el-button>
        <el-button @click="showTemplatePanel = true">
          <el-icon><Document /></el-icon>
          模板
        </el-button>
        <el-button @click="clearWorkflow" type="danger">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <div class="progress-info" v-if="workflowStore.isExecuting">
          <el-progress
            :percentage="workflowStore.executionProgress"
            :stroke-width="8"
            :show-text="false"
            style="width: 120px"
          />
          <span class="progress-text">{{ workflowStore.executionProgress }}%</span>
        </div>
      </div>
    </div>

    <div class="editor-container">
      <!-- 左侧节点面板 -->
      <div class="node-panel">
        <div class="panel-header">
          <el-icon><Menu /></el-icon>
          <span>节点组件</span>
        </div>
        
        <div class="node-groups">
          <div class="node-group">
            <div class="group-title">图片处理</div>
            <div class="node-list">
              <div
                v-for="nodeType in imageNodes"
                :key="nodeType.type"
                class="node-item"
                draggable="true"
                @dragstart="onDragStart($event, nodeType)"
              >
                <div class="node-icon" :style="{ background: nodeType.color }">
                  <el-icon :size="20"><component :is="getIcon(nodeType.icon)" /></el-icon>
                </div>
                <div class="node-info">
                  <div class="node-label">{{ nodeType.label }}</div>
                  <div class="node-desc">{{ nodeType.desc }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="node-group">
            <div class="group-title">文本绘图</div>
            <div class="node-list">
              <div
                v-for="nodeType in diagramNodes"
                :key="nodeType.type"
                class="node-item"
                draggable="true"
                @dragstart="onDragStart($event, nodeType)"
              >
                <div class="node-icon" :style="{ background: nodeType.color }">
                  <el-icon :size="20"><component :is="getIcon(nodeType.icon)" /></el-icon>
                </div>
                <div class="node-info">
                  <div class="node-label">{{ nodeType.label }}</div>
                  <div class="node-desc">{{ nodeType.desc }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="node-group">
            <div class="group-title">输出</div>
            <div class="node-list">
              <div
                v-for="nodeType in outputNodes"
                :key="nodeType.type"
                class="node-item"
                draggable="true"
                @dragstart="onDragStart($event, nodeType)"
              >
                <div class="node-icon" :style="{ background: nodeType.color }">
                  <el-icon :size="20"><component :is="getIcon(nodeType.icon)" /></el-icon>
                </div>
                <div class="node-info">
                  <div class="node-label">{{ nodeType.label }}</div>
                  <div class="node-desc">{{ nodeType.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 画布区域 -->
      <div class="canvas-container" @drop="onDrop" @dragover.prevent @contextmenu.prevent="showContextMenu">
        <VueFlow
          v-model:nodes="workflowStore.nodes"
          v-model:edges="workflowStore.edges"
          @node-click="onNodeClick"
          @edge-click="onEdgeClick"
          @connect="onConnect"
          @pane-click="onPaneClick"
          :default-viewport="{ zoom: 1, x: 0, y: 0 }"
          :min-zoom="0.2"
          :max-zoom="4"
          :snap-to-grid="true"
          :snap-grid="[15, 15]"
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
          <Background :gap="20" :size="1" />
          <Controls />
        </VueFlow>
        
        <div class="canvas-tip" v-if="workflowStore.nodes.length === 0">
          <el-icon :size="48" color="#c0c4cc"><Plus /></el-icon>
          <p>从左侧拖拽节点到此处开始创建工作流</p>
          <p class="tip-sub">或点击上方"模板"按钮选择预设模板</p>
        </div>
      </div>

      <!-- 右侧配置面板 -->
      <div class="config-panel" v-if="workflowStore.selectedNode">
        <div class="panel-header">
          <el-icon><Setting /></el-icon>
          <span>节点配置</span>
          <el-button
            type="danger"
            size="small"
            link
            @click="deleteSelectedNode"
            class="delete-btn"
          >
            <el-icon><Delete /></el-icon>
            删除节点
          </el-button>
        </div>
        <div class="config-content">
          <component
            :is="getConfigPanel(workflowStore.selectedNode.type)"
            :node="workflowStore.selectedNode"
            @update="updateNodeConfig"
          />
        </div>
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="menu-item" @click="deleteSelectedNode" v-if="workflowStore.selectedNode">
        <el-icon><Delete /></el-icon>
        删除节点
      </div>
      <div class="menu-item" @click="clearWorkflow">
        <el-icon><Delete /></el-icon>
        清空画布
      </div>
    </div>
    
    <!-- 工作流管理面板 -->
    <WorkflowManager v-model="showWorkflowManager" @load="onLoadWorkflow" />
    
    <!-- 模板选择面板 -->
    <TemplatePanel v-model="showTemplatePanel" @select="onSelectTemplate" />
  </div>
</template>

<script setup>
/**
 * 工作流编辑器主页面
 */
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import { useWorkflowStore } from '@/stores/workflow'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  Download,
  Delete,
  VideoPlay,
  FolderOpened,
  Document,
  Menu,
  Setting,
  Plus,
  Share,
  DataLine,
  SwitchFilled,
  DocumentCopy,
  Folder
} from '@element-plus/icons-vue'

const { addEdges, removeNodes, getSelectedNodes, project } = useVueFlow()

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

// 工作流管理和模板面板
import WorkflowManager from '@/components/WorkflowManager.vue'
import TemplatePanel from '@/components/TemplatePanel.vue'

const workflowStore = useWorkflowStore()

const showWorkflowManager = ref(false)
const showTemplatePanel = ref(false)

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0
})

// 图标映射
const iconMap = {
  Upload,
  Download,
  SwitchFilled,
  DataLine,
  Share,
  DocumentCopy
}

// 获取图标组件
function getIcon(iconName) {
  return iconMap[iconName] || DocumentCopy
}

// 节点类型定义（分组）
const imageNodes = ref([
  { type: 'upload', label: '图片上传', icon: 'Upload', color: '#409eff', desc: '上传图片文件' },
  { type: 'compress', label: '图片压缩', icon: 'DocumentCopy', color: '#67c23a', desc: '压缩图片大小' },
  { type: 'convert', label: '格式转换', icon: 'SwitchFilled', color: '#e6a23c', desc: '转换图片格式' }
])

const diagramNodes = ref([
  { type: 'plantuml', label: 'PlantUML', icon: 'DataLine', color: '#909399', desc: 'PlantUML绘图' },
  { type: 'mermaid', label: 'Mermaid', icon: 'Share', color: '#ff69b4', desc: 'Mermaid绘图' }
])

const outputNodes = ref([
  { type: 'download', label: '图片下载', icon: 'Download', color: '#f56c6c', desc: '下载图片文件' }
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

onMounted(() => {
  workflowStore.loadSavedWorkflows()
  document.addEventListener('click', hideContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})

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
 * 拖拽放置 - 优化位置计算
 */
function onDrop(event) {
  const type = event.dataTransfer.getData('application/vueflow')
  if (!type) return

  // 使用VueFlow的project方法转换坐标
  const bounds = event.target.closest('.vue-flow')?.getBoundingClientRect()
  if (!bounds) return

  // 计算已有节点的最右侧位置
  let baseX = 50
  let baseY = 150
  
  if (workflowStore.nodes.length > 0) {
    const lastNode = workflowStore.nodes[workflowStore.nodes.length - 1]
    baseX = lastNode.position.x + 220 // 节点宽度 + 间距
    baseY = lastNode.position.y
  }

  const position = {
    x: baseX,
    y: baseY
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
    compress: { quality: 80, width: null, height: null, keepAspectRatio: true },
    convert: { format: 'png', jpgQuality: 92 },
    plantuml: { code: '@startuml\nalice -> bob\n@enduml' },
    mermaid: { code: 'graph TD\n    A[开始] --> B[结束]', outputFormat: 'png' },
    download: { downloadMode: 'batch', filePrefix: 'images', format: 'png' }
  }
  return { ...defaults[type] }
}

/**
 * 节点点击
 */
function onNodeClick(event) {
  workflowStore.setSelectedNode(event.node.id)
  hideContextMenu()
}

/**
 * 连线点击
 */
function onEdgeClick(event) {
  workflowStore.setSelectedNode(null)
}

/**
 * 画布点击
 */
function onPaneClick() {
  workflowStore.setSelectedNode(null)
  hideContextMenu()
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
 * 键盘事件处理
 */
function handleKeyDown(event) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    if (workflowStore.selectedNode && !isInputFocused()) {
      deleteSelectedNode()
    }
  }
}

/**
 * 检查是否聚焦在输入框
 */
function isInputFocused() {
  const activeElement = document.activeElement
  return activeElement.tagName === 'INPUT' || 
         activeElement.tagName === 'TEXTAREA' || 
         activeElement.isContentEditable
}

/**
 * 删除选中节点
 */
function deleteSelectedNode() {
  if (workflowStore.selectedNodeId) {
    workflowStore.removeNode(workflowStore.selectedNodeId)
    workflowStore.setSelectedNode(null)
    hideContextMenu()
    ElMessage.success('节点已删除')
  }
}

/**
 * 显示右键菜单
 */
function showContextMenu(event) {
  contextMenu.visible = true
  contextMenu.x = event.clientX
  contextMenu.y = event.clientY
}

/**
 * 隐藏右键菜单
 */
function hideContextMenu() {
  contextMenu.visible = false
}

/**
 * 执行工作流
 */
function executeWorkflow() {
  if (workflowStore.nodes.length === 0) {
    ElMessage.warning('请先添加节点')
    return
  }
  
  // 验证工作流
  const validation = validateWorkflow()
  if (!validation.valid) {
    ElMessage.error(validation.message)
    return
  }
  
  workflowStore.executeWorkflow()
}

/**
 * 验证工作流是否合理
 */
function validateWorkflow() {
  const nodes = workflowStore.nodes
  const edges = workflowStore.edges
  
  // 检查是否有下载节点
  const hasDownloadNode = nodes.some(n => n.type === 'download')
  if (!hasDownloadNode) {
    return {
      valid: false,
      message: '工作流必须包含下载节点才能输出结果'
    }
  }
  
  // 检查是否有数据源节点
  const hasSourceNode = nodes.some(n => n.type === 'upload' || n.type === 'mermaid' || n.type === 'plantuml')
  if (!hasSourceNode) {
    return {
      valid: false,
      message: '工作流必须包含数据源节点（上传、Mermaid或PlantUML）'
    }
  }
  
  // 检查节点是否都已连接
  for (const node of nodes) {
    if (node.type !== 'upload' && node.type !== 'mermaid' && node.type !== 'plantuml') {
      // 非源节点必须有输入连接
      const hasInput = edges.some(e => e.target === node.id)
      if (!hasInput) {
        return {
          valid: false,
          message: `节点"${getNodeLabel(node.type)}"没有输入连接`
        }
      }
    }
    
    if (node.type !== 'download') {
      // 非终点节点必须有输出连接
      const hasOutput = edges.some(e => e.source === node.id)
      if (!hasOutput) {
        return {
          valid: false,
          message: `节点"${getNodeLabel(node.type)}"没有输出连接`
        }
      }
    }
  }
  
  return { valid: true }
}

/**
 * 获取节点标签
 */
function getNodeLabel(type) {
  const labels = {
    upload: '图片上传',
    compress: '图片压缩',
    convert: '格式转换',
    plantuml: 'PlantUML',
    mermaid: 'Mermaid',
    download: '图片下载'
  }
  return labels[type] || type
}

/**
 * 保存当前工作流
 */
function saveCurrentWorkflow() {
  if (workflowStore.nodes.length === 0) {
    ElMessage.warning('当前工作流为空，无法保存')
    return
  }
  
  ElMessageBox.prompt('请输入工作流名称', '保存工作流', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    inputValue: workflowStore.currentWorkflowName,
    inputPattern: /\S+/,
    inputErrorMessage: '工作流名称不能为空'
  }).then(({ value }) => {
    workflowStore.saveCurrentWorkflow(value)
    ElMessage.success('工作流保存成功')
  }).catch(() => {})
}

/**
 * 更新工作流名称
 */
function updateWorkflowName() {
  // 名称自动保存到store
}

/**
 * 清空工作流
 */
function clearWorkflow() {
  if (workflowStore.nodes.length === 0) return
  
  ElMessageBox.confirm(
    '确定要清空当前工作流吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    workflowStore.clearWorkflow()
    nodeId = 0
    ElMessage.success('工作流已清空')
  }).catch(() => {})
}

/**
 * 加载工作流回调
 */
function onLoadWorkflow(workflow) {
  nodeId = updateNodeIdCounter(workflow.nodes)
}

/**
 * 选择模板回调
 */
function onSelectTemplate(template) {
  workflowStore.clearWorkflow()
  workflowStore.currentWorkflowName = template.name
  
  template.nodes.forEach((node, index) => {
    workflowStore.addNode({
      id: `node_${++nodeId}`,
      type: node.type,
      position: node.position,
      data: getDefaultNodeData(node.type)
    })
  })
  
  template.edges.forEach(edge => {
    workflowStore.addEdge(edge)
  })
  
  ElMessage.success(`已加载模板：${template.name}`)
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
</script>

<style scoped>
.workflow-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.workflow-name {
  width: 200px;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  min-width: 150px;
  display: flex;
  justify-content: flex-end;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-text {
  font-size: 12px;
  color: #606266;
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.node-panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.node-groups {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.node-group {
  margin-bottom: 16px;
}

.group-title {
  font-size: 12px;
  font-weight: 500;
  color: #909399;
  padding: 8px 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.node-item:hover {
  background: #fff;
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.node-item:active {
  cursor: grabbing;
}

.node-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.node-info {
  flex: 1;
  overflow: hidden;
}

.node-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.node-desc {
  font-size: 12px;
  color: #909399;
}

.canvas-container {
  flex: 1;
  height: 100%;
  position: relative;
}

.canvas-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #c0c4cc;
  pointer-events: none;
}

.canvas-tip p {
  margin-top: 16px;
  font-size: 14px;
}

.canvas-tip .tip-sub {
  font-size: 12px;
  margin-top: 8px;
}

.config-panel {
  width: 320px;
  background: #fff;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.config-panel .panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.config-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.delete-btn {
  margin-left: auto;
}

.context-menu {
  position: fixed;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 9999;
  min-width: 140px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #303133;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f5f7fa;
}

.menu-item:first-child:hover {
  color: #f56c6c;
}
</style>
