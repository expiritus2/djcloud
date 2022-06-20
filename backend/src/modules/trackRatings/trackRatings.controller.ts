import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackRatingDto } from './dtos/trackRating.dto';
import { TrackRatingsService } from './trackRatings.service';
import { AddTrackRatingDto } from './dtos/add-trackRating.dto';
import { TrackRatingEntity } from './trackRating.entity';

@ApiTags('TrackRatings')
@Controller('trackRatings')
export class TrackRatingsController {
    constructor(private trackRatingService: TrackRatingsService) {}

    @Post('/add')
    @ApiOperation({ summary: 'Create new trackRating' })
    @ApiResponse({ status: 201, type: TrackRatingDto })
    async add(@Body() body: AddTrackRatingDto): Promise<TrackRatingEntity> {
        return this.trackRatingService.add(body);
    }

    @Get('/:trackId')
    @ApiOperation({ summary: 'Get trackRating by id' })
    @ApiResponse({ status: 200, type: TrackRatingDto })
    async getByTrackId(@Param('trackId') trackId: number): Promise<TrackRatingEntity[]> {
        return this.trackRatingService.getByTrackId(trackId);
    }
}
