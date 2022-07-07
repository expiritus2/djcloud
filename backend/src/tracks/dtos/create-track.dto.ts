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
    size: number;

    @IsString()
    @ApiProperty()
    @IsOptional()
    url?: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    data?: string;
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
