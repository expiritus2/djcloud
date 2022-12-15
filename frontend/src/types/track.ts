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
    id: number;
    value: string;
    name: string;
};

export type Genre = {
    id: number;
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
