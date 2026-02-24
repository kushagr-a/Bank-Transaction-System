import { ObjectId } from "mongodb";

export interface ITransaction {
    _id?: ObjectId;
    fromAccount: ObjectId; // connect to account collection
    toAccount: ObjectId; // connect to account collection
    amount: number;
    type: ETransactionType;
    status: ETransactionStatus;
    idempotencyKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum ETransactionType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}

export enum ETransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
}
