import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { TrackDto } from './dtos/track.dto';
import { CreateTrackDto } from './dtos/create-track.dto';
import { TrackEntity } from './track.entity';
import { GenreDto } from '../genres/dtos/genre.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { GetAllDto } from './dtos/get-all.dto';
import { GetTracksGenresDto, TrackGenresResponse } from './dtos/get-tracks-genres.dto';
import { TracksGenresDto } from './dtos/tracks-genres.dto';
import { GetAllResponseDto } from './dtos/get-all-response.dto';
import { differenceInDays } from 'date-fns';
import { TelegramService } from '../telegram/telegram.service';
import { FilesService } from '../files/files.service';
import { ConfigService } from '@nestjs/config';

export const getCaption = (track: TrackEntity): string => {
    return `${track.category.name} - ${track.genre.name}`;
};

@ApiTags('Tracks')
@Controller('tracks')
export class TracksController {
    constructor(
        private tracksService: TracksService,
        private telegramService: TelegramService,
        private fileService: FilesService,
        private configService: ConfigService,
    ) {}

    @UseGuards(AdminGuard)
    @Post('/create')
    @ApiOperation({ summary: 'Create new track' })
    @ApiResponse({ status: 201, type: TrackDto })
    async createTrack(@Body() track: CreateTrackDto) {
        const newTrack = await this.tracksService.create(track);
        const fileUrl = `${newTrack.file.url}`;
        const env = this.configService.get('NODE_ENV');
        if (track.visible && env !== 'test' && env !== 'ci') {
            await this.telegramService.sendAudio(fileUrl, {
                caption: getCaption(newTrack),
            });
            await this.tracksService.update(newTrack.id, { sentToTelegram: true });
        }
        return newTrack;
    }

    @Get('/list')
    @ApiOperation({ summary: 'Get all tracks with pagination' })
    @ApiResponse({ status: 200, type: TrackDto })
    async getAll(@Query() query: GetAllDto, @Session() session: any): Promise<GetAllResponseDto> {
        const tracks = await this.tracksService.getAll(query);

        return {
            ...tracks,
            data: tracks.data.map((track) => {
                const days = differenceInDays(Date.now(), session.ratings?.[track.id]?.ratingDate);
                return {
                    ...track,
                    isDidRating: days < 1,
                };
            }),
        };
    }

    @Get('/tracks-genres')
    @ApiOperation({ summary: 'Get tracks genres with count' })
    @ApiResponse({ status: 200, type: TracksGenresDto })
    async getTracksGenres(@Query() query: GetTracksGenresDto): Promise<TrackGenresResponse> {
        return this.tracksService.getTracksGenres(query);
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
        const updatedTrack = await this.tracksService.update(id, body);

        if (body.visible && !updatedTrack.sentToTelegram) {
            await this.telegramService.sendAudio(updatedTrack.file.url, {
                caption: getCaption(updatedTrack),
            });

            return this.tracksService.update(updatedTrack.id, { sentToTelegram: true });
        }

        return updatedTrack;
    }

    @UseGuards(AdminGuard)
    @Delete('/:id')
    @ApiOperation({ summary: 'Remove track' })
    @ApiResponse({ status: 200, type: TrackDto })
    async remove(@Param('id') id: string | number) {
        const track = await this.tracksService.remove(id);
        await this.fileService.removeFile(track.file.id);
        return track;
    }
}
