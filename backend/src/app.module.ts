import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { CategoriesModule } from './categories/categories.module';
import { TracksModule } from './tracks/tracks.module';
import { TrackRatingsModule } from './trackRatings/trackRatings.module';
import { TelegramModule } from './telegram/telegram.module';
import { FilesModule } from './files/files.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(),
        UsersModule,
        AuthModule,
        GenresModule,
        CategoriesModule,
        TracksModule,
        TrackRatingsModule,
        TelegramModule,
        FilesModule,
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
