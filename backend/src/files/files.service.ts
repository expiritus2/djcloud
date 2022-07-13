import { Injectable } from '@nestjs/common';
import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { FileEntity } from './file.entity';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpacesService } from './spaces.service';

@Injectable()
export class FilesService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
        private spacesService: SpacesService,
    ) {}

    async storeFile(file: UploadFile): Promise<UploadedFile> {
        const fileInfo = await this.spacesService.putObject(file);
        const newFile = this.fileRepo.create({
            name: fileInfo.name,
            url: fileInfo.url,
            size: file.size,
            mimetype: file.mimetype,
        });
        const createdFile = await this.fileRepo.save(newFile);

        return { ...createdFile, duration: fileInfo.duration };
    }

    async removeFile(id: number): Promise<FileEntity> {
        const file = await this.fileRepo.findOne(id);
        await this.spacesService.deleteObject(file);

        return this.fileRepo.remove(file);
    }
}
