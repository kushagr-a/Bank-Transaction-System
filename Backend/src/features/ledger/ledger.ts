import { ObjectId } from "mongodb";
import { ETransactionType } from "../transactions/transactionModel";

export interface ILedger {
    _id?: ObjectId;
    account: ObjectId // refer to account collection
    amount: number;
    transaction: ObjectId // connect to transaction collection
    type: ETransactionType;
    createdAt: Date;
}
