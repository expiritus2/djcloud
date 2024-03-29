import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import dataSource from '../ormconfig';

import { AuthModule } from './authentication/auth/auth.module';
import { UsersModule } from './authentication/users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { GenresModule } from './genres/genres.module';
import { StatsModule } from './stats/stats.module';
import { TelegramModule } from './telegram/telegram.module';
import { TrackRatingsModule } from './trackRatings/trackRatings.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await dataSource.initialize();
        return dataSource.options;
      },
    }),
    UsersModule,
    AuthModule,
    GenresModule,
    CategoriesModule,
    TracksModule,
    TrackRatingsModule,
    TelegramModule,
    FilesModule,
    StatsModule,
  ],
  providers: [],
})
export class AppModule {}
