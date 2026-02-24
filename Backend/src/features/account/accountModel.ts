import { ObjectId } from "mongodb";

export interface IAccount {
    _id?: ObjectId;
    userId: ObjectId;
    accountNumber: string;
    accountType: EAccountType;
    balance: number;
    status: EAccountStatus;
    currency: ECurrency;
    createdAt: Date;
    updatedAt: Date;
}

export enum EAccountType {
    SAVINGS = "savings",
    CURRENT = "current",
}

export enum EAccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    CLOSED = "closed",
    FROZEN = "frozen",
}

export enum ECurrency {
    PKR = "pkr",
    USD = "usd",
    EUR = "eur",
    GBP = "gbp",
    JPY = "jpy",
    CNY = "cny",
    INR = "inr",
    AED = "aed",
    SAR = "sar",
    QAR = "qar",
    BHD = "bhd",
    KWD = "kwd",
    OMR = "omr",
}