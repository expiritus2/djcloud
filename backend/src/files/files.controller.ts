import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { SuccessDto } from '../authentication/auth/dtos/success';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';

import { CreateZipStatusDto, DownloadAllDto, RemoveZipDto } from './dtos/download-all.dto';
import { TrackFileDto, UploadedFile } from './dtos/track-file.dto';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';
import { CreateZipStatusEntity } from './createZipStatus.entity';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

    @UseGuards(AdminGuard)
    @Post('/file-upload')
    @ApiOperation({ summary: 'Upload file' })
    @ApiResponse({ status: 201 })
    @FormDataRequest()
    async fileUpload(@Body() { file }: TrackFileDto): Promise<UploadedFile> {
        return this.filesService.storeFile(file);
    }

    @UseGuards(AdminGuard)
    @Post('/file-remove')
    @ApiOperation({ summary: 'Delete file' })
    @FormDataRequest()
    async fileRemove(@Body() { id }: { id: number }): Promise<FileEntity> {
        return this.filesService.removeFile(id);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get file' })
    async getFileById(@Param('id') id: number): Promise<FileEntity> {
        return this.filesService.getFileById(id);
    }

    @Post('/create-zip')
    @ApiOperation({ summary: 'Download all tracks' })
    async createZip(@Body() options: DownloadAllDto): Promise<CreateZipStatusDto> {
        return this.filesService.createZip(options);
    }

    @Post('/remove-zip')
    @ApiOperation({ summary: 'Download all tracks' })
    async removeZip(@Body() { id, url }: RemoveZipDto): Promise<SuccessDto> {
        return this.filesService.removeZip(id, url);
    }

    @Get('/check-zip-status/:id')
    @ApiOperation({ summary: 'Checks if creation of zip finished' })
    async checkZipStatus(@Param('id') id: number): Promise<CreateZipStatusEntity> {
        return this.filesService.checkZipStatus({ id });
    }
}
