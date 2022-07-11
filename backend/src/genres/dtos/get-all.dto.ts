import { PaginationQueryDto } from '../../lib/common/dtos';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    category?: string;
}
