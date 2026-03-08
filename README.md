<p align="center">
  <a href="README.md">中文</a> | <a href="README_EN.md">English</a>
</p>

<p align="center">
  <img src="public/favicon.svg" alt="ImgWorkflow Logo" width="80" height="80">
</p>

<h1 align="center">ImgWorkflow</h1>

<p align="center">
  <strong>可视化图片处理工作流编辑器</strong>
</p>

<p align="center">
  基于 Vue 3 的拖拽式图片处理工作流编辑器，支持多种图片处理操作和文本绘图功能
</p>

<p align="center">
  <a href="http://hrhcode.com:5175/" target="_blank">🌐 在线演示</a> •
  <a href="#功能特性">功能特性</a> •
  <a href="#截图展示">截图展示</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#使用说明">使用说明</a> •
  <a href="#技术栈">技术栈</a>
</p>

---

## 功能特性

### 📷 图片处理节点

| 节点         | 描述                                                             |
| ------------ | ---------------------------------------------------------------- |
| **图片上传** | 支持批量上传图片文件，支持 JPG、PNG、WebP、GIF、BMP、AVIF 等格式 |
| **图片压缩** | 可调节压缩质量、尺寸限制，支持预设压缩等级和自定义参数           |
| **格式转换** | 支持 PNG、JPG、WebP、GIF、BMP、AVIF 等格式互转，可调节输出质量   |
| **图片下载** | 支持单张下载或打包 ZIP 下载，可自定义文件前缀                    |

### 📊 文本绘图节点

| 节点         | 描述                                                             |
| ------------ | ---------------------------------------------------------------- |
| **Mermaid**  | 使用 Mermaid 语法绘制流程图、时序图、甘特图等，支持 PNG/SVG 输出 |
| **PlantUML** | 使用 PlantUML 语法绘制 UML 图，支持 PNG/SVG 输出                 |

### 🔧 工作流功能

- ✅ **可视化拖拽编辑** - 直观的节点拖拽和连线操作
- ✅ **节点连接与数据流转** - 清晰的数据流向，支持单叉连接
- ✅ **工作流保存与加载** - 本地存储工作流配置
- ✅ **预设模板快速开始** - 内置多种常用工作流模板
- ✅ **执行进度显示** - 实时显示工作流执行进度
- ✅ **支持终止执行** - 随时终止正在执行的工作流
- ✅ **明暗主题切换** - 支持亮色和暗色两种主题

---

## 截图展示

### 亮色主题

![ImgWorkflow 亮色主题](public/screenshot-light.jpg)

### 暗色主题

![ImgWorkflow 暗色主题](public/screenshot-dark.jpg)

---

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

---

## 使用说明

### 创建工作流

1. 从左侧节点面板**拖拽节点**到画布
2. 点击节点的连接点并**拖动到另一个节点**建立连接
3. **点击节点**在右侧面板配置参数
4. 点击**"执行"按钮**运行工作流

### 节点连接规则

- 每个节点有输入端口（左侧）和输出端口（右侧）
- 数据从左向右流动
- 一个输出只能连接一个输入（单叉连接）
- 一个输入只能接受一个输出
- 不允许形成循环连接

### 工作流模板

系统提供以下预设模板，可快速开始：

| 模板名称          | 描述                                          |
| ----------------- | --------------------------------------------- |
| 图片处理流水线    | 完整的图片处理流程：上传 → 转换 → 压缩 → 下载 |
| 图片压缩下载      | 上传图片后压缩并下载                          |
| 格式转换下载      | 上传图片后转换格式并下载                      |
| PlantUML 绘图下载 | 使用 PlantUML 语法绘制图表并下载              |
| Mermaid 绘图下载  | 使用 Mermaid 语法绘制图表并下载               |

### 快捷键

| 快捷键                 | 功能           |
| ---------------------- | -------------- |
| `Delete` / `Backspace` | 删除选中的节点 |

---

## 技术栈

| 类别           | 技术                      |
| -------------- | ------------------------- |
| **前端框架**   | Vue 3 + Composition API   |
| **状态管理**   | Pinia                     |
| **UI 组件**    | Element Plus              |
| **流程图编辑** | Vue Flow                  |
| **构建工具**   | Vite                      |
| **图片压缩**   | browser-image-compression |
| **图表渲染**   | Mermaid、PlantUML         |
| **文件打包**   | JSZip                     |
| **本地存储**   | IndexedDB (idb)           |

---

## 项目结构

```
imgworkflow/
├── public/
│   ├── favicon.svg          # 网站图标
│   ├── screenshot-light.jpg # 亮色主题截图
│   └── screenshot-dark.jpg  # 暗色主题截图
├── src/
│   ├── assets/
│   │   └── styles/          # 全局样式
│   ├── components/
│   │   ├── nodes/           # 节点组件
│   │   │   └── config/      # 节点配置面板
│   │   ├── TemplatePanel.vue
│   │   └── WorkflowManager.vue
│   ├── router/              # 路由配置
│   ├── services/            # 服务层
│   │   ├── compressService.js
│   │   ├── convertService.js
│   │   ├── downloadService.js
│   │   ├── mermaidService.js
│   │   ├── plantumlService.js
│   │   └── storageService.js
│   ├── stores/              # 状态管理
│   │   ├── theme.js
│   │   └── workflow.js
│   ├── views/
│   │   └── WorkflowEditor.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── README_EN.md
```

---

## 浏览器支持

| 浏览器  | 支持情况 |
| ------- | -------- |
| Chrome  | ✅ 推荐  |
| Firefox | ✅ 支持  |
| Safari  | ✅ 支持  |
| Edge    | ✅ 支持  |

---

## 许可证

[MIT License](LICENSE)

---

## 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Vue Flow](https://vueflow.dev/) - Vue 3 流程图库
- [Mermaid](https://mermaid.js.org/) - JavaScript 图表库
- [PlantUML](https://plantuml.com/) - UML 图表工具
