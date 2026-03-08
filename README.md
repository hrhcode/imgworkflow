# ImgWorkflow - 图片处理工作流编辑器

一个基于 Vue 3 的可视化图片处理工作流编辑器，支持拖拽式节点编排、多种图片处理操作和文本绘图功能。

## 功能特性

### 图片处理节点
- **图片上传** - 支持批量上传图片文件
- **图片压缩** - 可调节压缩质量、尺寸限制
- **格式转换** - 支持 PNG、JPG、WebP、GIF 等格式互转
- **图片下载** - 支持单张下载或打包 ZIP 下载

### 文本绘图节点
- **Mermaid** - 使用 Mermaid 语法绘制流程图、时序图等
- **PlantUML** - 使用 PlantUML 语法绘制 UML 图

### 工作流功能
- 可视化拖拽编辑
- 节点连接与数据流转
- 工作流保存与加载
- 预设模板快速开始
- 执行进度显示
- 支持终止执行

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **状态管理**: Pinia
- **UI 组件**: Element Plus
- **流程图编辑**: Vue Flow
- **构建工具**: Vite
- **图片压缩**: browser-image-compression
- **图表渲染**: Mermaid、PlantUML
- **文件打包**: JSZip

## 项目结构

```
imgworkflow/
├── frontend/
│   ├── src/
│   │   ├── assets/          # 静态资源
│   │   │   └── styles/      # 全局样式
│   │   ├── components/      # 组件
│   │   │   ├── nodes/       # 节点组件
│   │   │   │   └── config/  # 节点配置面板
│   │   ├── router/          # 路由配置
│   │   ├── services/        # 服务层
│   │   ├── stores/          # 状态管理
│   │   ├── views/           # 页面视图
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 快速开始

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

### 创建工作流

1. 从左侧节点面板拖拽节点到画布
2. 点击节点的连接点并拖动到另一个节点建立连接
3. 点击节点在右侧面板配置参数
4. 点击"执行"按钮运行工作流

### 节点连接规则

- 每个节点有输入端口（左侧）和输出端口（右侧）
- 数据从左向右流动
- 一个输出可以连接多个输入
- 一个输入只能接受一个输出

### 工作流模板

系统提供以下预设模板：
- 图片压缩下载
- 格式转换下载
- 图片处理流水线
- Mermaid 绘图下载
- PlantUML 绘图下载

## 快捷键

- `Delete` / `Backspace` - 删除选中的节点

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
