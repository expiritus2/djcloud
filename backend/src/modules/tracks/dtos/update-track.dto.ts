import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class File {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id: number;
}

class Category {
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  id: number;
}

class Genre {
  @IsNumber()
  @ApiProperty()
  id: number;
}

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  visible?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  likes?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => File)
  @ApiProperty()
  file?: File;

  @IsOptional()
  @ValidateNested()
  @Type(() => Category)
  @ApiProperty()
  category?: Category;

  @IsOptional()
  @ValidateNested()
  @Type(() => Genre)
  @ApiProperty()
  genre?: Genre;
}
