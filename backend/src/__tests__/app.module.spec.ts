import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UsersModule } from '../modules/users/users.module';
import { AuthModule } from '../modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

describe('AppModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        expect(module).toBeDefined();
        expect(module.get(UsersModule)).toBeInstanceOf(UsersModule);
        expect(module.get(AuthModule)).toBeInstanceOf(AuthModule);
        expect(module.get(TypeOrmModule)).toBeInstanceOf(TypeOrmModule);
        expect(module.get(ConfigModule)).toBeInstanceOf(ConfigModule);
    });
});
