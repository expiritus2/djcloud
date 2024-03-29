export type CreateCategoryDto = {
  name: string;
};

export type UpdateCategoryDto = {
  id: number;
  name: string;
};

export type GetCategoryDto = {
  id: number;
};

export type RemoveCategoryDto = {
  id: number;
};
