import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PromisePool } from '@supercharge/promise-pool';
import axios from 'axios';
import JSZip from 'jszip';
import { snakeCase } from 'lodash';
import { Repository } from 'typeorm';

import { SuccessDto } from '../authentication/auth/dtos/success';
import { envConfig } from '../lib/configs/envs';
import { TrackEntity } from '../tracks/track.entity';

import { CreateZipStatusDto, DownloadAllDto } from './dtos/download-all.dto';
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

    async getAllTracks(visible: boolean): Promise<TrackEntity[]> {
        const query = this.tracksRepo.createQueryBuilder('tracks').leftJoinAndSelect('tracks.file', 'file');

        if (visible !== undefined) {
            query.where('visible = :visible', { visible: !!visible });
        }

        return query.getMany();
    }

    async fillZip(allTracks: TrackEntity[], zip: JSZip) {
        await PromisePool.withConcurrency(20)
            .for(allTracks)
            .process(async (track: TrackEntity) => {
                const { data: trackData } = await axios({
                    url: track.file.url,
                    method: 'GET',
                    responseType: 'arraybuffer',
                });
                zip.file(`${track.file.name}-${new Date().getTime()}`, trackData);
            });
    }

    async createRecord() {
        const createZipData = this.zipStatusRepo.create({ isFinished: false, pathToFile: '' });
        return this.zipStatusRepo.save(createZipData);
    }

    async createZip({ visible }: DownloadAllDto): Promise<CreateZipStatusDto> {
        const statusRecord = await this.createRecord();
        const zip = new JSZip();
        this.getAllTracks(visible)
            .then((allTracks) => this.fillZip(allTracks, zip))
            .then(() => zip.generateAsync({ type: 'nodebuffer' }))
            .then((zipContent) => {
                return this.spacesService.uploadZip({
                    buffer: zipContent,
                    originalName: 'tracks',
                } as UploadFile);
            })
            .then(async (fileInfo) => {
                const record = await this.zipStatusRepo.findOneBy({ id: statusRecord.id });
                record.pathToFile = fileInfo.url;
                record.isFinished = true;
                await this.zipStatusRepo.save(record);
            })
            .catch((err: any) => {
                this.zipStatusRepo.remove(statusRecord);
                throw err;
            });

        return statusRecord;
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
