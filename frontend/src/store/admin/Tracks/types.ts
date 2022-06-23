export type File = {
    id: number;
    mimetype: string;
    duration: number;
    name: string;
    size: number;
    url: string;
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

export type Track = {
    id: number;
    title: string;
    visible: boolean;
    likes: number;
    duration: number;
    file: File;
    category: Category;
    genre: Genre;
    createdAt: string;
    updatedAt: string;
};
