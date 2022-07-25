import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Category } from './track.dto';

export class GetTracksGenresDto {
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    visible?: boolean;
}

export type TrackGenresResponse = {
    [key: Category['value']]: {
        id: number;
        name: string;
        value: string;
        countTracks: number;
    }[];
};
