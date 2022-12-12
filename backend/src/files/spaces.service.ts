import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { v4 as uuid } from 'uuid';

import { envConfig } from '../lib/configs/envs';

import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { CreateZipStatusEntity } from './createZipStatus.entity';

@Injectable()
export class SpacesService {
    spaceEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
    s3: AWS.S3 = new AWS.S3({ endpoint: this.spaceEndpoint.href });
    credentials: AWS.Credentials = new AWS.Credentials({
        accessKeyId: this.configService.get('DO_ACCESS_KEY'),
        secretAccessKey: this.configService.get('DO_SECRET_KEY'),
    });

    constructor(private configService: ConfigService) {
        this.s3.config.credentials = this.credentials;
    }

    getKey(filename: string, isUniquePath = true) {
        if (!isUniquePath) {
            return `${this.configService.get('ENVIRONMENT')}/${filename}`;
        }
        return `${this.configService.get('ENVIRONMENT')}/${uuid()}/${filename}`;
    }

    getBucketConfig(key: string, file: UploadFile) {
        return {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: key,
            Body: file.buffer,
            ACL: 'public-read',
        };
    }

    async uploadZip(
        file: UploadFile,
        statusRecord: CreateZipStatusEntity,
    ): Promise<Omit<UploadedFile, 'id' | 'size' | 'mimetype'>> {
        const key = this.getKey(file.originalName, false);
        const config = this.getBucketConfig(`${key}-${statusRecord.id}.zip`, file);

        await this.s3.putObject(config).promise();
        const pathToFile = `${envConfig.cdn}/${key}-${statusRecord.id}.zip`;
        return { name: file.originalName, url: pathToFile };
    }

    async uploadTrack(file: UploadFile): Promise<Omit<UploadedFile, 'id'>> {
        const key = this.getKey(file.originalName);
        const config = this.getBucketConfig(key, file);

        try {
            await this.s3.putObject(config).promise();
            const pathToFile = `${envConfig.cdn}/${key}`;
            const duration = await getAudioDurationInSeconds(pathToFile);
            const fileInfo = {
                name: file.originalName,
                url: pathToFile,
                size: file.size,
                mimetype: file.mimetype || file.busBoyMimeType,
            };
            return { ...fileInfo, duration };
        } catch (error: any) {
            await this.deleteObject(key);
            throw new InternalServerErrorException(`DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`);
        }
    }

    async deleteObject(key: string) {
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: key,
        };

        try {
            return this.s3.deleteObject(config).promise();
        } catch (error: any) {
            throw new InternalServerErrorException(`Can not delete file with key: ${key}`, error);
        }
    }

    async getObject(key: string) {
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: `${this.configService.get('ENVIRONMENT')}/${key}`,
        };

        try {
            return this.s3.getObject(config).promise();
        } catch (error: any) {
            throw new NotFoundException(`Can not find file with key: ${key}`, error);
        }
    }
}
