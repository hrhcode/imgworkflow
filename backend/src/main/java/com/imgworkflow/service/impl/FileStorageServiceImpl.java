package com.imgworkflow.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.imgworkflow.domain.entity.FileInfo;
import com.imgworkflow.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 文件存储服务实现类
 * 
 * @author imgworkflow
 */
@Slf4j
@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @PostConstruct
    public void init() {
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
            log.info("创建上传目录：{}", uploadPath);
        }
    }

    @Override
    public FileInfo storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String originalName = file.getOriginalFilename();
            String extension = FileUtil.extName(originalName);
            String fileId = IdUtil.fastSimpleUUID();
            String storedName = fileId + "." + extension;

            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String dirPath = uploadPath + File.separator + datePath;
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String filePath = dirPath + File.separator + storedName;
            file.transferTo(new File(filePath));

            FileInfo fileInfo = new FileInfo();
            fileInfo.setId(fileId);
            fileInfo.setOriginalName(originalName);
            fileInfo.setStoredName(storedName);
            fileInfo.setFilePath(filePath);
            fileInfo.setFileSize(file.getSize());
            fileInfo.setContentType(file.getContentType());
            fileInfo.setExtension(extension);
            fileInfo.setCreateTime(LocalDateTime.now());

            log.info("文件存储成功：{}", filePath);
            return fileInfo;
        } catch (IOException e) {
            log.error("文件存储失败：{}", e.getMessage());
            throw new RuntimeException("文件存储失败", e);
        }
    }

    @Override
    public List<FileInfo> storeFiles(List<MultipartFile> files) {
        List<FileInfo> fileInfos = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                try {
                    FileInfo fileInfo = storeFile(file);
                    if (fileInfo != null) {
                        fileInfos.add(fileInfo);
                    }
                } catch (Exception e) {
                    log.error("文件 {} 存储失败：{}", file.getOriginalFilename(), e.getMessage());
                }
            }
        }
        return fileInfos;
    }

    @Override
    public FileInfo getFileInfo(String fileId) {
        return null;
    }

    @Override
    public String getFilePath(String fileId) {
        return null;
    }

    @Override
    public boolean deleteFile(String fileId) {
        return false;
    }

    @Override
    public String getFileUrl(String fileId) {
        return "/uploads/" + fileId;
    }
}
