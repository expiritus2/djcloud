import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { TracksService } from '../tracks/tracks.service';

import { GetStoredFilesResponse } from './dtos/download-all.dto';
import { TrackFileDto, UploadedFile } from './dtos/track-file.dto';
import { FileEntity } from './file.entity';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService, private tracksService: TracksService) {}

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

    @Get('/stored/files')
    @ApiOperation({ summary: 'Return stored files urls' })
    @ApiResponse({ status: 200 })
    async getStoredFiles(@Query() query: GetAllDto): Promise<GetStoredFilesResponse[]> {
        const { data: tracks } = await this.tracksService.getAll({ ...query, isDisablePagination: true });

        return tracks.map((track) => ({ fileUrl: track.file.url, fileName: track.file.name, title: track.title }));
    }
}
