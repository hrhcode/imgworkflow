package com.imgworkflow.provider;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.ZipUtil;
import com.imgworkflow.common.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * 文件下载控制器
 * 
 * @author imgworkflow
 */
@Slf4j
@RestController
@RequestMapping("/download")
public class DownloadController {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    /**
     * 下载单个文件
     * @param fileId 文件ID
     * @return 文件资源
     */
    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        log.info("开始下载文件：{}", fileId);

        File file = findFileById(fileId);
        if (file == null) {
            throw new BusinessException("文件不存在");
        }

        Resource resource = new FileSystemResource(file);
        String filename = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    /**
     * 批量下载文件（打包为ZIP）
     * @param fileIds 文件ID列表
     * @return ZIP文件资源
     */
    @PostMapping("/batch")
    public ResponseEntity<Resource> downloadBatch(@RequestBody String[] fileIds) {
        log.info("开始批量下载文件，数量：{}", fileIds.length);

        List<File> files = new ArrayList<>();
        for (String fileId : fileIds) {
            File file = findFileById(fileId);
            if (file != null) {
                files.add(file);
            }
        }

        if (files.isEmpty()) {
            throw new BusinessException("没有可下载的文件");
        }

        String zipFileName = "images_" + IdUtil.fastSimpleUUID() + ".zip";
        String zipFilePath = uploadPath + File.separator + "temp" + File.separator + zipFileName;

        File tempDir = new File(uploadPath + File.separator + "temp");
        if (!tempDir.exists()) {
            tempDir.mkdirs();
        }

        File zipFile = ZipUtil.zip(zipFilePath, false, files.toArray(new File[0]));

        Resource resource = new FileSystemResource(zipFile);
        String filename = URLEncoder.encode(zipFileName, StandardCharsets.UTF_8);

        log.info("批量下载打包完成：{}", zipFilePath);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    /**
     * 根据文件ID查找文件
     */
    private File findFileById(String fileId) {
        File uploadDir = new File(uploadPath);
        return findFileInDir(uploadDir, fileId);
    }

    /**
     * 递归查找文件
     */
    private File findFileInDir(File dir, String fileId) {
        if (!dir.exists() || !dir.isDirectory()) {
            return null;
        }

        File[] files = dir.listFiles();
        if (files == null) {
            return null;
        }

        for (File file : files) {
            if (file.isDirectory()) {
                File found = findFileInDir(file, fileId);
                if (found != null) {
                    return found;
                }
            } else {
                String name = file.getName();
                if (name.startsWith(fileId + ".")) {
                    return file;
                }
            }
        }

        return null;
    }
}
