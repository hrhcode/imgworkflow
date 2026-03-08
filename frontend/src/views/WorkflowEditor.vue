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
        
        <div class="toolbar-actions">
          <el-tooltip :content="themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式'" placement="bottom">
            <el-button class="theme-btn" circle @click="themeStore.toggleTheme">
              <el-icon :size="18">
                <component :is="themeStore.isDark ? 'Sunny' : 'Moon'" />
              </el-icon>
            </el-button>
          </el-tooltip>
          
          <el-tooltip content="访问 GitHub 仓库" placement="bottom">
            <a href="https://github.com/your-username/imgworkflow" target="_blank" class="github-link">
              <el-button class="github-btn" circle>
                <svg height="18" viewBox="0 0 16 16" width="18" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </el-button>
            </a>
          </el-tooltip>
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
          <Background :variant="BackgroundVariant.Lines" :gap="24" :size="0.5" :color="themeStore.isDark ? '#334155' : '#cbd5e1'" />
          <Controls />
        </VueFlow>
        
        <div class="canvas-tip" v-if="workflowStore.nodes.length === 0">
          <el-icon :size="48" :color="themeStore.isDark ? '#475569' : '#c0c4cc'"><Plus /></el-icon>
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
    <WorkflowManager v-model="showWorkflowManager" />
    
    <!-- 模板选择面板 -->
    <TemplatePanel v-model="showTemplatePanel" @select="onSelectTemplate" />
  </div>
</template>

<script setup>
/**
 * 工作流编辑器主页面
 */
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background, BackgroundVariant } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import { useWorkflowStore } from '@/stores/workflow'
import { useThemeStore } from '@/stores/theme'
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
  ArrowRight,
  Connection,
  Moon,
  Sunny
} from '@element-plus/icons-vue'

const { addEdges, removeEdges, removeNodes, getSelectedNodes, project } = useVueFlow()

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
const themeStore = useThemeStore()

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
  DocumentCopy,
  Connection
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
  { type: 'mermaid', label: 'Mermaid', icon: 'Connection', color: '#ec4899', desc: 'Mermaid绘图' }
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

onMounted(() => {
  themeStore.initTheme()
  workflowStore.loadSavedWorkflows()
  document.addEventListener('click', hideContextMenu)
  
  // 尝试从临时存储恢复工作流
  const restored = workflowStore.loadFromTemp()
  
  // 如果没有恢复到工作流（为空或首次打开），加载默认模板
  if (!restored || workflowStore.nodes.length === 0) {
    loadDefaultTemplate()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', hideContextMenu)
})

/**
 * 监听工作流变化，自动保存到临时存储
 */
watch(
  () => [workflowStore.nodes, workflowStore.edges],
  () => {
    if (workflowStore.nodes.length > 0) {
      workflowStore.saveCurrentToTemp()
    }
  },
  { deep: true }
)

/**
 * 加载默认模板（图片处理流水线）
 */
function loadDefaultTemplate() {
  const defaultTemplate = {
    id: 'full-pipeline',
    name: '图片处理流水线',
    nodes: [
      { type: 'upload', position: { x: 100, y: 200 } },
      { type: 'convert', position: { x: 300, y: 200 } },
      { type: 'compress', position: { x: 500, y: 200 } },
      { type: 'download', position: { x: 700, y: 200 } }
    ],
    edges: [
      { id: 'e1', source: 'node_1', target: 'node_2', sourceHandle: null, targetHandle: null },
      { id: 'e2', source: 'node_2', target: 'node_3', sourceHandle: null, targetHandle: null },
      { id: 'e3', source: 'node_3', target: 'node_4', sourceHandle: null, targetHandle: null }
    ]
  }
  
  workflowStore.clearWorkflow()
  workflowStore.currentWorkflowName = defaultTemplate.name
  
  const nodeIdMap = {}
  
  defaultTemplate.nodes.forEach((node, index) => {
    const newId = workflowStore.generateNodeId()
    const oldId = `node_${index + 1}`
    nodeIdMap[oldId] = newId
    
    workflowStore.addNode({
      id: newId,
      type: node.type,
      position: node.position,
      data: getDefaultNodeData(node.type)
    })
  })
  
  defaultTemplate.edges.forEach(edge => {
    workflowStore.addEdge({
      ...edge,
      source: nodeIdMap[edge.source] || edge.source,
      target: nodeIdMap[edge.target] || edge.target
    })
  })
}

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
 * 拖拽放置 - 使用鼠标实际位置
 */
function onDrop(event) {
  const type = event.dataTransfer.getData('application/vueflow')
  if (!type) return

  const bounds = event.target.closest('.vue-flow')?.getBoundingClientRect()
  if (!bounds) return

  // 计算鼠标相对于画布容器的位置
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top

  // 使用VueFlow的project方法转换坐标（考虑缩放和平移）
  const position = project({ x, y })

  const newNode = {
    id: workflowStore.generateNodeId(),
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
    compress: { compressLevel: 'normal', quality: 60, maxSizeRatio: 0.6 },
    convert: { format: 'png', jpgQuality: 92 },
    plantuml: { code: '@startuml\nalice -> bob\n@enduml' },
    mermaid: { code: 'graph TD\n    A[开始] --> B[结束]', outputFormat: 'png' },
    download: { downloadMode: 'batch', filePrefix: 'images' }
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
 * 检测是否会形成循环引用
 * @param {string} source - 连线起点
 * @param {string} target - 连线终点
 * @returns {boolean} - 如果会形成循环返回 true
 */
function wouldCreateCycle(source, target) {
  // 如果 source 和 target 是同一个节点，直接返回 true
  if (source === target) return true
  
  // 使用 BFS 检测从 target 出发是否能到达 source
  const visited = new Set()
  const queue = [target]
  
  while (queue.length > 0) {
    const current = queue.shift()
    
    if (current === source) return true
    
    if (visited.has(current)) continue
    visited.add(current)
    
    // 找到从 current 节点出发的所有连线
    for (const edge of workflowStore.edges) {
      if (edge.source === current && !visited.has(edge.target)) {
        queue.push(edge.target)
      }
    }
  }
  
  return false
}

/**
 * 创建连线 - 单叉连接限制
 * 每个节点的输出端只能连接一个节点
 * 每个节点的输入端只能连接一个节点
 * 不允许形成循环引用
 */
function onConnect(params) {
  const { source, target } = params
  
  // 检测是否会形成循环引用
  if (wouldCreateCycle(source, target)) {
    ElMessage.warning('不允许形成循环连接')
    return
  }
  
  // 找出需要移除的连线
  const edgesToRemove = workflowStore.edges.filter(
    edge => edge.source === source || edge.target === target
  )
  
  // 使用 VueFlow 的 removeEdges 方法移除连线
  if (edgesToRemove.length > 0) {
    removeEdges(edgesToRemove)
  }
  
  // 添加新连线
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
    ElMessage.success('工作流已清空')
  }).catch(() => {})
}

/**
 * 选择模板回调
 */
function onSelectTemplate(template) {
  workflowStore.clearWorkflow()
  workflowStore.currentWorkflowName = template.name
  
  const nodeIdMap = {}
  
  template.nodes.forEach((node, index) => {
    const newId = workflowStore.generateNodeId()
    const oldId = `node_${index + 1}`
    nodeIdMap[oldId] = newId
    
    workflowStore.addNode({
      id: newId,
      type: node.type,
      position: node.position,
      data: getDefaultNodeData(node.type)
    })
  })
  
  template.edges.forEach(edge => {
    workflowStore.addEdge({
      ...edge,
      source: nodeIdMap[edge.source] || edge.source,
      target: nodeIdMap[edge.target] || edge.target
    })
  })
  
  ElMessage.success(`已加载模板：${template.name}`)
}


</script>

<style scoped>
.workflow-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  transition: background-color 0.3s ease;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
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
  color: var(--color-primary);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.workflow-name {
  width: 180px;
}

.workflow-name :deep(.el-input__wrapper) {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  box-shadow: none;
  border-radius: 6px;
}

.workflow-name :deep(.el-input__wrapper:hover) {
  border-color: var(--border-secondary);
}

.workflow-name :deep(.el-input__wrapper:focus-within) {
  border-color: var(--border-focus);
  background: var(--bg-primary);
}

.workflow-name :deep(.el-input__inner) {
  color: var(--text-primary);
}

.workflow-name :deep(.el-input__inner::placeholder) {
  color: var(--text-placeholder);
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
  background: var(--color-success);
  border-color: var(--color-success);
}

.toolbar-center .el-button--success:hover {
  background: var(--color-success-hover);
  border-color: var(--color-success-hover);
}

.toolbar-center .el-button--danger {
  background: var(--color-danger);
  border-color: var(--color-danger);
}

.toolbar-center .el-button--danger:hover {
  background: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
}

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
  background: var(--color-info);
  border-color: var(--color-info);
}

