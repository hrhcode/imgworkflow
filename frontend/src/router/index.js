import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'WorkflowEditor',
    component: () => import('@/views/WorkflowEditor.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
