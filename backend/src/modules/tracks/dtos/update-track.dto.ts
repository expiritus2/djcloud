import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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
    size: string;

    @IsString()
    @ApiProperty()
    url: string;
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
    @IsString()
    @ApiProperty()
    title: string;

    @IsBoolean()
    @ApiProperty()
    visible: boolean;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    duration?: number;

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
