import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';

import { TrackFileDto, UploadedFile } from './dtos/track-file.dto';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';

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
}
