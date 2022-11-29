import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export type UploadFile = {
    originalName?: string;
    name?: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
};

export type UploadedFile = {
    id: number;
    name: string;
    url: string;
    size: number;
    mimetype: string;
    duration?: number;
};

export class TrackFileDto {
    @IsFile()
    @MaxFileSize(1e9)
    @HasMimeType(['audio/mpeg'], { message: 'File extension not allowed. Allowed types: .mp3' })
    file: UploadFile;
}
