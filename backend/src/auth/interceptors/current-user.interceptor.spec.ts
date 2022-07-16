import { CurrentUserInterceptor } from './current-user.interceptor';
import { UsersService } from '../../users/users.service';
import { ExecutionContext } from '@nestjs/common';
import { mocked } from 'jest-mock';
import { cloneDeep } from 'lodash';

describe('CurrentUserInterceptor', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const fakeUsersService = {
        findOne: jest.fn().mockReturnValueOnce({
            id: 1,
            email: 'asdf@asdf.com',
        }),
    } as unknown as UsersService;

    const interceptor = new CurrentUserInterceptor(fakeUsersService);

    const executionContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnThis(),
    } as unknown as ExecutionContext;

    const callHandler = {
        handle: jest.fn(),
    };

    const request = {
        session: { userId: 1 },
        currentUser: null,
    };

    it('should be defined', () => {
        expect(interceptor).toBeDefined();
    });

    describe('intercept', () => {
        it('should assign current user to the session', async () => {
            const copyRequest = cloneDeep(request);
            mocked(executionContext.switchToHttp().getRequest).mockReturnValueOnce(copyRequest);
            callHandler.handle.mockResolvedValueOnce('next handle');
            const actualValue = await interceptor.intercept(executionContext, callHandler);

            expect(copyRequest.currentUser).toEqual({
                id: 1,
                email: 'asdf@asdf.com',
            });
            expect(actualValue).toBe('next handle');
            expect(callHandler.handle).toBeCalledTimes(1);
        });

        it('should not assign userId to currentUser if userId is not exists in the session', async () => {
            const copyRequest = cloneDeep(request);
            copyRequest.session.userId = null;
            mocked(executionContext.switchToHttp().getRequest).mockReturnValueOnce(copyRequest);

            await interceptor.intercept(executionContext, callHandler);

            expect(copyRequest.currentUser).toBeNull();
            expect(callHandler.handle).toBeCalledTimes(1);
        });

        it('should not assign userId to currentUser if session not exists', async () => {
            const copyRequest = cloneDeep(request);
            copyRequest.session = undefined;
            mocked(executionContext.switchToHttp().getRequest).mockReturnValueOnce(copyRequest);

            await interceptor.intercept(executionContext, callHandler);

            expect(copyRequest.currentUser).toBeNull();
            expect(callHandler.handle).toBeCalledTimes(1);
        });
    });
});
