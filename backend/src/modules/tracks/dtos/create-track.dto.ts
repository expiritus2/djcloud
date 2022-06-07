import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class File {
  @IsNumber()
  @ApiProperty()
  id: number;
}

class Category {
  @IsNumber()
  @ApiProperty()
  id: number;
}

class Genre {
  @IsNumber()
  @ApiProperty()
  id: number;
}

export class CreateTrackDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsBoolean()
  @ApiProperty()
  visible: boolean;

  @IsNumber()
  @ApiProperty()
  duration: number;

  @ValidateNested()
  @Type(() => File)
  @ApiProperty()
  file: File;

  @ValidateNested()
  @Type(() => Category)
  @ApiProperty()
  category: Category;

  @ValidateNested()
  @Type(() => Genre)
  @ApiProperty()
  genre: Genre;
}
