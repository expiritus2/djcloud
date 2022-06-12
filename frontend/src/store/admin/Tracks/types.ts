type File = {
    id: number;
};

type Category = {
    id: number;
};

type Genre = {
    id: number;
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
