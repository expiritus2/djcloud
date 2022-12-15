import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { TrackDto } from '../tracks/dtos/track.dto';

import { TrackStatsDto } from './dtos/track-stats.dto';
import { ListenStatsEntity } from './listenStats.entity';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @Get('/tracks')
    @ApiOperation({ summary: 'Get stats about tracks' })
    @ApiResponse({ status: 200, type: TrackDto })
    async getStats(query: GetAllDto): Promise<TrackStatsDto> {
        return this.statsService.getTracksStats(query);
    }

    @Post('/track/:trackId/listen')
    @ApiOperation({ summary: 'Add count listen' })
    @ApiResponse({ status: 200, type: TrackDto })
    async addCountListen(@Param('trackId') trackId: number): Promise<ListenStatsEntity> {
        return this.statsService.addCountListen(trackId);
    }
}
