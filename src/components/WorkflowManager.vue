<template>
  <el-drawer
    v-model="visible"
    title="工作流管理"
    direction="rtl"
    size="360px"
  >
    <div class="workflow-manager">
      <div class="manager-header">
        <el-button type="primary" @click="showSaveDialog" style="width: 100%">
          <el-icon><Plus /></el-icon>
          保存当前工作流
        </el-button>
      </div>
      
      <div class="workflow-list">
        <div class="list-title">已保存的工作流</div>
        <div v-if="workflowStore.savedWorkflows.length === 0" class="empty-tip">
          暂无保存的工作流
        </div>
        <div
          v-for="workflow in workflowStore.savedWorkflows"
          :key="workflow.id"
          class="workflow-item"
          :class="{ active: workflow.id === currentId }"
          @click="selectWorkflow(workflow)"
        >
          <div class="workflow-info">
            <div class="workflow-name" v-if="editingId !== workflow.id">
              {{ workflow.name }}
            </div>
            <el-input
              v-else
              v-model="editingName"
              size="small"
              @keyup.enter="confirmRename(workflow.id)"
              @keyup.escape="cancelRename"
              @blur="confirmRename(workflow.id)"
              ref="renameInput"
            />
            <div class="workflow-time">
              {{ formatDate(workflow.updatedAt) }}
            </div>
          </div>
          <div class="workflow-actions">
            <el-button
              type="primary"
              size="small"
              link
              @click.stop="loadWorkflow(workflow.id)"
            >
              加载
            </el-button>
            <el-button
              size="small"
              link
              @click.stop="startRename(workflow)"
            >
              重命名
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              @click.stop="handleDelete(workflow.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>

  <el-dialog
    v-model="saveDialogVisible"
    title="保存工作流"
    width="400px"
  >
    <el-form @submit.prevent="confirmSave">
      <el-form-item label="工作流名称">
        <el-input
          v-model="saveName"
          placeholder="请输入工作流名称"
          @keyup.enter="confirmSave"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="saveDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 工作流管理面板组件
 */
import { ref, watch, nextTick } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const workflowStore = useWorkflowStore()

const visible = ref(false)
const saveDialogVisible = ref(false)
const saveName = ref('')
const currentId = ref(null)
const editingId = ref(null)
const editingName = ref('')
const renameInput = ref(null)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val) {
    workflowStore.loadSavedWorkflows()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

/**
 * 显示保存对话框
 */
function showSaveDialog() {
  saveName.value = workflowStore.currentWorkflowName
  saveDialogVisible.value = true
}

/**
 * 确认保存
 */
function confirmSave() {
  if (!saveName.value.trim()) {
    ElMessage.warning('请输入工作流名称')
    return
  }
  
  const workflow = workflowStore.saveCurrentWorkflow(saveName.value.trim())
  currentId.value = workflow.id
  saveDialogVisible.value = false
  ElMessage.success('工作流保存成功')
}

/**
 * 选择工作流
 */
function selectWorkflow(workflow) {
  currentId.value = workflow.id
}

/**
 * 加载工作流
 */
function loadWorkflow(workflowId) {
  if (workflowStore.nodes.length > 0) {
    ElMessageBox.confirm(
      '加载新工作流将覆盖当前工作流，是否继续？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      doLoadWorkflow(workflowId)
    }).catch(() => {})
  } else {
    doLoadWorkflow(workflowId)
  }
}

function doLoadWorkflow(workflowId) {
  if (workflowStore.loadWorkflow(workflowId)) {
    currentId.value = workflowId
    visible.value = false
    ElMessage.success('工作流加载成功')
  }
}

/**
 * 开始重命名
 */
function startRename(workflow) {
  editingId.value = workflow.id
  editingName.value = workflow.name
  nextTick(() => {
    renameInput.value?.focus()
  })
}

/**
 * 确认重命名
 */
function confirmRename(workflowId) {
  if (editingName.value.trim()) {
    workflowStore.renameWorkflow(workflowId, editingName.value.trim())
    ElMessage.success('重命名成功')
  }
  cancelRename()
}

/**
 * 取消重命名
 */
function cancelRename() {
  editingId.value = null
  editingName.value = ''
}

/**
 * 删除工作流
 */
function handleDelete(workflowId) {
  ElMessageBox.confirm(
    '确定要删除这个工作流吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    workflowStore.deleteWorkflow(workflowId)
    if (currentId.value === workflowId) {
      currentId.value = null
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

/**
 * 格式化日期
 */
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.workflow-manager {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.manager-header {
  margin-bottom: 20px;
}

.workflow-list {
  flex: 1;
  overflow-y: auto;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-primary);
}

.empty-tip {
  text-align: center;
  color: var(--text-placeholder);
  padding: 40px 0;
}

.workflow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.workflow-item:hover {
  background: var(--bg-hover);
}

.workflow-item.active {
  background: var(--bg-hover);
  border: 1px solid var(--color-primary);
}

.workflow-info {
  flex: 1;
  overflow: hidden;
}

.workflow-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.workflow-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
</style>
