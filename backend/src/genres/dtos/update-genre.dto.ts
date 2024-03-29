import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateGenreDto {
  @IsString()
  @ApiProperty()
  name: string;
}
