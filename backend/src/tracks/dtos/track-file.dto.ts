import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export type UploadedFile = {
    originalName?: string;
    name?: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
};

export class TrackFileDto {
    @IsFile()
    @MaxFileSize(1e9)
    @HasMimeType(['audio/mpeg', 'audio/wav'])
    file: UploadedFile;
}
