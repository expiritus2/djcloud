import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { Category } from './track.dto';

export class GetTracksGenresDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  @Type(() => Boolean)
  visible?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  @Type(() => Boolean)
  archive?: boolean;
}

export type TrackGenresResponse = {
  [key: Category['value']]: {
    id: number;
    name: string;
    value: string;
    countTracks: number;
  }[];
};
