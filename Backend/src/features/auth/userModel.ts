import { ObjectId } from "mongodb";

export interface IUser {
    _id?: ObjectId;
    email: string;
    password: string;
    name: string;
    username: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}