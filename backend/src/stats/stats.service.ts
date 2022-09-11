import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { filterTracks } from '../tracks/queries/filter';
import { TrackEntity } from '../tracks/track.entity';

import { ListenStatsEntity } from './listenStats.entity';

@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(TrackEntity) private trackRepo: Repository<TrackEntity>,
        @InjectRepository(ListenStatsEntity) private listenStatsRepo: Repository<ListenStatsEntity>,
    ) {}

    async getTracksTotalDuration(query: GetAllDto): Promise<number> {
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

        return result.reduce((acc, item) => acc + item.totalDuration, 0);
    }

    async addCountListen(trackId: number): Promise<ListenStatsEntity> {
        const storedTrack = await this.trackRepo.findOne({ where: { id: trackId } });
        if (storedTrack) {
            const existingStat = await this.listenStatsRepo.findOne({ where: { trackId: trackId } });
            if (!existingStat) {
                const newStat = this.listenStatsRepo.create({
                    trackId,
                    listenCount: 1,
                });
                return this.listenStatsRepo.save(newStat);
            } else {
                return this.listenStatsRepo.save({
                    ...existingStat,
                    listenCount: existingStat.listenCount + 1,
                });
            }
        }

        return null;
    }
}
