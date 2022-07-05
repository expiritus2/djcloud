import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrackRatingDto } from './dtos/trackRating.dto';
import { TrackRatingsService } from './trackRatings.service';
import { AddTrackRatingDto } from './dtos/add-trackRating.dto';
import { TrackRatingEntity } from './trackRating.entity';
import { AddTrackRatingResponseDto } from './dtos/add-trackRating-response.dto';

@ApiTags('TrackRatings')
@Controller('trackRatings')
export class TrackRatingsController {
    constructor(private trackRatingService: TrackRatingsService) {}

    @Post('/add')
    @ApiOperation({ summary: 'Create new trackRating' })
    @ApiResponse({ status: 201, type: TrackRatingDto })
    async add(@Body() body: AddTrackRatingDto, @Req() req: any): Promise<AddTrackRatingResponseDto> {
        return this.trackRatingService.add(body, req.ip);
    }

    @Get('/:trackId')
    @ApiOperation({ summary: 'Get trackRating by id' })
    @ApiResponse({ status: 200, type: TrackRatingDto })
    async getByTrackId(@Param('trackId') trackId: number): Promise<TrackRatingEntity[]> {
        return this.trackRatingService.getByTrackId(trackId);
    }
}
