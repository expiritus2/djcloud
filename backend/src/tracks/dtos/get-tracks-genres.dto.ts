import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetTracksGenresDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    category?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    visible?: boolean;
}
