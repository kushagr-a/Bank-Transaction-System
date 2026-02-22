export interface IUser {
    email: string;
    password: string;
    name: string;
    username: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}