import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  return {
    nodes,
    edges,
    selectedNodeId,
    selectedNode,
    isExecuting,
    executionProgress,
    addNode,
    removeNode,
    updateNodeData,
    addEdge,
    removeEdge,
    setSelectedNode,
    clearWorkflow,
    exportWorkflow,
    importWorkflow
  }
})
