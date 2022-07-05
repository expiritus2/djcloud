import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTrackRatingDto } from './dtos/add-trackRating.dto';
import { TrackRatingEntity } from './trackRating.entity';
import { TrackEntity } from '../tracks/track.entity';
import { mean, round } from 'lodash';
import { AddTrackRatingResponseDto } from './dtos/add-trackRating-response.dto';

@Injectable()
export class TrackRatingsService {
    constructor(
        @InjectRepository(TrackRatingEntity) private trackRatingRepo: Repository<TrackRatingEntity>,
        @InjectRepository(TrackEntity) private tracksRepo: Repository<TrackEntity>,
    ) {}

    async add(trackRating: AddTrackRatingDto, ip: string): Promise<AddTrackRatingResponseDto> {
        const track = await this.tracksRepo.findOne({ where: { id: trackRating.trackId } });
        const newTrackRating = this.trackRatingRepo.create({ track, rating: trackRating.rating, ipAddress: ip });
        await this.trackRatingRepo.save(newTrackRating);

        const trackRatings = await this.trackRatingRepo
            .createQueryBuilder('trackRatings')
            .where('trackRatings.trackId = :trackId', { trackId: trackRating.trackId })
            .getMany();
        const isDidRating = trackRatings.some((rating) => rating.ipAddress === ip);
        const ratings = trackRatings.map((tr) => tr.rating);
        const rating = round(mean(ratings.length ? ratings : [0]));

        return { isDidRating, rating, trackId: trackRating.trackId, countRatings: trackRatings.length };
    }

    async getByTrackId(trackId: string | number): Promise<TrackRatingEntity[]> {
        return this.trackRatingRepo
            .createQueryBuilder('trackRatings')
            .leftJoinAndSelect('trackRatings.track', 'track')
            .where('trackRatings.trackId = :trackId', { trackId })
            .getMany();
    }
}
