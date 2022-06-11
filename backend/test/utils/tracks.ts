import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import path from 'path';
import { TrackDto } from '../../src/modules/tracks/dtos/track.dto';

const pathToMP3File = path.resolve(__dirname, '..', 'data', 'files', 'Kamera-ExtendedMix.mp3');

export const createTrack = async (app: INestApplication, adminCookie: any): Promise<TrackDto> => {
    const { body: trackFile } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToMP3File).expect(201);

    const { body: genres } = await request(app.getHttpServer()).get('/genres/list').set('Cookie', adminCookie).expect(200);

    const { body: categories } = await request(app.getHttpServer()).get('/categories/list').set('Cookie', adminCookie).expect(200);

    const { body } = await request(app.getHttpServer())
        .post('/tracks/create')
        .set('Cookie', adminCookie)
        .send({
            title: 'New Track Title',
            visible: true,
            duration: trackFile.duration,
            file: trackFile,
            category: { id: categories.data[0].id },
            genre: { id: genres.data[0].id },
        })
        .expect(201);

    return body;
};

export const fileUpload = async (app: INestApplication, adminCookie: string) => {
    const { body } = await request(app.getHttpServer()).post('/tracks/file-upload').set('Cookie', adminCookie).attach('file', pathToMP3File).expect(201);

    return body;
};
