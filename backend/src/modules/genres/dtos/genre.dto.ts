import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
    @Expose()
    @ApiProperty({ example: 1 })
    id: number;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty()
    value: string;
}
