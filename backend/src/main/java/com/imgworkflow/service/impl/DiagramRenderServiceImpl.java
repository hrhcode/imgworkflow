package com.imgworkflow.service.impl;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import com.imgworkflow.common.exception.BusinessException;
import com.imgworkflow.domain.entity.FileInfo;
import com.imgworkflow.service.DiagramRenderService;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.plantuml.SourceStringReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 图表渲染服务实现类
 * 
 * @author imgworkflow
 */
@Slf4j
@Service
public class DiagramRenderServiceImpl implements DiagramRenderService {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Override
    public FileInfo renderPlantUML(String code, String format) {
        try {
            String fileId = IdUtil.fastSimpleUUID();
            String extension = format.toLowerCase();
            String storedName = fileId + "." + extension;

            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String dirPath = uploadPath + File.separator + "diagrams" + File.separator + datePath;
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String outputPath = dirPath + File.separator + storedName;

            SourceStringReader reader = new SourceStringReader(code);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            String desc = reader.outputImage(baos);

            if (desc == null) {
                throw new BusinessException("PlantUML渲染失败：无法生成图片");
            }

            try (FileOutputStream fos = new FileOutputStream(outputPath)) {
                fos.write(baos.toByteArray());
            }

            File outputFile = new File(outputPath);
            FileInfo fileInfo = new FileInfo();
            fileInfo.setId(fileId);
            fileInfo.setOriginalName("plantuml-diagram." + extension);
            fileInfo.setStoredName(storedName);
            fileInfo.setFilePath(outputPath);
            fileInfo.setFileSize(outputFile.length());
            fileInfo.setContentType(getContentType(extension));
            fileInfo.setExtension(extension);
            fileInfo.setCreateTime(LocalDateTime.now());

            log.info("PlantUML图表渲染成功：{}", outputPath);
            return fileInfo;
        } catch (Exception e) {
            log.error("PlantUML图表渲染失败：{}", e.getMessage());
            throw new BusinessException("PlantUML渲染失败：" + e.getMessage());
        }
    }

    @Override
    public FileInfo renderMermaid(String code, String format) {
        try {
            String fileId = IdUtil.fastSimpleUUID();
            String extension = format.toLowerCase();
            String storedName = fileId + "." + extension;

            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            String dirPath = uploadPath + File.separator + "diagrams" + File.separator + datePath;
            File dir = new File(dirPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String outputPath = dirPath + File.separator + storedName;

            String mermaidCliPath = System.getenv("MERMAID_CLI_PATH");
            if (mermaidCliPath == null || mermaidCliPath.isEmpty()) {
                mermaidCliPath = "mmdc";
            }

            String tempInputPath = dirPath + File.separator + fileId + ".mmd";
            FileUtil.writeString(code, tempInputPath, StandardCharsets.UTF_8);

            ProcessBuilder pb = new ProcessBuilder(
                    mermaidCliPath,
                    "-i", tempInputPath,
                    "-o", outputPath,
                    "-b", "transparent"
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();
            int exitCode = process.waitFor();

            FileUtil.del(tempInputPath);

            if (exitCode != 0) {
                throw new BusinessException("Mermaid CLI执行失败，请确保已安装mermaid-cli (mmdc)");
            }

            File outputFile = new File(outputPath);
            if (!outputFile.exists()) {
                throw new BusinessException("Mermaid渲染失败：无法生成图片");
            }

            FileInfo fileInfo = new FileInfo();
            fileInfo.setId(fileId);
            fileInfo.setOriginalName("mermaid-diagram." + extension);
            fileInfo.setStoredName(storedName);
            fileInfo.setFilePath(outputPath);
            fileInfo.setFileSize(outputFile.length());
            fileInfo.setContentType(getContentType(extension));
            fileInfo.setExtension(extension);
            fileInfo.setCreateTime(LocalDateTime.now());

            log.info("Mermaid图表渲染成功：{}", outputPath);
            return fileInfo;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Mermaid图表渲染失败：{}", e.getMessage());
            throw new BusinessException("Mermaid渲染失败：" + e.getMessage());
        }
    }

    /**
     * 根据扩展名获取ContentType
     */
    private String getContentType(String extension) {
        return switch (extension.toLowerCase()) {
            case "svg" -> "image/svg+xml";
            case "png" -> "image/png";
            default -> "application/octet-stream";
        };
    }
}
