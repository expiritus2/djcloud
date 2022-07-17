import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { v4 as uuid } from 'uuid';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { envConfig } from '../lib/configs/envs';
import { FileEntity } from './file.entity';

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

    async putObject(file: UploadFile): Promise<Omit<UploadedFile, 'id'>> {
        const filename = `${uuid()}-${file.originalName}`;
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: `${this.configService.get('NODE_ENV')}/${filename}`,
            Body: file.buffer,
            ACL: 'public-read',
        };

        try {
            await this.s3.putObject(config).promise();
            const pathToFile = `${envConfig.cdn}/${this.configService.get('NODE_ENV')}/${filename}`;
            const duration = await getAudioDurationInSeconds(pathToFile);
            const fileInfo = {
                name: filename,
                url: pathToFile,
                size: file.size,
                mimetype: file.mimetype,
            };
            return { ...fileInfo, duration };
        } catch (error: any) {
            await this.deleteObject({ name: filename } as FileEntity);
            throw new InternalServerErrorException(`DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`);
        }
    }

    async deleteObject(file: FileEntity) {
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: `${this.configService.get('NODE_ENV')}/${file.name}`,
        };

        try {
            return this.s3.deleteObject(config).promise();
        } catch (error: any) {
            throw new InternalServerErrorException(`Can not delete file with id: ${file.id}`, error);
        }
    }

    async getObject(key: string) {
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: `${this.configService.get('NODE_ENV')}/${key}`,
        };

        try {
            return this.s3.getObject(config).promise();
        } catch (error: any) {
            throw new NotFoundException(`Can not find file with key: ${key}`, error);
        }
    }
}
