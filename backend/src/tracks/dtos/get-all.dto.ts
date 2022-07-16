import { PaginationQueryDto } from '../../lib/common/dtos';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAllDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    category?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    genre?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    @Type(() => Boolean)
    visible?: string;
}
