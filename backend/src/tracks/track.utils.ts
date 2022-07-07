import multer from 'multer';
import fs from 'fs';
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
