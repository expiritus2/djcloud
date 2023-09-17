export type File = {
    id?: string;
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
    id: string;
    trackId: string;
    listenCount: number;
};

export type Track = {
    id: string;
    title: string;
    visible: boolean;
    archive: boolean;
    sentToTelegram: boolean;
    duration: number;
    file: File;
    category: Category;
    genre: Genre;
    createdAt: number;
    updatedAt: string;
    listenStats: ListenStats;
} & TrackRating;

export type TrackStats = {
    totalDuration?: number;
    totalFilesSize?: number;
};
