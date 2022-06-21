export type File = {
    id: number;
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
    createdAt: number;
    updatedAt: number;
};
