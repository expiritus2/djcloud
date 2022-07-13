import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { UploadedFile, UploadFile } from './dtos/track-file.dto';
import { v4 as uuid } from 'uuid';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { envConfig } from '../lib/configs/envs';
import { FileEntity } from './file.entity';
import logger from '../lib/common/logger';

@Injectable()
export class SpacesService {
    s3: AWS.S3;
    credentials: AWS.Credentials = new AWS.Credentials({
        accessKeyId: this.configService.get('DO_ACCESS_KEY'),
        secretAccessKey: this.configService.get('DO_SECRET_KEY'),
    });

    constructor(private configService: ConfigService) {
        const spaceEndpoint = new AWS.Endpoint('fra1.digitaloceanspaces.com');
        this.s3 = new AWS.S3({ endpoint: spaceEndpoint.href });

        this.s3.config.credentials = this.credentials;
    }

    putObject(file: UploadFile): Promise<UploadedFile> {
        const filename = `${uuid()}-${file.originalName}`;
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: `${this.configService.get('NODE_ENV')}/${filename}`,
            Body: file.buffer,
            ACL: 'public-read',
        };
        return new Promise((resolve, reject) => {
            this.s3.putObject(config, async (error: AWS.AWSError) => {
                if (!error) {
                    const pathToFile = `${envConfig.cdn}/${this.configService.get('NODE_ENV')}/${filename}`;
                    const duration = await getAudioDurationInSeconds(pathToFile);
                    const fileInfo = {
                        name: filename,
                        url: pathToFile,
                        size: file.size,
                        mimetype: file.mimetype,
                    };
                    resolve({
                        ...fileInfo,
                        duration,
                    });
                } else {
                    reject(
                        new InternalServerErrorException(
                            `DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`,
                        ),
                    );
                }
            });
        });
    }

    async deleteObject(file: FileEntity) {
        const config = {
            Bucket: this.configService.get('DO_BUCKET_NAME'),
            Key: `${this.configService.get('NODE_ENV')}/${file.name}`,
        };
        this.s3.deleteObject(config, (error: AWS.AWSError) => {
            if (!error) {
                return logger.log(`File with ${file.id} was deleted successfully`);
            }
            throw new InternalServerErrorException(`Can not delete file with id: ${file.id}`);
        });
    }
}
