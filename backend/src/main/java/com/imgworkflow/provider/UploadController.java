package com.imgworkflow.provider;

import com.imgworkflow.common.domain.Result;
import com.imgworkflow.domain.dto.UploadResultDTO;
import com.imgworkflow.domain.entity.FileInfo;
import com.imgworkflow.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 文件上传控制器
 * 
 * @author imgworkflow
 */
@Slf4j
@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    /**
     * 批量上传图片
     * @param files 图片文件列表
     * @return 上传结果
     */
    @PostMapping("/images")
    public Result<UploadResultDTO> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        log.info("开始上传图片，数量：{}", files.size());

        List<FileInfo> fileInfos = fileStorageService.storeFiles(files);

        UploadResultDTO result = new UploadResultDTO();
        result.setSuccessCount(fileInfos.size());
        result.setFailCount(files.size() - fileInfos.size());

        List<UploadResultDTO.FileInfoDTO> fileInfoDTOs = fileInfos.stream()
                .map(info -> {
                    UploadResultDTO.FileInfoDTO dto = new UploadResultDTO.FileInfoDTO();
                    dto.setId(info.getId());
                    dto.setOriginalName(info.getOriginalName());
                    dto.setFileSize(info.getFileSize());
                    dto.setContentType(info.getContentType());
                    dto.setUrl(fileStorageService.getFileUrl(info.getId()));
                    return dto;
                })
                .collect(Collectors.toList());

        result.setFiles(fileInfoDTOs);

        log.info("图片上传完成，成功：{}，失败：{}", result.getSuccessCount(), result.getFailCount());
        return Result.success(result);
    }

    /**
     * 单张上传图片
     * @param file 图片文件
     * @return 上传结果
     */
    @PostMapping("/image")
    public Result<UploadResultDTO.FileInfoDTO> uploadImage(@RequestParam("file") MultipartFile file) {
        log.info("开始上传单张图片：{}", file.getOriginalFilename());

        FileInfo fileInfo = fileStorageService.storeFile(file);

        UploadResultDTO.FileInfoDTO dto = new UploadResultDTO.FileInfoDTO();
        dto.setId(fileInfo.getId());
        dto.setOriginalName(fileInfo.getOriginalName());
        dto.setFileSize(fileInfo.getFileSize());
        dto.setContentType(fileInfo.getContentType());
        dto.setUrl(fileStorageService.getFileUrl(fileInfo.getId()));

        return Result.success(dto);
    }
}
