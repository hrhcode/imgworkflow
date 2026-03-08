# Tasks

## 项目清理任务

- [ ] Task 1: 删除后端项目
  - [ ] SubTask 1.1: 删除 backend 目录
  - [ ] SubTask 1.2: 更新 .gitignore 移除后端相关配置

## 前端重构任务

- [ ] Task 2: 更新项目依赖
  - [ ] SubTask 2.1: 添加 browser-image-compression 图片压缩库
  - [ ] SubTask 2.2: 添加 mermaid Mermaid图表渲染库
  - [ ] SubTask 2.3: 添加 jszip 批量打包下载库
  - [ ] SubTask 2.4: 添加 idb IndexedDB操作库
  - [ ] SubTask 2.5: 更新 vite.config.js 移除API代理配置

- [ ] Task 3: 实现本地存储服务
  - [ ] SubTask 3.1: 创建 IndexedDB 存储服务
  - [ ] SubTask 3.2: 实现图片存储、读取、删除功能
  - [ ] SubTask 3.3: 实现存储空间管理

- [ ] Task 4: 实现图片压缩功能
  - [ ] SubTask 4.1: 创建图片压缩服务
  - [ ] SubTask 4.2: 使用 browser-image-compression 实现压缩
  - [ ] SubTask 4.3: 支持质量调整和尺寸调整

- [ ] Task 5: 实现图片格式转换功能
  - [ ] SubTask 5.1: 创建格式转换服务
  - [ ] SubTask 5.2: 使用 Canvas API 实现格式转换
  - [ ] SubTask 5.3: 支持 PNG/JPG/WebP 格式互转

- [ ] Task 6: 实现Mermaid图表渲染
  - [ ] SubTask 6.1: 创建Mermaid渲染服务
  - [ ] SubTask 6.2: 集成 mermaid.js
  - [ ] SubTask 6.3: 实现实时预览功能
  - [ ] SubTask 6.4: 实现导出为图片功能

- [ ] Task 7: 实现PlantUML图表渲染
  - [ ] SubTask 7.1: 创建PlantUML渲染服务
  - [ ] SubTask 7.2: 使用 PlantUML 在线服务生成图片
  - [ ] SubTask 7.3: 实现实时预览功能

- [ ] Task 8: 实现图片下载功能
  - [ ] SubTask 8.1: 创建下载服务
  - [ ] SubTask 8.2: 实现单张图片下载
  - [ ] SubTask 8.3: 使用 JSZip 实现批量打包下载

- [ ] Task 9: 重构节点组件
  - [ ] SubTask 9.1: 更新上传节点，使用本地存储
  - [ ] SubTask 9.2: 更新压缩节点，使用前端压缩服务
  - [ ] SubTask 9.3: 更新格式转换节点，使用前端转换服务
  - [ ] SubTask 9.4: 更新Mermaid节点，使用前端渲染服务
  - [ ] SubTask 9.5: 更新PlantUML节点，使用在线渲染服务
  - [ ] SubTask 9.6: 更新下载节点，使用前端下载服务

- [ ] Task 10: 重构工作流执行引擎
  - [ ] SubTask 10.1: 更新执行引擎，使用前端服务
  - [ ] SubTask 10.2: 实现节点间数据传递
  - [ ] SubTask 10.3: 实现执行进度显示

## 测试任务

- [ ] Task 11: 功能测试
  - [ ] SubTask 11.1: 测试图片上传和存储
  - [ ] SubTask 11.2: 测试图片压缩功能
  - [ ] SubTask 11.3: 测试图片格式转换功能
  - [ ] SubTask 11.4: 测试Mermaid图表渲染
  - [ ] SubTask 11.5: 测试PlantUML图表渲染
  - [ ] SubTask 11.6: 测试图片下载功能
  - [ ] SubTask 11.7: 测试完整工作流执行

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 2]
- [Task 7] depends on [Task 2]
- [Task 8] depends on [Task 2]
- [Task 9] depends on [Task 3, Task 4, Task 5, Task 6, Task 7, Task 8]
- [Task 10] depends on [Task 9]
- [Task 11] depends on [Task 10]
