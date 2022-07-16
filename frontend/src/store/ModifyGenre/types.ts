export type CreateGenreDto = {
    name: string;
};

export type UpdateGenreDto = {
    id: number;
    name: string;
};

export type GetGenreDto = {
    id: number;
};

export type RemoveGenreDto = {
    id: number;
};
