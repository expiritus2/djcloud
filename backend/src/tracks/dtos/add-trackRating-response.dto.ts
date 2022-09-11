import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class AddTrackRatingResponseDto {
    @IsNumber()
    @ApiProperty()
    trackId: number;

    @IsNumber()
    @ApiProperty()
    rating: number;

    @IsNumber()
    @ApiProperty()
    countRatings: number;
}

export class AddTrackRatingControllerResponseDto {
    @IsNumber()
    @ApiProperty()
    trackId: number;

    @IsNumber()
    @ApiProperty()
    rating: number;

    @IsBoolean()
    @ApiProperty()
    isDidRating: boolean;

    @IsNumber()
    @ApiProperty()
    countRatings: number;
}
