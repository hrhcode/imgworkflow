package com.imgworkflow.service;

import com.imgworkflow.domain.entity.FileInfo;

/**
 * 图表渲染服务接口
 * 
 * @author imgworkflow
 */
public interface DiagramRenderService {

    /**
     * 渲染PlantUML图表
     * @param code PlantUML代码
     * @param format 输出格式
     * @return 生成的图片文件信息
     */
    FileInfo renderPlantUML(String code, String format);

    /**
     * 渲染Mermaid图表
     * @param code Mermaid代码
     * @param format 输出格式
     * @return 生成的图片文件信息
     */
    FileInfo renderMermaid(String code, String format);
}
