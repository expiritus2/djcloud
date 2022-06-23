import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddTrackRatingDto {
    @IsNumber()
    @ApiProperty()
    trackId: number;

    @IsNumber()
    @ApiProperty()
    rating: number;
}
