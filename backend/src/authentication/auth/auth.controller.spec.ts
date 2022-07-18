import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let fakeAuthService: Partial<AuthService>;

    beforeEach(async () => {
        fakeAuthService = {
            signup: (email: string) => {
                return Promise.resolve({ id: 1, email } as UserEntity);
            },
            signin: (email: string) => {
                return Promise.resolve({ id: 1, email } as UserEntity);
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: fakeAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signup', () => {
        it('should return user and set session.userId', async () => {
            const session = { userId: undefined };
            const user = await controller.signup({ email: 'test@email.com', password: 'asdf' }, session);
            expect(user).toEqual({ id: 1, email: 'test@email.com' });
            expect(session.userId).toEqual(1);
        });

        it('should throw error if user already exists', async () => {
            const session = { userId: undefined };
            fakeAuthService.signup = () => {
                throw new BadRequestException('Email in use');
            };

            try {
                await controller.signup({ email: 'test@email.com', password: 'asdf' }, session);
            } catch (error) {
                expect(error instanceof BadRequestException).toBeTruthy();
                expect(error.message).toEqual('Email in use');
                expect(session.userId).not.toBeDefined();
            }
        });
    });

    describe('signin', () => {
        it('should return user and set session.userId', async () => {
            const session = { userId: undefined };
            const user = await controller.signin({ email: 'test@email.com', password: 'asdf' }, session);
            expect(user).toEqual({ id: 1, email: 'test@email.com' });
            expect(session.userId).toEqual(1);
        });

        it('should throw error if user already exists', async () => {
            const session = { userId: undefined };
            fakeAuthService.signin = () => {
                throw new NotFoundException('Email in use');
            };

            try {
                await controller.signin({ email: 'test@email.com', password: 'asdf' }, session);
            } catch (error) {
                expect(error instanceof NotFoundException).toBeTruthy();
                expect(error.message).toEqual('Email in use');
                expect(session.userId).not.toBeDefined();
            }
        });

        describe('whoAmI', () => {
            it('should return user', async () => {
                const user = await controller.whoAmI({ id: 1 } as UserEntity);
                expect(user).toEqual({ id: 1 });
            });
        });

        describe('signout', () => {
            it('should signout', async () => {
                const session = { userId: 1 };
                await controller.signOut(session);
                expect(session.userId).toBeNull();
            });
        });
    });
});
