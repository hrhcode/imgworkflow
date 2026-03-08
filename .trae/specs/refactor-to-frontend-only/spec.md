# 重构为纯前端项目 Spec

## Why
当前项目采用前后端分离架构，需要Java环境和Maven才能运行后端服务，部署和使用门槛较高。改为纯前端架构可以：
1. 无需后端环境依赖，只需浏览器即可运行
2. 可部署到静态托管平台（GitHub Pages、Vercel等）
3. 用户数据存储在本地，隐私友好

## What Changes
- **BREAKING** 删除 backend 目录（SpringBoot后端项目）
- 重构前端项目，实现所有图片处理功能
- 使用 IndexedDB 存储图片文件
- 使用 browser-image-compression 实现图片压缩
- 使用 Canvas API 实现图片格式转换
- 使用 mermaid.js 实现Mermaid图表渲染
- 使用 PlantUML 在线服务实现PlantUML图表渲染
- 使用 JSZip 实现批量打包下载
- 更新项目配置，移除API代理配置

## Impact
- Affected specs: 图片处理、存储、下载功能
- Affected code: frontend/src/api/, frontend/src/stores/, frontend/src/components/nodes/, frontend/vite.config.js

## ADDED Requirements

### Requirement: 纯前端图片存储
系统应使用浏览器本地存储（IndexedDB）存储用户上传的图片文件。

#### Scenario: 存储图片
- **WHEN** 用户上传图片
- **THEN** 图片被存储到IndexedDB中，返回唯一标识符

#### Scenario: 读取图片
- **WHEN** 系统需要处理图片
- **THEN** 从IndexedDB读取图片数据

### Requirement: 纯前端图片压缩
系统应使用 browser-image-compression 库实现图片压缩功能。

#### Scenario: 压缩图片
- **WHEN** 用户配置压缩参数并执行压缩
- **THEN** 图片在浏览器端被压缩，输出压缩后的图片

### Requirement: 纯前端图片格式转换
系统应使用 Canvas API 实现图片格式转换功能。

#### Scenario: 转换格式
- **WHEN** 用户选择目标格式并执行转换
- **THEN** 图片被转换为目标格式（PNG/JPG/WebP）

### Requirement: 纯前端Mermaid渲染
系统应使用 mermaid.js 库在前端渲染Mermaid图表。

#### Scenario: 渲染Mermaid图表
- **WHEN** 用户输入Mermaid语法
- **THEN** 图表在前端实时渲染并显示预览

### Requirement: 纯前端PlantUML渲染
系统应使用PlantUML在线服务渲染PlantUML图表。

#### Scenario: 渲染PlantUML图表
- **WHEN** 用户输入PlantUML语法
- **THEN** 调用PlantUML在线服务生成图片并显示预览

### Requirement: 纯前端批量下载
系统应使用 JSZip 库实现批量打包下载功能。

#### Scenario: 批量下载
- **WHEN** 用户点击批量下载
- **THEN** 所有图片被打包为ZIP文件并下载

## MODIFIED Requirements

### Requirement: 前端项目配置
移除API代理配置，项目作为纯静态应用运行。

## REMOVED Requirements

### Requirement: 后端API服务
**Reason**: 改为纯前端架构，所有功能在浏览器端实现
**Migration**: 
- 图片存储：改用 IndexedDB
- 图片处理：改用前端库（browser-image-compression、Canvas API）
- 图表渲染：改用 mermaid.js 和 PlantUML 在线服务
- 文件下载：改用 JSZip
