import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { differenceInDays } from 'date-fns';

import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { FilesService } from '../files/files.service';
import { GenreDto } from '../genres/dtos/genre.dto';
import { envConfig } from '../lib/configs/envs';
import { StatsService } from '../stats/stats.service';
import { TelegramService } from '../telegram/telegram.service';

import { CreateTrackDto } from './dtos/create-track.dto';
import { GetAllDto } from './dtos/get-all.dto';
import { GetAllResponseDto, TrackData } from './dtos/get-all-response.dto';
import { GetTracksGenresDto, TrackGenresResponse } from './dtos/get-tracks-genres.dto';
import { TrackDto } from './dtos/track.dto';
import { TracksGenresDto } from './dtos/tracks-genres.dto';
import { SendTrackToTelegramDto, UpdateTrackDto } from './dtos/update-track.dto';
import { TrackEntity } from './track.entity';
import { TracksService } from './tracks.service';

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
        private statsService: StatsService,
    ) {}

    isDidRating(session: any, trackId: number) {
        const days = differenceInDays(Date.now(), session.ratings?.[trackId]?.ratingDate);
        return days < 1;
    }

    async sendToTelegram(track: TrackEntity) {
        const caption = getCaption(track);
        const link = `${envConfig.frontendDomain}/tracks/${track.category.id}/${track.genre.id}/${track.id}`;
        const tagLink = `<a href="${link}">${link}</a>`;
        await this.telegramService.sendMessage(`${tagLink}\n${caption}`, {
            parse_mode: 'HTML',
        });
    }

    @UseGuards(AdminGuard)
    @Post('/create')
    @ApiOperation({ summary: 'Create new track' })
    @ApiResponse({ status: 201, type: TrackDto })
    async createTrack(@Body() track: CreateTrackDto) {
        const newTrack = await this.tracksService.create(track);
        const env = this.configService.get('ENVIRONMENT');
        if (track.visible && env !== 'test' && env !== 'ci') {
            await this.sendToTelegram(newTrack);
            await this.tracksService.update(newTrack.id, { sentToTelegram: true });
        }
        return newTrack;
    }

    @UseGuards(AdminGuard)
    @Post('/send-to-telegram')
    @ApiOperation({ summary: 'Send track to telegram' })
    @ApiResponse({ status: 200, type: TrackDto })
    async sendTrackToTelegram(@Body() { trackId }: SendTrackToTelegramDto) {
        const storedTrack = await this.tracksService.findOne(trackId);
        const env = this.configService.get('ENVIRONMENT');
        if (env !== 'test' && env !== 'ci') {
            await this.sendToTelegram(storedTrack);
            await this.tracksService.update(storedTrack.id, { sentToTelegram: true });
        }
        return storedTrack;
    }

    @Get('/list')
    @ApiOperation({ summary: 'Get all tracks with pagination' })
    @ApiResponse({ status: 200, type: TrackDto })
    async getAll(@Query() query: GetAllDto, @Session() session: any): Promise<GetAllResponseDto> {
        const tracks = query.shuffle
            ? await this.tracksService.getAllShuffle(query)
            : await this.tracksService.getAll(query);

        let stats = {};

        if (query.withStats) {
            stats = await this.statsService.getTracksStats(query);
        }

        return {
            ...tracks,
            ...stats,
            data: tracks.data.map((track) => {
                return {
                    ...track,
                    isDidRating: this.isDidRating(session, track.id),
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
    async getById(@Param('id') id: string | number, @Session() session: any): Promise<TrackData> {
        const track = await this.tracksService.findOne(id);

        return { ...track, isDidRating: this.isDidRating(session, track.id) };
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    @ApiOperation({ summary: 'Update track by id' })
    @ApiResponse({ status: 200, type: TrackDto })
    async update(@Param('id') id: string | number, @Body() body: UpdateTrackDto): Promise<TrackEntity> {
        const updatedTrack = await this.tracksService.update(id, body);

        if (body.visible && !updatedTrack.sentToTelegram) {
            await this.sendToTelegram(updatedTrack);
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
