package com.imgworkflow.domain.dto;

import lombok.Data;
import java.util.List;

/**
 * 文件上传响应DTO
 * 
 * @author imgworkflow
 */
@Data
public class UploadResultDTO {

    /**
     * 上传成功的文件数量
     */
    private Integer successCount;

    /**
     * 上传失败的文件数量
     */
    private Integer failCount;

    /**
     * 文件信息列表
     */
    private List<FileInfoDTO> files;

    /**
     * 文件信息DTO
     */
    @Data
    public static class FileInfoDTO {
        /**
         * 文件ID
         */
        private String id;

        /**
         * 原始文件名
         */
        private String originalName;

        /**
         * 文件大小
         */
        private Long fileSize;

        /**
         * 文件类型
         */
        private String contentType;

        /**
         * 访问URL
         */
        private String url;
    }
}
