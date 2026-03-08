package com.imgworkflow.service;

import com.imgworkflow.domain.entity.FileInfo;

import java.io.File;
import java.util.List;

/**
 * 图片处理服务接口
 * 
 * @author imgworkflow
 */
public interface ImageProcessService {

    /**
     * 压缩图片
     * @param sourceFile 源文件
     * @param quality 压缩质量（1-100）
     * @param width 目标宽度
     * @param height 目标高度
     * @param keepAspectRatio 是否保持宽高比
     * @return 压缩后的文件信息
     */
    FileInfo compressImage(File sourceFile, int quality, Integer width, Integer height, boolean keepAspectRatio);

    /**
     * 批量压缩图片
     * @param fileIds 文件ID列表
     * @param quality 压缩质量
     * @param width 目标宽度
     * @param height 目标高度
     * @param keepAspectRatio 是否保持宽高比
     * @return 压缩后的文件信息列表
     */
    List<FileInfo> compressImages(String[] fileIds, int quality, Integer width, Integer height, boolean keepAspectRatio);

    /**
     * 转换图片格式
     * @param sourceFile 源文件
     * @param targetFormat 目标格式
     * @param quality JPG质量（仅JPG格式有效）
     * @return 转换后的文件信息
     */
    FileInfo convertFormat(File sourceFile, String targetFormat, int quality);

    /**
     * 批量转换图片格式
     * @param fileIds 文件ID列表
     * @param targetFormat 目标格式
     * @param quality JPG质量
     * @return 转换后的文件信息列表
     */
    List<FileInfo> convertFormats(String[] fileIds, String targetFormat, int quality);
}
