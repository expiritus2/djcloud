export type Role = {
  name: string;
};

export type User = {
  id: number;
  email: string;
  role: Role;
} | null;

export enum AdminTabsEnum {
  TRACKS = 'tracks',
  GENRES = 'genres',
  CATEGORIES = 'categories',
}
