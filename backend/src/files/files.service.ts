import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { snakeCase } from 'lodash';
import { Repository } from 'typeorm';

import { envConfig } from '../lib/configs/envs';
import { TrackEntity } from '../tracks/track.entity';

import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { FileEntity } from './file.entity';
import { SpacesService } from './spaces.service';

@Injectable()
export class FilesService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
        @InjectRepository(TrackEntity) private tracksRepo: Repository<TrackEntity>,
        private spacesService: SpacesService,
    ) {}

    async storeFile(file: UploadFile): Promise<UploadedFile> {
        const fileNameArr = file.originalName.split('.');
        const ext = fileNameArr.pop();
        const filename = fileNameArr.join('.');
        file.originalName = `${snakeCase(filename)}.${ext}`;

        const fileInfo = await this.spacesService.uploadTrack(file);
        const newFile = this.fileRepo.create({
            name: fileInfo.name,
            url: fileInfo.url,
            size: file.size,
            mimetype: file.mimetype || file.busBoyMimeType,
        });
        const createdFile = await this.fileRepo.save(newFile);

        return { ...createdFile, duration: fileInfo.duration };
    }

    async getFileById(id: number): Promise<FileEntity> {
        const storedFile = await this.fileRepo.findOne({ where: { id } });
        if (!storedFile) {
            throw new NotFoundException(`File with id: ${id} not found`);
        }

        return storedFile;
    }

    async removeFile(id: number): Promise<FileEntity> {
        const file = await this.getFileById(id);
        const key = file.url.replace(`${envConfig.cdn}/`, '');
        await this.spacesService.deleteObject(key);

        return this.fileRepo.remove(file);
    }
}
