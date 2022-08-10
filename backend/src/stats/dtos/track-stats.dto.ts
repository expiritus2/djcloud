import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TrackStatsDto {
    @Expose()
    @ApiProperty()
    totalDuration: number;
}
