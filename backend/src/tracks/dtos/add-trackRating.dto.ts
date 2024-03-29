import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddTrackRatingDto {
  @IsNumber()
  @ApiProperty()
  trackId: number;

  @IsNumber()
  @ApiProperty()
  rating: number;
}
