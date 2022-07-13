import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../lib/guards/adminGuard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { TrackFileDto, UploadedFile } from './dtos/track-file.dto';
import { FilesService } from './files.service';
import { FileEntity } from './file.entity';

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
    @ApiResponse({ status: 201 })
    @FormDataRequest()
    async fileRemove(@Body() id: number): Promise<FileEntity> {
        return this.filesService.removeFile(id);
    }
}
