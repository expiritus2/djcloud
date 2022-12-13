import { CreateZipStatusEntity } from 'src/files/createZipStatus.entity';
import request from 'supertest';

const sleep = async (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

export const checkZipStatus = async (app, id, timeout = 3000): Promise<CreateZipStatusEntity> => {
    const { body: zipStatus } = await request(app.getHttpServer()).get(`/files/check-zip-status/${id}`).expect(200);

    if (!zipStatus.isFinished) {
        await sleep(timeout);
        return await checkZipStatus(app, id);
    }
    return zipStatus;
};
