import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTrackRatingDto } from './dtos/add-trackRating.dto';
import { TrackRatingEntity } from './trackRating.entity';
import { TrackEntity } from '../tracks/track.entity';

@Injectable()
export class TrackRatingsService {
    constructor(
        @InjectRepository(TrackRatingEntity) private trackRatingRepo: Repository<TrackRatingEntity>,
        @InjectRepository(TrackEntity) private tracksRepo: Repository<TrackEntity>,
    ) {}

    async add(trackRating: AddTrackRatingDto): Promise<TrackRatingEntity> {
        const track = await this.tracksRepo.findOne({ where: { id: trackRating.trackId } });
        const newTrackRating = this.trackRatingRepo.create({ track, rating: trackRating.rating });
        return this.trackRatingRepo.save(newTrackRating);
    }

    async getByTrackId(trackId: string | number): Promise<TrackRatingEntity[]> {
        return this.trackRatingRepo
            .createQueryBuilder('trackRatings')
            .leftJoinAndSelect('trackRatings.track', 'track')
            .where('trackRatings.trackId = :trackId', { trackId })
            .getMany();
    }
}
