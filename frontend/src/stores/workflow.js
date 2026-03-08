import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { compressImage } from '@/services/compressService'
import { convertImageFormat } from '@/services/convertService'
import { exportMermaidToImage } from '@/services/mermaidService'
import { getPlantUMLBlob } from '@/services/plantumlService'
import { downloadFile, downloadAsZip } from '@/services/downloadService'
import { getImage } from '@/services/storageService'
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

  // 获取当前选中的节点
  const selectedNode = computed(() => {
    return nodes.value.find(node => node.id === selectedNodeId.value)
  })

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
        // 压缩节点：压缩输入的图片
        const compressedImages = []
        for (const file of inputData) {
          try {
            const compressed = await compressImage(file, {
              quality: (data.quality || 80) / 100,
              maxWidth: data.width,
              maxHeight: data.height
            })
            compressedImages.push(compressed)
          } catch (error) {
            console.error('压缩失败:', error)
          }
        }
        return compressedImages
      
      case 'convert':
        // 格式转换节点
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
            console.error('转换失败:', error)
          }
        }
        return convertedImages
      
      case 'plantuml':
        // PlantUML节点
        if (data.code) {
          try {
            const blob = await getPlantUMLBlob(data.code, 'png')
            return [blob]
          } catch (error) {
            console.error('PlantUML渲染失败:', error)
            return []
          }
        }
        return []
      
      case 'mermaid':
        // Mermaid节点
        if (data.code) {
          try {
            const blob = await exportMermaidToImage(data.code, data.outputFormat || 'png')
            return [blob]
          } catch (error) {
            console.error('Mermaid渲染失败:', error)
            return []
          }
        }
        return []
      
      case 'download':
        // 下载节点
        if (inputData.length > 0) {
          if (data.downloadMode === 'single') {
            // 单张下载
            for (let i = 0; i < inputData.length; i++) {
              const file = inputData[i]
              const ext = data.format || 'png'
              downloadFile(file, `image_${i + 1}.${ext}`)
            }
          } else {
            // 批量打包下载
            const prefix = data.filePrefix || 'images'
            const files = inputData.map((file, i) => ({
              blob: file,
              name: `${prefix}_${i + 1}.${data.format || 'png'}`
            }))
            await downloadAsZip(files, `${prefix}.zip`)
          }
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
