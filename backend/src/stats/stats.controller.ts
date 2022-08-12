import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackDto } from '../tracks/dtos/track.dto';
import { StatsService } from './stats.service';
import { TrackStatsDto } from './dtos/track-stats.dto';
import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { ListenStatsEntity } from './listenStats.entity';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @Get('/tracks')
    @ApiOperation({ summary: 'Get stats about tracks' })
    @ApiResponse({ status: 200, type: TrackDto })
    async getStats(query: GetAllDto): Promise<TrackStatsDto> {
        const totalDuration = await this.statsService.getTracksTotalDuration(query);
        return { totalDuration };
    }

    @Post('/track/:trackId/listen')
    @ApiOperation({ summary: 'Add count listen' })
    @ApiResponse({ status: 200, type: TrackDto })
    async addCountListen(@Param('trackId') trackId: number): Promise<ListenStatsEntity> {
        return this.statsService.addCountListen(trackId);
    }
}
