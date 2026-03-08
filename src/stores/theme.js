import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

/**
 * 主题管理 Store
 * 负责管理应用的主题状态（亮色/暗色模式）
 */
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  /**
   * 初始化主题，从本地存储读取用户偏好
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  /**
   * 应用主题到 DOM
   */
  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  }
})
