export type Role = {
    name: string;
};

export type User = {
    id: string;
    email: string;
    role: Role;
} | null;

export type LoginProps = {
    email: string;
    password: string;
};
