import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TrackStatsDto {
    @Expose()
    @ApiProperty()
    totalDuration: number;

    @Expose()
    @ApiProperty()
    totalFilesSize: number;
}