.toolbar-center .save-btn:hover {
  background: var(--color-info-hover);
  border-color: var(--color-info-hover);
}

.toolbar-center .el-button--danger.is-plain {
  background: var(--bg-secondary);
  border-color: var(--border-secondary);
  color: var(--color-danger);
}

.toolbar-center .el-button--danger.is-plain:hover {
  background: var(--bg-hover);
  border-color: var(--color-danger);
  color: var(--color-danger-hover);
}

.manage-group .el-button {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
  color: var(--text-secondary);
}

.manage-group .el-button:hover {
  background: var(--bg-hover);
  border-color: var(--border-secondary);
  color: var(--text-primary);
}

.toolbar-right {
  min-width: 140px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--progress-bg);
  border: 1px solid var(--progress-border);
  border-radius: 6px;
}

.progress-text {
  font-size: 12px;
  color: var(--progress-text);
  font-weight: 600;
  min-width: 32px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-btn,
.github-btn {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.theme-btn:hover,
.github-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-secondary);
  color: var(--color-primary);
}

.github-link {
  text-decoration: none;
  display: flex;
}

.github-link .github-btn {
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: var(--bg-primary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, background-color 0.3s ease;
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
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
}

.node-panel.collapsed .panel-header {
  padding: 12px;
  justify-content: center;
}

.collapse-btn {
  margin-left: auto;
  background: var(--bg-secondary);
  border-color: var(--border-primary);
  color: var(--text-tertiary);
}

.collapse-btn:hover {
  background: var(--bg-hover);
  border-color: var(--border-secondary);
  color: var(--text-secondary);
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
  color: var(--text-tertiary);
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
  background: var(--bg-secondary);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.node-item:hover {
  background: var(--bg-primary);
  border-color: var(--node-color, var(--color-primary));
  box-shadow: var(--shadow-md);
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
  box-shadow: var(--shadow-md);
}

.node-info {
  flex: 1;
  overflow: hidden;
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.node-desc {
  font-size: 12px;
  color: var(--text-tertiary);
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
  color: var(--text-placeholder);
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
  background: var(--bg-primary);
  border-left: 1px solid var(--border-primary);
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
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  padding: 8px 0;
  z-index: 9999;
  min-width: 160px;
  border: 1px solid var(--border-primary);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: var(--bg-hover);
}

.menu-item:first-child:hover {
  color: var(--color-danger);
  background: var(--bg-secondary);
}
</style>
