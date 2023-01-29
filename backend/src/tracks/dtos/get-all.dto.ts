import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../lib/common/dtos';

export class GetAllDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    categoryId?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    genreId?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    visible?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false, default: false })
    @Type(() => Boolean)
    archive?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    shuffle?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    withStats?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    isDisablePagination?: boolean;
}
