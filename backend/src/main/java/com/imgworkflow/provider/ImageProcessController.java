package com.imgworkflow.provider;

import com.imgworkflow.common.domain.Result;
import com.imgworkflow.domain.dto.CompressRequestDTO;
import com.imgworkflow.domain.dto.UploadResultDTO;
import com.imgworkflow.domain.entity.FileInfo;
import com.imgworkflow.service.ImageProcessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 图片处理控制器
 * 
 * @author imgworkflow
 */
@Slf4j
@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
public class ImageProcessController {

    private final ImageProcessService imageProcessService;

    /**
     * 压缩图片
     * @param request 压缩请求
     * @return 压缩结果
     */
    @PostMapping("/compress")
    public Result<UploadResultDTO> compressImages(@RequestBody CompressRequestDTO request) {
        log.info("开始压缩图片，数量：{}，质量：{}", request.getFileIds().length, request.getQuality());

        List<FileInfo> fileInfos = imageProcessService.compressImages(
                request.getFileIds(),
                request.getQuality(),
                request.getWidth(),
                request.getHeight(),
                request.getKeepAspectRatio()
        );

        UploadResultDTO result = new UploadResultDTO();
        result.setSuccessCount(fileInfos.size());
        result.setFailCount(request.getFileIds().length - fileInfos.size());

        List<UploadResultDTO.FileInfoDTO> fileInfoDTOs = fileInfos.stream()
                .map(info -> {
                    UploadResultDTO.FileInfoDTO dto = new UploadResultDTO.FileInfoDTO();
                    dto.setId(info.getId());
                    dto.setOriginalName(info.getOriginalName());
                    dto.setFileSize(info.getFileSize());
                    dto.setContentType(info.getContentType());
                    dto.setUrl("/uploads/" + info.getId());
                    return dto;
                })
                .collect(Collectors.toList());

        result.setFiles(fileInfoDTOs);

        log.info("图片压缩完成，成功：{}，失败：{}", result.getSuccessCount(), result.getFailCount());
        return Result.success(result);
    }

    /**
     * 转换图片格式
     * @param request 转换请求
     * @return 转换结果
     */
    @PostMapping("/convert")
    public Result<UploadResultDTO> convertFormat(@RequestBody CompressRequestDTO request) {
        log.info("开始转换图片格式，数量：{}，目标格式：{}", request.getFileIds().length, request.getQuality());

        List<FileInfo> fileInfos = imageProcessService.convertFormats(
                request.getFileIds(),
                request.getQuality() != null ? request.getQuality().toString() : "png",
                90
        );

        UploadResultDTO result = new UploadResultDTO();
        result.setSuccessCount(fileInfos.size());
        result.setFailCount(request.getFileIds().length - fileInfos.size());

        List<UploadResultDTO.FileInfoDTO> fileInfoDTOs = fileInfos.stream()
                .map(info -> {
                    UploadResultDTO.FileInfoDTO dto = new UploadResultDTO.FileInfoDTO();
                    dto.setId(info.getId());
                    dto.setOriginalName(info.getOriginalName());
                    dto.setFileSize(info.getFileSize());
                    dto.setContentType(info.getContentType());
                    dto.setUrl("/uploads/" + info.getId());
                    return dto;
                })
                .collect(Collectors.toList());

        result.setFiles(fileInfoDTOs);

        log.info("图片格式转换完成，成功：{}，失败：{}", result.getSuccessCount(), result.getFailCount());
        return Result.success(result);
    }
}
