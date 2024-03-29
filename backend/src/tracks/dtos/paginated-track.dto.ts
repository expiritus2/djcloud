import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class File {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  size: number;

  @Expose()
  @ApiProperty()
  mimetype: string;
}

class Category {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  value: string;
}

class Genre {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  value: string;
}

export class TrackDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  visible: boolean;

  @Expose()
  @ApiProperty()
  duration: string;

  @Expose()
  @ApiProperty()
  @Type(() => File)
  file: File;

  @Expose()
  @ApiProperty()
  @Type(() => Category)
  category: Category;

  @Expose()
  @ApiProperty()
  @Type(() => Genre)
  genre: Genre;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
