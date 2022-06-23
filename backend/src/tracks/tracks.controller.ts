import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../lib/guards/adminGuard';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackDto } from './dtos/track.dto';
import { CreateTrackDto } from './dtos/create-track.dto';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { PaginationQueryDto } from '../lib/common/dtos';
import { TrackEntity } from './track.entity';
import { GenreDto } from '../genres/dtos/genre.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
    constructor(private tracksService: TracksService) {}

    @UseGuards(AdminGuard)
    @Post('/file-upload')
    @ApiOperation({ summary: 'Upload file' })
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true })
    @ApiResponse({ status: 201 })
    @UseInterceptors(FileInterceptor('file'))
    async fileUpload(@UploadedFile() file: Express.Multer.File) {
        return this.tracksService.storeFile(file);
    }

    @UseGuards(AdminGuard)
    @Post('/create')
    @ApiOperation({ summary: 'Create new track' })
    @ApiResponse({ status: 201, type: TrackDto })
    async createTrack(@Body() track: CreateTrackDto) {
        return this.tracksService.create(track);
    }

    @Get('/list')
    @ApiOperation({ summary: 'Get all tracks with pagination' })
    @ApiResponse({ status: 200, type: TrackDto })
    async getAll(@Query() query: PaginationQueryDto): Promise<{ data: TrackEntity[]; count: number }> {
        return this.tracksService.getAll(query);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get track by id' })
    @ApiResponse({ status: 200, type: GenreDto })
    async getById(@Param('id') id: string | number): Promise<TrackEntity> {
        return this.tracksService.findOne(id);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    @ApiOperation({ summary: 'Update track by id' })
    @ApiResponse({ status: 200, type: TrackDto })
    async update(@Param('id') id: string | number, @Body() body: UpdateTrackDto): Promise<TrackEntity> {
        return this.tracksService.update(id, body);
    }

    @UseGuards(AdminGuard)
    @Delete('/:id')
    @ApiOperation({ summary: 'Remove track' })
    @ApiResponse({ status: 200, type: TrackDto })
    async remove(@Param('id') id: string | number) {
        const track = await this.tracksService.remove(id);
        await this.tracksService.removeFile(track.file.id);
        return track;
    }
}
