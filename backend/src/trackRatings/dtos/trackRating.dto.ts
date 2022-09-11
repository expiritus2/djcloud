import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class Track {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    visible: boolean;

    @Expose()
    @ApiProperty()
    duration: number;

    @Expose()
    @ApiProperty()
    createdAt: number;

    @Expose()
    @ApiProperty()
    updatedAt: number;
}

export class TrackRatingDto {
    @Expose()
    @ApiProperty({ example: 1 })
    id: number;

    @Expose()
    @ApiProperty()
    track: Track;

    @Expose()
    @ApiProperty()
    rating: number;
}
