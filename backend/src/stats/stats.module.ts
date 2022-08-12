import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from '../tracks/track.entity';
import { ListenStatsEntity } from './listenStats.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TrackEntity, ListenStatsEntity])],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService],
})
export class StatsModule {}
