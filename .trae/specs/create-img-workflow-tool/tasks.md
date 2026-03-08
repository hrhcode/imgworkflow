# Tasks

## 后端开发任务

- [ ] Task 1: 搭建SpringBoot后端项目基础结构
  - [ ] SubTask 1.1: 创建SpringBoot项目，配置Maven依赖
  - [ ] SubTask 1.2: 创建项目层级目录结构（provider、service、dao、domain、common）
  - [ ] SubTask 1.3: 配置全局异常处理和统一响应格式
  - [ ] SubTask 1.4: 配置文件上传相关参数

- [ ] Task 2: 实现图片上传API
  - [ ] SubTask 2.1: 创建图片上传Controller
  - [ ] SubTask 2.2: 实现图片文件存储服务
  - [ ] SubTask 2.3: 创建图片实体类和DTO
  - [ ] SubTask 2.4: 实现图片上传接口

- [ ] Task 3: 实现图片压缩功能
  - [ ] SubTask 3.1: 添加图片处理库依赖（如Thumbnailator或ImageMagick）
  - [ ] SubTask 3.2: 创建图片压缩Service接口和实现类
  - [ ] SubTask 3.3: 实现质量压缩和尺寸调整功能
  - [ ] SubTask 3.4: 创建图片压缩API接口

- [ ] Task 4: 实现图片格式转换功能
  - [ ] SubTask 4.1: 创建格式转换Service接口和实现类
  - [ ] SubTask 4.2: 实现JPG、PNG、GIF、WebP等格式互转
  - [ ] SubTask 4.3: 创建格式转换API接口

- [ ] Task 5: 实现PlantUML绘图功能
  - [ ] SubTask 5.1: 添加PlantUML依赖（plantuml.jar）
  - [ ] SubTask 5.2: 创建PlantUML渲染Service接口和实现类
  - [ ] SubTask 5.3: 实现PlantUML语法解析和图片生成
  - [ ] SubTask 5.4: 创建PlantUML绘图API接口

- [ ] Task 6: 实现Mermaid绘图功能
  - [ ] SubTask 6.1: 集成Mermaid CLI或使用Puppeteer渲染
  - [ ] SubTask 6.2: 创建Mermaid渲染Service接口和实现类
  - [ ] SubTask 6.3: 实现Mermaid语法解析和图片生成
  - [ ] SubTask 6.4: 创建Mermaid绘图API接口

- [ ] Task 7: 实现图片下载功能
  - [ ] SubTask 7.1: 创建图片下载Controller
  - [ ] SubTask 7.2: 实现单张图片下载接口
  - [ ] SubTask 7.3: 实现批量图片打包下载接口（ZIP格式）

## 前端开发任务

- [ ] Task 8: 搭建前端项目基础结构
  - [ ] SubTask 8.1: 使用Vue3或React创建前端项目
  - [ ] SubTask 8.2: 安装必要依赖（工作流库、UI组件库）
  - [ ] SubTask 8.3: 配置项目结构和路由

- [ ] Task 9: 实现工作流编辑器核心功能
  - [ ] SubTask 9.1: 集成流程图库（如Vue Flow、React Flow或LogicFlow）
  - [ ] SubTask 9.2: 实现节点面板，展示可用节点列表
  - [ ] SubTask 9.3: 实现画布拖拽功能
  - [ ] SubTask 9.4: 实现节点连线功能
  - [ ] SubTask 9.5: 实现节点配置面板

- [ ] Task 10: 实现图片上传节点
  - [ ] SubTask 10.1: 创建图片上传节点组件
  - [ ] SubTask 10.2: 实现文件选择和拖拽上传
  - [ ] SubTask 10.3: 实现上传进度显示
  - [ ] SubTask 10.4: 实现图片预览功能

- [ ] Task 11: 实现图片压缩节点
  - [ ] SubTask 11.1: 创建图片压缩节点组件
  - [ ] SubTask 11.2: 实现压缩参数配置面板（质量、尺寸）
  - [ ] SubTask 11.3: 实现压缩结果预览

- [ ] Task 12: 实现图片格式转换节点
  - [ ] SubTask 12.1: 创建格式转换节点组件
  - [ ] SubTask 12.2: 实现目标格式选择面板
  - [ ] SubTask 12.3: 实现转换结果预览

- [ ] Task 13: 实现PlantUML绘图节点
  - [ ] SubTask 13.1: 创建PlantUML节点组件
  - [ ] SubTask 13.2: 实现PlantUML语法编辑器
  - [ ] SubTask 13.3: 实现实时预览功能

- [ ] Task 14: 实现Mermaid绘图节点
  - [ ] SubTask 14.1: 创建Mermaid节点组件
  - [ ] SubTask 14.2: 实现Mermaid语法编辑器
  - [ ] SubTask 14.3: 实现实时预览功能

- [ ] Task 15: 实现图片下载节点
  - [ ] SubTask 15.1: 创建下载节点组件
  - [ ] SubTask 15.2: 实现单张下载功能
  - [ ] SubTask 15.3: 实现批量下载功能

- [ ] Task 16: 实现工作流执行引擎
  - [ ] SubTask 16.1: 创建工作流执行服务
  - [ ] SubTask 16.2: 实现节点执行顺序调度
  - [ ] SubTask 16.3: 实现执行进度显示
  - [ ] SubTask 16.4: 实现执行结果展示

- [ ] Task 17: 实现工作流保存与加载
  - [ ] SubTask 17.1: 实现工作流JSON序列化
  - [ ] SubTask 17.2: 实现工作流保存到本地存储
  - [ ] SubTask 17.3: 实现工作流加载功能
  - [ ] SubTask 17.4: 创建工作流列表管理界面

## 集成测试任务

- [ ] Task 18: 端到端测试
  - [ ] SubTask 18.1: 测试上传-压缩-下载工作流
  - [ ] SubTask 18.2: 测试上传-格式转换-下载工作流
  - [ ] SubTask 18.3: 测试PlantUML绘图-压缩-下载工作流
  - [ ] SubTask 18.4: 测试Mermaid绘图-格式转换-下载工作流

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 1]
- [Task 7] depends on [Task 1]
- [Task 10] depends on [Task 8, Task 9]
- [Task 11] depends on [Task 8, Task 9]
- [Task 12] depends on [Task 8, Task 9]
- [Task 13] depends on [Task 8, Task 9]
- [Task 14] depends on [Task 8, Task 9]
- [Task 15] depends on [Task 8, Task 9]
- [Task 16] depends on [Task 10, Task 11, Task 12, Task 13, Task 14, Task 15]
- [Task 17] depends on [Task 16]
- [Task 18] depends on [Task 7, Task 17]
