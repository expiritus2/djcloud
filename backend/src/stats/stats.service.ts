import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from '../tracks/track.entity';
import { Repository } from 'typeorm';
import { TrackStatsDto } from './dtos/track-stats.dto';
import { filterTracks } from '../tracks/queries/filter';
import { GetAllDto } from '../tracks/dtos/get-all.dto';

@Injectable()
export class StatsService {
    constructor(@InjectRepository(TrackEntity) private trackRepo: Repository<TrackEntity>) {}

    async getTrackStats(query: GetAllDto): Promise<TrackStatsDto> {
        const searchFieldName = { searchFieldName: 'title' };
        const queryBuilder = this.trackRepo
            .createQueryBuilder('track')
            .select('SUM(track.duration)', 'totalDuration')
            .leftJoinAndSelect('track.category', 'category')
            .leftJoinAndSelect('track.genre', 'genre');

        const result = await filterTracks<TrackEntity>(queryBuilder, query, searchFieldName)
            .groupBy('category.id')
            .addGroupBy('genre.id')
            .getRawMany();

        const totalDuration = result.reduce((acc, item) => acc + item.totalDuration, 0);

        return { totalDuration };
    }
}
