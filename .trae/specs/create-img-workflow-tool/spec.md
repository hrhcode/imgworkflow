# 图片工作流工具 Spec

## Why
用户需要一个可视化的图片处理工具，能够灵活组合各种图片处理功能（压缩、格式转换、文本绘图），通过拖拽方式构建自定义工作流，提高图片处理效率。

## What Changes
- 创建前端可视化工作流编辑器，支持节点拖拽和连线
- 实现图片批量上传功能
- 实现图片压缩功能
- 实现图片格式转换功能
- 实现PlantUML/Mermaid文本绘图功能
- 实现工作流执行引擎
- 创建后端API服务

## Impact
- 新建前端项目：基于Vue/React的可视化工作流编辑器
- 新建后端项目：基于SpringBoot的API服务
- 涉及技术：图片处理库、PlantUML/Mermaid渲染引擎、工作流引擎

## ADDED Requirements

### Requirement: 工作流编辑器
系统应提供可视化工作流编辑器，支持用户通过拖拽方式创建和编辑工作流。

#### Scenario: 添加节点
- **WHEN** 用户从节点面板拖拽节点到画布
- **THEN** 节点被添加到画布上，显示节点配置面板

#### Scenario: 连接节点
- **WHEN** 用户从一个节点的输出端口拖拽连线到另一个节点的输入端口
- **THEN** 两个节点建立连接关系，形成数据流向

#### Scenario: 删除节点或连线
- **WHEN** 用户选中节点或连线并按下删除键
- **THEN** 选中的节点或连线被移除

### Requirement: 图片上传节点
系统应提供图片上传节点，支持批量上传图片文件。

#### Scenario: 批量上传图片
- **WHEN** 用户点击上传节点并选择多个图片文件
- **THEN** 图片被上传到服务器，节点显示已上传的图片数量和预览

#### Scenario: 支持的图片格式
- **WHEN** 用户上传图片
- **THEN** 系统支持JPG、PNG、GIF、WebP、BMP等常见格式

### Requirement: 图片压缩节点
系统应提供图片压缩节点，支持调整压缩质量和尺寸。

#### Scenario: 配置压缩参数
- **WHEN** 用户配置压缩节点的质量参数（1-100）和目标尺寸
- **THEN** 参数被保存到节点配置中

#### Scenario: 执行压缩
- **WHEN** 工作流执行到压缩节点
- **THEN** 输入的图片按照配置参数进行压缩处理

### Requirement: 图片格式转换节点
系统应提供图片格式转换节点，支持多种格式互转。

#### Scenario: 选择目标格式
- **WHEN** 用户配置格式转换节点的目标格式
- **THEN** 目标格式被保存到节点配置中

#### Scenario: 执行格式转换
- **WHEN** 工作流执行到格式转换节点
- **THEN** 输入的图片被转换为目标格式

### Requirement: PlantUML绘图节点
系统应提供PlantUML绘图节点，支持通过文本语法生成图片。

#### Scenario: 输入PlantUML语法
- **WHEN** 用户在PlantUML节点中输入PlantUML语法文本
- **THEN** 系统实时预览生成的图片

#### Scenario: 执行绘图
- **WHEN** 工作流执行到PlantUML节点
- **THEN** PlantUML语法被渲染为图片输出

### Requirement: Mermaid绘图节点
系统应提供Mermaid绘图节点，支持通过文本语法生成图片。

#### Scenario: 输入Mermaid语法
- **WHEN** 用户在Mermaid节点中输入Mermaid语法文本
- **THEN** 系统实时预览生成的图片

#### Scenario: 执行绘图
- **WHEN** 工作流执行到Mermaid节点
- **THEN** Mermaid语法被渲染为图片输出

### Requirement: 图片下载节点
系统应提供图片下载节点，支持下载处理后的图片。

#### Scenario: 单张下载
- **WHEN** 工作流执行完成且用户点击下载单张图片
- **THEN** 图片被下载到本地

#### Scenario: 批量下载
- **WHEN** 工作流执行完成且用户点击批量下载
- **THEN** 所有图片被打包为ZIP文件下载

### Requirement: 工作流执行
系统应支持工作流的执行、暂停和停止。

#### Scenario: 执行工作流
- **WHEN** 用户点击执行按钮
- **THEN** 工作流按照节点连接顺序依次执行，显示执行进度

#### Scenario: 查看执行结果
- **WHEN** 工作流执行完成
- **THEN** 用户可以预览每个节点的输出结果

### Requirement: 工作流保存与加载
系统应支持工作流的保存和加载。

#### Scenario: 保存工作流
- **WHEN** 用户点击保存按钮
- **THEN** 当前工作流配置被保存到本地存储或服务器

#### Scenario: 加载工作流
- **WHEN** 用户选择已保存的工作流
- **THEN** 工作流被加载到编辑器中

## MODIFIED Requirements
无

## REMOVED Requirements
无
