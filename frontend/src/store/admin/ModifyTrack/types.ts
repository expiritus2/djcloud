export type CreateTrackDto = {
    name: string;
};

export type UpdateTrackDto = {
    id: number;
    name: string;
};

export type GetTrackDto = {
    id: number;
};

export type RemoveTrackDto = {
    id: number;
};
