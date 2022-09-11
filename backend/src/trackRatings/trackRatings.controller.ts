import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { differenceInDays } from 'date-fns';

import { averageRating } from '../lib/utils/rating';
import { TracksService } from '../tracks/tracks.service';

import { AddTrackRatingDto } from './dtos/add-trackRating.dto';
import { AddTrackRatingControllerResponseDto } from './dtos/add-trackRating-response.dto';
import { TrackRatingDto } from './dtos/trackRating.dto';
import { TrackRatingEntity } from './trackRating.entity';
import { TrackRatingsService } from './trackRatings.service';

@ApiTags('TrackRatings')
@Controller('trackRatings')
export class TrackRatingsController {
    constructor(private trackRatingService: TrackRatingsService, private tracksService: TracksService) {}

    @Post('/add')
    @ApiOperation({ summary: 'Create new trackRating' })
    @ApiResponse({ status: 201, type: TrackRatingDto })
    async add(@Body() body: AddTrackRatingDto, @Session() session: any): Promise<AddTrackRatingControllerResponseDto> {
        const addedRating = await this.trackRatingService.add(body);
        const trackRatings = await this.trackRatingService.getByTrackId(body.trackId);
        const ratings = trackRatings.map((tr) => tr.rating);
        const rating = averageRating(ratings);

        await this.tracksService.update(body.trackId, { rating, countRatings: ratings.length });

        session.ratings = {
            ...session.ratings,
            [body.trackId]: {
                isDidRating: true,
                ratingDate: Date.now(),
            },
        };
        return { ...addedRating, isDidRating: session.ratings[body.trackId].isDidRating };
    }

    @Get('/:trackId')
    @ApiOperation({ summary: 'Get trackRating by id' })
    @ApiResponse({ status: 200, type: TrackRatingDto })
    async getByTrackId(
        @Param('trackId') trackId: number,
        @Session() session: any,
    ): Promise<(TrackRatingEntity & { isDidRating: boolean })[]> {
        const trackRatings = await this.trackRatingService.getByTrackId(trackId);
        return trackRatings.map((trackRating) => {
            const days = differenceInDays(session?.ratings?.[trackRating.track.id]?.ratingDate, Date.now());
            return {
                ...trackRating,
                isDidRating: days < 1,
            };
        });
    }
}
