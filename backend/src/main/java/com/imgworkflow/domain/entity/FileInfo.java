package com.imgworkflow.domain.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文件信息实体类
 * 
 * @author imgworkflow
 */
@Data
public class FileInfo {

    /**
     * 文件ID
     */
    private String id;

    /**
     * 原始文件名
     */
    private String originalName;

    /**
     * 存储文件名
     */
    private String storedName;

    /**
     * 文件路径
     */
    private String filePath;

    /**
     * 文件大小（字节）
     */
    private Long fileSize;

    /**
     * 文件类型
     */
    private String contentType;

    /**
     * 文件扩展名
     */
    private String extension;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
