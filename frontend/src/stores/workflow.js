import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { compressImage } from '@/services/compressService'
import { convertImageFormat } from '@/services/convertService'
import { exportMermaidToImage } from '@/services/mermaidService'
import { getPlantUMLBlob } from '@/services/plantumlService'
import { downloadFile, downloadAsZip } from '@/services/downloadService'
import { ElMessage } from 'element-plus'

/**
 * 工作流状态管理
 */
export const useWorkflowStore = defineStore('workflow', () => {
  // 节点列表
  const nodes = ref([])
  // 连线列表
  const edges = ref([])
  // 当前选中的节点ID
  const selectedNodeId = ref(null)
  // 工作流执行状态
  const isExecuting = ref(false)
  // 执行进度
  const executionProgress = ref(0)
  // 执行日志
  const executionLogs = ref([])
  // 当前工作流名称
  const currentWorkflowName = ref('未命名工作流')
  // 已保存的工作流列表
  const savedWorkflows = ref([])

  // 获取当前选中的节点
  const selectedNode = computed(() => {
    return nodes.value.find(node => node.id === selectedNodeId.value)
  })

  /**
   * 加载已保存的工作流列表
   */
  function loadSavedWorkflows() {
    const saved = localStorage.getItem('workflows')
    if (saved) {
      savedWorkflows.value = JSON.parse(saved)
    }
  }

  /**
   * 保存工作流列表到本地存储
   */
  function saveWorkflowsToStorage() {
    localStorage.setItem('workflows', JSON.stringify(savedWorkflows.value))
  }

  /**
   * 保存当前工作流
   */
  function saveCurrentWorkflow(name) {
    const workflowName = name || currentWorkflowName.value
    const workflow = {
      id: Date.now().toString(),
      name: workflowName,
      nodes: nodes.value,
      edges: edges.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const existingIndex = savedWorkflows.value.findIndex(w => w.name === workflowName)
    if (existingIndex > -1) {
      workflow.id = savedWorkflows.value[existingIndex].id
      workflow.createdAt = savedWorkflows.value[existingIndex].createdAt
      savedWorkflows.value[existingIndex] = workflow
    } else {
      savedWorkflows.value.push(workflow)
    }
    
    currentWorkflowName.value = workflowName
    saveWorkflowsToStorage()
    return workflow
  }

  /**
   * 加载工作流
   */
  function loadWorkflow(workflowId) {
    const workflow = savedWorkflows.value.find(w => w.id === workflowId)
    if (workflow) {
      nodes.value = workflow.nodes || []
      edges.value = workflow.edges || []
      currentWorkflowName.value = workflow.name
      selectedNodeId.value = null
      return true
    }
    return false
  }

  /**
   * 删除工作流
   */
  function deleteWorkflow(workflowId) {
    const index = savedWorkflows.value.findIndex(w => w.id === workflowId)
    if (index > -1) {
      savedWorkflows.value.splice(index, 1)
      saveWorkflowsToStorage()
      return true
    }
    return false
  }

  /**
   * 重命名工作流
   */
  function renameWorkflow(workflowId, newName) {
    const workflow = savedWorkflows.value.find(w => w.id === workflowId)
    if (workflow) {
      workflow.name = newName
      workflow.updatedAt = new Date().toISOString()
      saveWorkflowsToStorage()
      if (currentWorkflowName.value === workflow.name) {
        currentWorkflowName.value = newName
      }
      return true
    }
    return false
  }

  /**
   * 添加节点
   * @param {Object} node - 节点对象
   */
  function addNode(node) {
    nodes.value.push(node)
  }

  /**
   * 删除节点
   * @param {string} nodeId - 节点ID
   */
  function removeNode(nodeId) {
    const index = nodes.value.findIndex(node => node.id === nodeId)
    if (index > -1) {
      nodes.value.splice(index, 1)
    }
    // 同时删除相关的连线
    edges.value = edges.value.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null
    }
  }

  /**
   * 更新节点数据
   * @param {string} nodeId - 节点ID
   * @param {Object} data - 更新的数据
   */
  function updateNodeData(nodeId, data) {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      node.data = { ...node.data, ...data }
    }
  }

  /**
   * 添加连线
   * @param {Object} edge - 连线对象
   */
  function addEdge(edge) {
    edges.value.push(edge)
  }

  /**
   * 删除连线
   * @param {string} edgeId - 连线ID
   */
  function removeEdge(edgeId) {
    const index = edges.value.findIndex(edge => edge.id === edgeId)
    if (index > -1) {
      edges.value.splice(index, 1)
    }
  }

  /**
   * 设置选中的节点
   * @param {string} nodeId - 节点ID
   */
  function setSelectedNode(nodeId) {
    selectedNodeId.value = nodeId
  }

  /**
   * 清空工作流
   */
  function clearWorkflow() {
    nodes.value = []
    edges.value = []
    selectedNodeId.value = null
    isExecuting.value = false
    executionProgress.value = 0
    executionLogs.value = []
  }

  /**
   * 导出工作流配置
   */
  function exportWorkflow() {
    return {
      nodes: nodes.value,
      edges: edges.value
    }
  }

  /**
   * 导入工作流配置
   * @param {Object} workflow - 工作流配置
   */
  function importWorkflow(workflow) {
    nodes.value = workflow.nodes || []
    edges.value = workflow.edges || []
  }

  /**
   * 添加执行日志
   */
  function addLog(message, type = 'info') {
    executionLogs.value.push({
      time: new Date().toLocaleTimeString(),
      message,
      type
    })
  }

  /**
   * 获取节点的输入节点
   */
  function getInputNodes(nodeId) {
    return edges.value
      .filter(edge => edge.target === nodeId)
      .map(edge => nodes.value.find(n => n.id === edge.source))
      .filter(Boolean)
  }

  /**
   * 获取拓扑排序后的节点顺序
   */
  function getExecutionOrder() {
    const visited = new Set()
    const order = []
    
    function visit(nodeId) {
      if (visited.has(nodeId)) return
      visited.add(nodeId)
      
      const inputNodes = getInputNodes(nodeId)
      for (const inputNode of inputNodes) {
        visit(inputNode.id)
      }
      
      order.push(nodeId)
    }
    
    for (const node of nodes.value) {
      visit(node.id)
    }
    
    return order
  }

  /**
   * 执行工作流
   */
  async function executeWorkflow() {
    if (isExecuting.value) return
    
    isExecuting.value = true
    executionProgress.value = 0
    executionLogs.value = []
    
    addLog('开始执行工作流', 'info')
    
    const order = getExecutionOrder()
    const total = order.length
    let completed = 0
    
    // 存储每个节点的输出
    const nodeOutputs = new Map()
    
    try {
      for (const nodeId of order) {
        const node = nodes.value.find(n => n.id === nodeId)
        if (!node) continue
        
        addLog(`执行节点: ${getNodeLabel(node.type)}`, 'info')
        
        // 获取输入数据
        const inputNodes = getInputNodes(nodeId)
        let inputData = []
        
        if (inputNodes.length > 0) {
          for (const inputNode of inputNodes) {
            const output = nodeOutputs.get(inputNode.id)
            if (output) {
              inputData = inputData.concat(output)
            }
          }
        }
        
        // 执行节点处理
        const output = await executeNode(node, inputData)
        nodeOutputs.set(nodeId, output)
        
        completed++
        executionProgress.value = Math.round((completed / total) * 100)
        
        addLog(`节点 ${getNodeLabel(node.type)} 执行完成`, 'success')
      }
      
      addLog('工作流执行完成', 'success')
      ElMessage.success('工作流执行完成')
    } catch (error) {
      addLog(`执行失败: ${error.message}`, 'error')
      ElMessage.error('工作流执行失败: ' + error.message)
    } finally {
      isExecuting.value = false
    }
  }

  /**
   * 执行单个节点
   */
  async function executeNode(node, inputData) {
    const type = node.type
    const data = node.data || {}
    
    switch (type) {
      case 'upload':
        // 上传节点：返回存储的文件
        return data.files || []
      
      case 'compress':
        if (inputData.length === 0) {
          addLog('压缩节点没有输入数据', 'warning')
          return []
        }
        const compressedImages = []
        for (const file of inputData) {
          try {
            const compressed = await compressImage(file, {
              quality: (data.quality || 80) / 100,
              maxWidth: data.width,
              maxHeight: data.height,
              keepAspectRatio: data.keepAspectRatio !== false
            })
            compressedImages.push(compressed)
          } catch (error) {
            addLog(`压缩图片失败: ${error.message}`, 'error')
          }
        }
        return compressedImages
      
      case 'convert':
        if (inputData.length === 0) {
          addLog('格式转换节点没有输入数据', 'warning')
          return []
        }
        const convertedImages = []
        for (const file of inputData) {
          try {
            const converted = await convertImageFormat(
              file, 
              data.format || 'png',
              (data.jpgQuality || 92) / 100
            )
            convertedImages.push(converted)
          } catch (error) {
            addLog(`转换图片失败: ${error.message}`, 'error')
          }
        }
        return convertedImages
      
      case 'plantuml':
        if (!data.code) {
          addLog('PlantUML节点没有配置代码', 'warning')
          return []
        }
        try {
          const blob = await getPlantUMLBlob(data.code, 'png')
          addLog('PlantUML渲染成功', 'success')
          return [blob]
        } catch (error) {
          addLog(`PlantUML渲染失败: ${error.message}`, 'error')
          return []
        }
      
      case 'mermaid':
        if (!data.code) {
          addLog('Mermaid节点没有配置代码', 'warning')
          return []
        }
        try {
          const blob = await exportMermaidToImage(data.code, data.outputFormat || 'png')
          addLog('Mermaid渲染成功', 'success')
          return [blob]
        } catch (error) {
          addLog(`Mermaid渲染失败: ${error.message}`, 'error')
          return []
        }
      
      case 'download':
        if (inputData.length === 0) {
          addLog('下载节点没有输入数据', 'warning')
          return []
        }
        if (data.downloadMode === 'single') {
          for (let i = 0; i < inputData.length; i++) {
            const file = inputData[i]
            const ext = data.format || 'png'
            downloadFile(file, `image_${i + 1}.${ext}`)
          }
          addLog(`已下载 ${inputData.length} 张图片`, 'success')
        } else {
          const prefix = data.filePrefix || 'images'
          const files = inputData.map((file, i) => ({
            blob: file,
            name: `${prefix}_${i + 1}.${data.format || 'png'}`
          }))
          await downloadAsZip(files, `${prefix}.zip`)
          addLog(`已打包下载 ${inputData.length} 张图片`, 'success')
        }
        return inputData
      
      default:
        return inputData
    }
  }

  /**
   * 获取节点标签
   */
  function getNodeLabel(type) {
    const labels = {
      upload: '图片上传',
      compress: '图片压缩',
      convert: '格式转换',
      plantuml: 'PlantUML绘图',
      mermaid: 'Mermaid绘图',
      download: '图片下载'
    }
    return labels[type] || type
  }

  return {
    nodes,
    edges,
    selectedNodeId,
    selectedNode,
    isExecuting,
    executionProgress,
    executionLogs,
    currentWorkflowName,
    savedWorkflows,
    loadSavedWorkflows,
    saveCurrentWorkflow,
    loadWorkflow,
    deleteWorkflow,
    renameWorkflow,
    addNode,
    removeNode,
    updateNodeData,
    addEdge,
    removeEdge,
    setSelectedNode,
    clearWorkflow,
    exportWorkflow,
    importWorkflow,
    executeWorkflow,
    addLog
  }
})
