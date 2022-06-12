export type Category = {
    id: number;
    name: string;
    value: string;
};

export type PaginatedCategories = {
    data: Category[];
    count: number;
};
