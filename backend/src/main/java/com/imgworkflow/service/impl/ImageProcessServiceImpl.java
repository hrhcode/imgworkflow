package com.imgworkflow.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.imgworkflow.common.exception.BusinessException;
import com.imgworkflow.domain.entity.FileInfo;
import com.imgworkflow.service.FileStorageService;
import com.imgworkflow.service.ImageProcessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 图片处理服务实现类
 * 
 * @author imgworkflow
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageProcessServiceImpl implements ImageProcessService {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    private final FileStorageService fileStorageService;

    @Override
    public FileInfo compressImage(File sourceFile, int quality, Integer width, Integer height, boolean keepAspectRatio) {
        try {
            String fileId = IdUtil.fastSimpleUUID();
            String extension = FileUtil.extName(sourceFile);
            String storedName = fileId + "." + extension;

            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String dirPath = uploadPath + File.separator + "compressed" + File.separator + datePath;
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String outputPath = dirPath + File.separator + storedName;

            Thumbnails.Builder<File> builder = Thumbnails.of(sourceFile);
            builder.outputQuality(quality / 100.0);

            if (width != null && height != null) {
                if (keepAspectRatio) {
                    builder.size(width, height);
                } else {
                    builder.forceSize(width, height);
                }
            } else if (width != null) {
                builder.width(width);
            } else if (height != null) {
                builder.height(height);
            }

            builder.outputFormat(extension);
            builder.toFile(outputPath);

            File outputFile = new File(outputPath);
            FileInfo fileInfo = new FileInfo();
            fileInfo.setId(fileId);
            fileInfo.setOriginalName(sourceFile.getName());
            fileInfo.setStoredName(storedName);
            fileInfo.setFilePath(outputPath);
            fileInfo.setFileSize(outputFile.length());
            fileInfo.setContentType(getContentType(extension));
            fileInfo.setExtension(extension);
            fileInfo.setCreateTime(LocalDateTime.now());

            log.info("图片压缩成功：{} -> {}", sourceFile.getName(), outputPath);
            return fileInfo;
        } catch (IOException e) {
            log.error("图片压缩失败：{}", e.getMessage());
            throw new BusinessException("图片压缩失败：" + e.getMessage());
        }
    }

    @Override
    public List<FileInfo> compressImages(String[] fileIds, int quality, Integer width, Integer height, boolean keepAspectRatio) {
        List<FileInfo> results = new ArrayList<>();
        for (String fileId : fileIds) {
            try {
                String filePath = fileStorageService.getFilePath(fileId);
                if (StrUtil.isBlank(filePath)) {
                    log.warn("文件不存在：{}", fileId);
                    continue;
                }
                File sourceFile = new File(filePath);
                if (!sourceFile.exists()) {
                    log.warn("文件不存在：{}", filePath);
                    continue;
                }
                FileInfo fileInfo = compressImage(sourceFile, quality, width, height, keepAspectRatio);
                results.add(fileInfo);
            } catch (Exception e) {
                log.error("压缩文件 {} 失败：{}", fileId, e.getMessage());
            }
        }
        return results;
    }

    @Override
    public FileInfo convertFormat(File sourceFile, String targetFormat, int quality) {
        try {
            String fileId = IdUtil.fastSimpleUUID();
            String storedName = fileId + "." + targetFormat.toLowerCase();

            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String dirPath = uploadPath + File.separator + "converted" + File.separator + datePath;
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String outputPath = dirPath + File.separator + storedName;

            Thumbnails.Builder<File> builder = Thumbnails.of(sourceFile);
            builder.outputFormat(targetFormat.toLowerCase());

            if ("jpg".equalsIgnoreCase(targetFormat) || "jpeg".equalsIgnoreCase(targetFormat)) {
                builder.outputQuality(quality / 100.0);
            }

            builder.toFile(outputPath);

            File outputFile = new File(outputPath);
            FileInfo fileInfo = new FileInfo();
            fileInfo.setId(fileId);
            fileInfo.setOriginalName(sourceFile.getName());
            fileInfo.setStoredName(storedName);
            fileInfo.setFilePath(outputPath);
            fileInfo.setFileSize(outputFile.length());
            fileInfo.setContentType(getContentType(targetFormat));
            fileInfo.setExtension(targetFormat.toLowerCase());
            fileInfo.setCreateTime(LocalDateTime.now());

            log.info("图片格式转换成功：{} -> {}", sourceFile.getName(), targetFormat);
            return fileInfo;
        } catch (IOException e) {
            log.error("图片格式转换失败：{}", e.getMessage());
            throw new BusinessException("图片格式转换失败：" + e.getMessage());
        }
    }

    @Override
    public List<FileInfo> convertFormats(String[] fileIds, String targetFormat, int quality) {
        List<FileInfo> results = new ArrayList<>();
        for (String fileId : fileIds) {
            try {
                String filePath = fileStorageService.getFilePath(fileId);
                if (StrUtil.isBlank(filePath)) {
                    log.warn("文件不存在：{}", fileId);
                    continue;
                }
                File sourceFile = new File(filePath);
                if (!sourceFile.exists()) {
                    log.warn("文件不存在：{}", filePath);
                    continue;
                }
                FileInfo fileInfo = convertFormat(sourceFile, targetFormat, quality);
                results.add(fileInfo);
            } catch (Exception e) {
                log.error("转换文件 {} 失败：{}", fileId, e.getMessage());
            }
        }
        return results;
    }

    /**
     * 根据扩展名获取ContentType
     */
    private String getContentType(String extension) {
        return switch (extension.toLowerCase()) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "bmp" -> "image/bmp";
            default -> "application/octet-stream";
        };
    }
}
