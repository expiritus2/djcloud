import multer from 'multer';
import fs from 'fs';
import { FileExtensionEnum } from '../../configs/app/tracks';
import path from 'path';
import { ForbiddenException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `./upload/${process.env.NODE_ENV}`;
        fs.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        cb(null, `${uuid()}.${extension}`);
    },
});

export const fileFilter = (
    req: any,
    file: { originalname: string },
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    const acceptableExtensions = Object.values(FileExtensionEnum);
    const fileExtension = path.extname(file.originalname) as FileExtensionEnum;

    if (!acceptableExtensions.includes(fileExtension)) {
        return callback(
            new ForbiddenException(`File extension not allowed. Allowed types: ${acceptableExtensions}`),
            false,
        );
    }
    return callback(null, true);
};
