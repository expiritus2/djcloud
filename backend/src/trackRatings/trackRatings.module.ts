import { Module } from '@nestjs/common';
import { TrackRatingsController } from './trackRatings.controller';
import { TrackRatingsService } from './trackRatings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackRatingEntity } from './trackRating.entity';
import { TrackEntity } from '../tracks/track.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TrackRatingEntity, TrackEntity])],
    providers: [TrackRatingsService],
    controllers: [TrackRatingsController],
})
export class TrackRatingsModule {}
