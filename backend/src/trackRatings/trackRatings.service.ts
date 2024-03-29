import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { averageRating } from '../lib/utils/rating';
import { TrackEntity } from '../tracks/track.entity';

import { AddTrackRatingDto } from './dtos/add-trackRating.dto';
import { AddTrackRatingResponseDto } from './dtos/add-trackRating-response.dto';
import { TrackRatingEntity } from './trackRating.entity';

@Injectable()
export class TrackRatingsService {
  constructor(
    @InjectRepository(TrackRatingEntity) private trackRatingRepo: Repository<TrackRatingEntity>,
    @InjectRepository(TrackEntity) private tracksRepo: Repository<TrackEntity>,
  ) {}

  async add(trackRating: AddTrackRatingDto): Promise<AddTrackRatingResponseDto> {
    const track = await this.tracksRepo.findOne({ where: { id: trackRating.trackId } });
    const newTrackRating = this.trackRatingRepo.create({ track, rating: trackRating.rating });
    await this.trackRatingRepo.save(newTrackRating);

    const trackRatings = await this.trackRatingRepo
      .createQueryBuilder('trackRatings')
      .where('trackRatings.trackId = :trackId', { trackId: trackRating.trackId })
      .getMany();
    const ratings = trackRatings.map((tr) => tr.rating);
    const rating = averageRating(ratings);

    return { rating, trackId: trackRating.trackId, countRatings: trackRatings.length };
  }

  async getByTrackId(trackId: string | number): Promise<TrackRatingEntity[]> {
    return this.trackRatingRepo
      .createQueryBuilder('trackRatings')
      .leftJoinAndSelect('trackRatings.track', 'track')
      .where('trackRatings.trackId = :trackId', { trackId })
      .getMany();
  }
}
