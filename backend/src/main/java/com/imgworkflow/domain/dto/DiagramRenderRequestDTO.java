package com.imgworkflow.domain.dto;

import lombok.Data;

/**
 * 图表渲染请求DTO
 * 
 * @author imgworkflow
 */
@Data
public class DiagramRenderRequestDTO {

    /**
     * 图表代码
     */
    private String code;

    /**
     * 输出格式（png/svg）
     */
    private String format = "png";
}
