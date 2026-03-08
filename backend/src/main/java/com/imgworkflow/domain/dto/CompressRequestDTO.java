package com.imgworkflow.domain.dto;

import lombok.Data;

/**
 * 图片压缩请求DTO
 * 
 * @author imgworkflow
 */
@Data
public class CompressRequestDTO {

    /**
     * 文件ID列表
     */
    private String[] fileIds;

    /**
     * 压缩质量（1-100）
     */
    private Integer quality = 80;

    /**
     * 目标宽度
     */
    private Integer width;

    /**
     * 目标高度
     */
    private Integer height;

    /**
     * 是否保持宽高比
     */
    private Boolean keepAspectRatio = true;
}
