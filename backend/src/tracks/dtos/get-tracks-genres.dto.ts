import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Category } from './track.dto';

export enum TrackGenresViewEnum {
    GENRE = 'GENRE',
    DATE = 'DATE',
}

export class GetTracksGenresDto {
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    visible?: boolean;

    @IsOptional()
    @IsEnum(TrackGenresViewEnum)
    @ApiProperty({ required: false })
    view?: TrackGenresViewEnum;
}

export type TrackGenresResponse = {
    [key: Category['value']]: {
        id: number;
        name: string;
        value: string;
        countTracks: number;
    }[];
};
