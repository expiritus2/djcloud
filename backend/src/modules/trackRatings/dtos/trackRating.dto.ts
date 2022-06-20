import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TrackRatingDto {
    @Expose()
    @ApiProperty({ example: 1 })
    id: number;

    @Expose()
    @ApiProperty()
    trackId: number;

    @Expose()
    @ApiProperty()
    rating: number;
}
