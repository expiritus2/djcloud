import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '../../lib/common/dtos';

export class GetAllDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    category?: string;
}
