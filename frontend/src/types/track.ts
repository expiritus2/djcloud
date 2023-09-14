export type File = {
    id?: number;
    mimetype: string;
    duration: number;
    name: string;
    size: number;
    url?: string;
    data?: string;
};

export type Category = {
    id: string;
    value: string;
    name: string;
};

export type Genre = {
    id: string;
    value: string;
    name: string;
};

export type TrackRating = {
    rating: number;
    isDidRating: boolean;
    countRatings: number;
};

export type ListenStats = {
    id: number;
    trackId: number;
    listenCount: number;
};

export type Track = {
    id: number;
    title: string;
    visible: boolean;
    archive: boolean;
    sentToTelegram: boolean;
    duration: number;
    file: File;
    category: Category;
    genre: Genre;
    createdAt: string;
    updatedAt: string;
    listenStats: ListenStats;
} & TrackRating;

export type TrackStats = {
    totalDuration?: number;
    totalFilesSize?: number;
};
