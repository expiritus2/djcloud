import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';

import { SuccessDto } from '../authentication/auth/dtos/success';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { TracksService } from '../tracks/tracks.service';

import { CreateZipStatusDto, RemoveZipDto } from './dtos/download-all.dto';
import { TrackFileDto, UploadedFile } from './dtos/track-file.dto';
import { CreateZipStatusEntity } from './createZipStatus.entity';
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

    @Get('/create/zip')
    @ApiOperation({ summary: 'Create zip and download it' })
    @ApiResponse({ status: 200 })
    async createZip(@Query() query: GetAllDto): Promise<CreateZipStatusDto> {
        const statusRecord = await this.filesService.createRecord();
        this.tracksService.getAll({ ...query, isDisablePagination: true }).then(async ({ data: tracks }) => {
            if (tracks.length) {
                try {
                    await this.filesService.createZip(tracks, statusRecord);
                } catch (err: any) {
                    const record = await this.filesService.getStatusRecordById(statusRecord.id);
                    await this.filesService.removeZip(record.id, record.pathToFile);
                }
            } else {
                await this.filesService.setZeroFile(statusRecord.id);
            }
        });
        return statusRecord;
    }

    @Post('/remove/zip')
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
