import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class File {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  mimetype: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  size: number;

  @IsString()
  @ApiProperty()
  url: string;
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

export class SendTrackToTelegramDto {
  @IsNumber()
  @ApiProperty()
  trackId: number;
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
  @IsBoolean()
  @ApiProperty()
  sentToTelegram?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  archive?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  duration?: number;

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

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  rating?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  countRatings?: number;
}

export class ArchiveTrackDto {
  @IsBoolean()
  @ApiProperty()
  archive?: boolean;
}
