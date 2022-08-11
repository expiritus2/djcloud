import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from '../tracks/track.entity';
import { Repository } from 'typeorm';
import { filterTracks } from '../tracks/queries/filter';
import { GetAllDto } from '../tracks/dtos/get-all.dto';
import { SuccessDto } from '../authentication/auth/dtos/success';

@Injectable()
export class StatsService {
    constructor(@InjectRepository(TrackEntity) private trackRepo: Repository<TrackEntity>) {}

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

    async addCountListen(trackId: number): Promise<SuccessDto> {
        console.log(trackId);
        return { success: true };
    }
}
