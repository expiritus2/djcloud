import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GenresModule } from './modules/genres/genres.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload', process.env.NODE_ENV),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    GenresModule,
    CategoriesModule,
    TracksModule,
  ],
  providers: [],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
