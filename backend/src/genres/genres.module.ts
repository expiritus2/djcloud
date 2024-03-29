import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenreEntity } from './genre.entity';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  providers: [GenresService],
  controllers: [GenresController],
})
export class GenresModule {}
