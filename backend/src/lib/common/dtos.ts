import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortEnum } from './enums';

export class PaginationQueryDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    limit?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    page?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, enum: SortEnum, default: SortEnum.ASC })
    sort?: SortEnum;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    field?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    search?: string;
}
