import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateZipStatusDto {
    @IsNumber()
    @ApiProperty()
    id: number;

    @IsBoolean()
    @ApiProperty()
    isFinished: boolean;

    @IsString()
    @ApiProperty()
    pathToFile: string;
}

export class RemoveZipDto {
    @IsNumber()
    @ApiProperty()
    id: number;

    @IsString()
    @ApiProperty()
    url: string;
}
