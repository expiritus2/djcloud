import { CurrentUserMiddleware } from '../current-user';
import { UsersService } from '../../../users/users.service';
import { cloneDeep } from 'lodash';

describe('CurrentUser middleware', () => {
    const req = {
        session: {
            userId: 1,
        },
    } as any;
    const res = {} as any;
    const next = jest.fn();

    const fakeUserService = {
        findOne: jest.fn().mockReturnValue({ id: req.session.userId, email: 'asdf@asdf.com' }),
    } as unknown as UsersService;

    it('should return current user', async () => {
        const currentUserMiddleware = new CurrentUserMiddleware(fakeUserService);
        const reqCopy = cloneDeep(req);
        await currentUserMiddleware.use(reqCopy, res, next);

        expect(reqCopy.currentUser).toEqual({ id: 1, email: 'asdf@asdf.com' });
        expect(next).toBeCalled();
    });

    it('should not return current user if it is not exists in session', async () => {
        const currentUserMiddleware = new CurrentUserMiddleware(fakeUserService);
        const reqCopy = cloneDeep(req);
        reqCopy.session.userId = null;
        await currentUserMiddleware.use(reqCopy, res, next);

        expect(reqCopy.currentUser).toBeUndefined();
        expect(next).toBeCalled();
    });
});
