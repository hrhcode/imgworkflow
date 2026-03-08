<template>
  <div class="workflow-editor" @keydown="handleKeyDown">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="logo">
          <el-icon :size="22"><Share /></el-icon>
          <span class="logo-text">ImgWorkflow</span>
        </div>
      </div>
      
      <div class="toolbar-center">
        <div class="workflow-name">
          <el-input
            v-model="workflowStore.currentWorkflowName"
            size="small"
            placeholder="未命名工作流"
          />
        </div>
        
        <el-button-group class="action-group">
          <el-button 
            v-if="!workflowStore.isExecuting"
            type="success" 
            @click="executeWorkflow"
          >
            <el-icon><VideoPlay /></el-icon>
            <span class="btn-text">执行</span>
          </el-button>
          <el-button 
            v-else
            type="danger" 
            @click="stopExecution"
          >
            <el-icon><VideoPause /></el-icon>
            <span class="btn-text">终止</span>
          </el-button>
          <el-button type="primary" class="save-btn" @click="saveCurrentWorkflow">
            <el-icon><Folder /></el-icon>
            <span class="btn-text">保存</span>
          </el-button>
        </el-button-group>
        
        <el-button-group class="manage-group">
          <el-button @click="showWorkflowManager = true">
            <el-icon><FolderOpened /></el-icon>
            <span class="btn-text">管理</span>
          </el-button>
          <el-button @click="showTemplatePanel = true">
            <el-icon><Document /></el-icon>
            <span class="btn-text">模板</span>
          </el-button>
        </el-button-group>
        
        <el-button @click="clearWorkflow" type="danger" plain>
          <el-icon><Delete /></el-icon>
          <span class="btn-text">清空</span>
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <div class="progress-info" v-if="workflowStore.isExecuting">
          <el-progress
            :percentage="workflowStore.executionProgress"
            :stroke-width="6"
            :show-text="false"
            style="width: 100px"
          />
          <span class="progress-text">{{ workflowStore.executionProgress }}%</span>
        </div>
      </div>
    </div>

    <div class="editor-container">
      <!-- 左侧节点面板 -->
      <div class="node-panel" :class="{ collapsed: isPanelCollapsed }">
        <div class="panel-header">
          <el-icon v-if="!isPanelCollapsed"><Menu /></el-icon>
          <span v-if="!isPanelCollapsed">节点组件</span>
          <el-button
            class="collapse-btn"
            size="small"
            circle
            @click="isPanelCollapsed = !isPanelCollapsed"
          >
            <el-icon><component :is="isPanelCollapsed ? ArrowRight : ArrowLeft" /></el-icon>
          </el-button>
        </div>
        
        <div class="node-groups" v-show="!isPanelCollapsed">
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
          <Background :variant="BackgroundVariant.Lines" :gap="24" :size="0.5" :color="'#cbd5e1'" />
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
import { Background, BackgroundVariant } from '@vue-flow/background'
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
  VideoPause,
  FolderOpened,
  Document,
  Menu,
  Setting,
  Plus,
  Share,
  DataLine,
  SwitchFilled,
  DocumentCopy,
  Folder,
  ArrowLeft,
  ArrowRight
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
const isPanelCollapsed = ref(false)

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

// 节点类型定义（分组）- 新配色系统
const imageNodes = ref([
  { type: 'upload', label: '图片上传', icon: 'Upload', color: '#3b82f6', desc: '上传图片文件' },
  { type: 'compress', label: '图片压缩', icon: 'DocumentCopy', color: '#10b981', desc: '压缩图片大小' },
  { type: 'convert', label: '格式转换', icon: 'SwitchFilled', color: '#f59e0b', desc: '转换图片格式' }
])

const diagramNodes = ref([
  { type: 'plantuml', label: 'PlantUML', icon: 'DataLine', color: '#8b5cf6', desc: 'PlantUML绘图' },
  { type: 'mermaid', label: 'Mermaid', icon: 'Share', color: '#ec4899', desc: 'Mermaid绘图' }
])

