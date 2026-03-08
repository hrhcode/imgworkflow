package com.imgworkflow.service;

import com.imgworkflow.domain.entity.FileInfo;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文件存储服务接口
 * 
 * @author imgworkflow
 */
public interface FileStorageService {

    /**
     * 存储单个文件
     * @param file 上传的文件
     * @return 文件信息
     */
    FileInfo storeFile(MultipartFile file);

    /**
     * 批量存储文件
     * @param files 上传的文件列表
     * @return 文件信息列表
     */
    List<FileInfo> storeFiles(List<MultipartFile> files);

    /**
     * 根据ID获取文件信息
     * @param fileId 文件ID
     * @return 文件信息
     */
    FileInfo getFileInfo(String fileId);

    /**
     * 根据ID获取文件实际路径
     * @param fileId 文件ID
     * @return 文件路径
     */
    String getFilePath(String fileId);

    /**
     * 删除文件
     * @param fileId 文件ID
     * @return 是否删除成功
     */
    boolean deleteFile(String fileId);

    /**
     * 获取文件的访问URL
     * @param fileId 文件ID
     * @return 访问URL
     */
    String getFileUrl(String fileId);
}
