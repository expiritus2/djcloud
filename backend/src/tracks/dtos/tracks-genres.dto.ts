import { GenreDto } from '../../genres/dtos/genre.dto';

export class TracksGenresDto {
    grouped: { [key: string]: number };
    genres: GenreDto[];
}
