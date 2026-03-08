package com.imgworkflow.provider;

import com.imgworkflow.common.domain.Result;
import com.imgworkflow.domain.dto.DiagramRenderRequestDTO;
import com.imgworkflow.domain.dto.UploadResultDTO;
import com.imgworkflow.domain.entity.FileInfo;
import com.imgworkflow.service.DiagramRenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 图表渲染控制器
 * 
 * @author imgworkflow
 */
@Slf4j
@RestController
@RequestMapping("/diagram")
@RequiredArgsConstructor
public class DiagramController {

    private final DiagramRenderService diagramRenderService;

    /**
     * 渲染PlantUML图表
     * @param request 渲染请求
     * @return 渲染结果
     */
    @PostMapping("/plantuml")
    public Result<UploadResultDTO.FileInfoDTO> renderPlantUML(@RequestBody DiagramRenderRequestDTO request) {
        log.info("开始渲染PlantUML图表");

        FileInfo fileInfo = diagramRenderService.renderPlantUML(request.getCode(), request.getFormat());

        UploadResultDTO.FileInfoDTO dto = new UploadResultDTO.FileInfoDTO();
        dto.setId(fileInfo.getId());
        dto.setOriginalName(fileInfo.getOriginalName());
        dto.setFileSize(fileInfo.getFileSize());
        dto.setContentType(fileInfo.getContentType());
        dto.setUrl("/uploads/" + fileInfo.getId());

        log.info("PlantUML图表渲染完成：{}", fileInfo.getId());
        return Result.success(dto);
    }

    /**
     * 渲染Mermaid图表
     * @param request 渲染请求
     * @return 渲染结果
     */
    @PostMapping("/mermaid")
    public Result<UploadResultDTO.FileInfoDTO> renderMermaid(@RequestBody DiagramRenderRequestDTO request) {
        log.info("开始渲染Mermaid图表");

        FileInfo fileInfo = diagramRenderService.renderMermaid(request.getCode(), request.getFormat());

        UploadResultDTO.FileInfoDTO dto = new UploadResultDTO.FileInfoDTO();
        dto.setId(fileInfo.getId());
        dto.setOriginalName(fileInfo.getOriginalName());
        dto.setFileSize(fileInfo.getFileSize());
        dto.setContentType(fileInfo.getContentType());
        dto.setUrl("/uploads/" + fileInfo.getId());

        log.info("Mermaid图表渲染完成：{}", fileInfo.getId());
        return Result.success(dto);
    }
}
