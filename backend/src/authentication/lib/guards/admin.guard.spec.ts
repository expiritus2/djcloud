import { ExecutionContext } from '@nestjs/common';
import { mocked } from 'jest-mock';
import { cloneDeep } from 'lodash';

import { UsersService } from '../../users/users.service';

import { AdminGuard } from './adminGuard';

describe('AdminGuard', () => {
    const request = {
        session: { userId: 1 },
        currentUser: null,
    };

    const fakeUserService = {
        findOne: jest.fn().mockReturnValue({
            role: {
                name: 'admin',
            },
        }),
    } as unknown as UsersService;

    const executionContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnThis(),
    } as unknown as ExecutionContext;

    it('should allow activate route', async () => {
        const authGuard = new AdminGuard(fakeUserService);

        const copyRequest = cloneDeep(request);
        mocked(executionContext.switchToHttp().getRequest).mockReturnValueOnce(copyRequest);

        expect(await authGuard.canActivate(executionContext)).toBeTruthy();
    });

    it('should not allow activate route', async () => {
        const authGuard = new AdminGuard(fakeUserService);

        const copyRequest = cloneDeep(request);
        copyRequest.session.userId = null;

        mocked(executionContext.switchToHttp().getRequest).mockReturnValueOnce(copyRequest);

        expect(await authGuard.canActivate(executionContext)).toBeFalsy();
    });
});
