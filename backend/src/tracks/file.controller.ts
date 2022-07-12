import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../lib/guards/adminGuard';
import { TracksService } from './tracks.service';
import { FormDataRequest } from 'nestjs-form-data';
import { TrackFileDto } from './dtos/track-file.dto';

@ApiTags('Files')
@Controller('files')
export class FileController {
    constructor(private tracksService: TracksService) {}

    @UseGuards(AdminGuard)
    @Post('/file-upload')
    @ApiOperation({ summary: 'Upload file' })
    @ApiResponse({ status: 201 })
    @FormDataRequest()
    async fileUpload(@Body() { file }: TrackFileDto) {
        return this.tracksService.storeFile(file);
    }
}
