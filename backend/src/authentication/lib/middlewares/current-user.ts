import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { UserEntity } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            currentUser?: UserEntity;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { userId } = req.session || {};

        if (userId) {
            req.currentUser = await this.usersService.findOne(userId);
        }

        next();
    }
}