const outputNodes = ref([
  { type: 'download', label: '图片下载', icon: 'Download', color: '#ef4444', desc: '下载图片文件' }
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
 * 终止工作流执行
 */
function stopExecution() {
  workflowStore.stopExecution()
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
  
  const name = workflowStore.currentWorkflowName.trim() || '未命名工作流'
  workflowStore.saveCurrentWorkflow(name)
  ElMessage.success('工作流保存成功')
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
  background: #f8fafc;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

.logo .el-icon {
  color: #6366f1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.workflow-name {
  width: 180px;
}

.workflow-name :deep(.el-input__wrapper) {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 6px;
}

.workflow-name :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
}

.workflow-name :deep(.el-input__wrapper:focus-within) {
  border-color: #6366f1;
  background: #fff;
}

.workflow-name :deep(.el-input__inner) {
  color: #1e293b;
}

.workflow-name :deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

.toolbar-center {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-center .el-button-group {
  display: flex;
}

.toolbar-center .el-button {
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  padding: 8px 14px;
  transition: all 0.2s ease;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toolbar-center .el-button-group {
  display: inline-flex;
}

.toolbar-center .el-button-group .el-button {
  border-radius: 0;
  margin: 0;
}

.toolbar-center .el-button-group .el-button:first-child {
  border-radius: 6px 0 0 6px;
}

.toolbar-center .el-button-group .el-button:last-child {
  border-radius: 0 6px 6px 0;
}

.toolbar-center .el-button--success {
  background: #10b981;
  border-color: #10b981;
}

.toolbar-center .el-button--success:hover {
  background: #059669;
  border-color: #059669;
}

.toolbar-center .el-button--danger {
  background: #ef4444;
  border-color: #ef4444;
}

.toolbar-center .el-button--danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* 只有执行中的终止按钮才有脉冲动画 */
.toolbar-center .action-group .el-button--danger {
  animation: pulse-danger 1.5s ease-in-out infinite;
}

@keyframes pulse-danger {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
}

.toolbar-center .save-btn {
  background: #3b82f6;
  border-color: #3b82f6;
}

.toolbar-center .save-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.toolbar-center .el-button--danger.is-plain {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
}

.toolbar-center .el-button--danger.is-plain:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.manage-group .el-button {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
}

.manage-group .el-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

.toolbar-right {
  min-width: 140px;
  display: flex;
  justify-content: flex-end;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
}

.progress-text {
  font-size: 12px;
  color: #16a34a;
  font-weight: 600;
  min-width: 32px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .workflow-name {
    width: 140px;
  }
  
  .toolbar-center .el-button {
    padding: 8px 10px;
  }
  
  .btn-text {
    display: none;
  }
  
  .toolbar-center .el-button {
    padding: 8px 12px;
  }
}

@media (max-width: 900px) {
  .toolbar {
    padding: 0 12px;
  }
  
  .toolbar-left {
    gap: 12px;
  }
  
  .logo-text {
    display: none;
  }
  
  .workflow-name {
    width: 120px;
  }
  
  .toolbar-center {
    gap: 8px;
  }
}

@media (max-width: 600px) {
  .workflow-name {
    display: none;
  }
  
  .toolbar-right {
    min-width: auto;
  }
  
  .progress-info {
    padding: 4px 8px;
  }
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.node-panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.node-panel.collapsed {
  width: 48px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.node-panel.collapsed .panel-header {
  padding: 12px;
  justify-content: center;
}

.collapse-btn {
  margin-left: auto;
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #64748b;
}

.collapse-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

.node-panel.collapsed .collapse-btn {
  margin-left: 0;
}

.node-groups {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.node-group {
  margin-bottom: 20px;
}

.group-title {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  padding: 8px 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: grab;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.node-item:hover {
  background: #fff;
  border-color: var(--node-color, #6366f1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.node-item:active {
  cursor: grabbing;
}

.node-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.node-info {
  flex: 1;
  overflow: hidden;
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.node-desc {
  font-size: 12px;
  color: #64748b;
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
  color: #94a3b8;
  pointer-events: none;
}

.canvas-tip p {
  margin-top: 16px;
  font-size: 15px;
}

.canvas-tip .tip-sub {
  font-size: 13px;
  margin-top: 8px;
}

.config-panel {
  width: 320px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
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
  padding: 20px;
}

.delete-btn {
  margin-left: auto;
}

.context-menu {
  position: fixed;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 9999;
  min-width: 160px;
  border: 1px solid #e2e8f0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: #f1f5f9;
}

.menu-item:first-child:hover {
  color: #ef4444;
  background: #fef2f2;
}
</style>
