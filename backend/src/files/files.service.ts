import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PromisePool } from '@supercharge/promise-pool';
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';
import JSZip from 'jszip';
import { snakeCase } from 'lodash';
import { Repository } from 'typeorm';

import { SuccessDto } from '../authentication/auth/dtos/success';
import { envConfig } from '../lib/configs/envs';
import { TrackEntity } from '../tracks/track.entity';

import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { CreateZipStatusEntity } from './createZipStatus.entity';
import { FileEntity } from './file.entity';
import { SpacesService } from './spaces.service';

@Injectable()
export class FilesService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(FileEntity) private fileRepo: Repository<FileEntity>,
        @InjectRepository(CreateZipStatusEntity) private zipStatusRepo: Repository<CreateZipStatusEntity>,
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
            mimetype: file.mimetype,
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

    async fillZip(allTracks: TrackEntity[], zip: JSZip, statusRecord: CreateZipStatusEntity) {
        let throttleSaveProgressTime = Date.now();
        await PromisePool.withConcurrency(20)
            .for(allTracks)
            .onTaskFinished(async (track, pool) => {
                const processedPercentage = pool.processedPercentage();
                const now = Date.now();

                if (differenceInSeconds(now, throttleSaveProgressTime) >= 1) {
                    await this.zipStatusRepo.update(statusRecord.id, { progress: processedPercentage });
                    throttleSaveProgressTime = now;
                }
            })
            .process(async (track: TrackEntity) => {
                const { data: trackData } = await axios.get(track.file.url, { responseType: 'arraybuffer' });
                zip.file(`${track.file.name}`, trackData);
            });
    }

    async createRecord(): Promise<CreateZipStatusEntity> {
        const createZipData = this.zipStatusRepo.create({ isFinished: false, pathToFile: '' });
        return this.zipStatusRepo.save(createZipData);
    }

    async uploadZipToStorage(zipContent: Buffer, statusRecord: CreateZipStatusEntity) {
        return this.spacesService.uploadZip(
            {
                buffer: zipContent,
                originalName: 'tracks',
            } as UploadFile,
            statusRecord,
        );
    }

    async updateRecord(id: number, fileInfo: { url: string }) {
        await this.zipStatusRepo.update(id, { pathToFile: fileInfo.url, isFinished: true, progress: 100 });
    }

    async setZeroFile(id: number) {
        await this.zipStatusRepo.update(id, { countFiles: 0, isFinished: true, progress: 0, pathToFile: '' });
    }

    async createZip(tracks: TrackEntity[], statusRecord: CreateZipStatusEntity): Promise<void> {
        const zip = new JSZip();
        this.fillZip(tracks, zip, statusRecord)
            .then(() => zip.generateAsync({ type: 'nodebuffer' }))
            .then((zipContent) => this.uploadZipToStorage(zipContent, statusRecord))
            .then((fileInfo) => this.updateRecord(statusRecord.id, fileInfo))
            .catch((err: any) => {
                this.zipStatusRepo.remove(statusRecord);
                throw err;
            });
    }

    async removeZip(id: number, url: string): Promise<SuccessDto> {
        const key = url.replace(`${envConfig.cdn}/`, '');
        await this.spacesService.deleteObject(key);
        await this.zipStatusRepo.delete({ id });

        return { success: true };
    }

    async checkZipStatus({ id }: { id: number }): Promise<CreateZipStatusEntity> {
        return this.zipStatusRepo.findOneBy({ id });
    }
}
