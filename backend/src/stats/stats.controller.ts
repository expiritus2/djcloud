import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../authentication/lib/guards/adminGuard';
import { TrackDto } from '../tracks/dtos/track.dto';
import { StatsService } from './stats.service';
import { TrackStatsDto } from './dtos/track-stats.dto';
import { GetAllDto } from '../tracks/dtos/get-all.dto';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @UseGuards(AdminGuard)
    @Get('/tracks')
    @ApiOperation({ summary: 'Get stats about tracks' })
    @ApiResponse({ status: 200, type: TrackDto })
    async getStats(query: GetAllDto): Promise<TrackStatsDto> {
        return this.statsService.getTrackStats(query);
    }
}
