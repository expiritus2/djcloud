import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGenreDto {
  @IsString()
  @ApiProperty()
  name: string;
}
