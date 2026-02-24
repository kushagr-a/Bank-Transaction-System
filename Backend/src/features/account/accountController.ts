import { Request, Response } from "express";
import { getCollection } from "../../db/getCollection";
import { IAccount, EAccountStatus, ECurrency } from "./accountModel";
import { ECollectionName, EDBName } from "../../db/collectionSchema";
import logger from "../../loggers/wistonLogger";
import { generateAccountNumber } from "../../utils/service/accountNumber";

export const createAccount = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        if (!user || !user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated"
            });
        }

        const accountColl = await getCollection<IAccount>(
            ECollectionName.ACCOUNTS,
            EDBName.BANK
        );

        const { accountType, currency } = req.body;

        // Check if user already has an account 
        const existingAccount = await accountColl.findOne({
            userId: user._id
        })

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: "User already has an account",
                data: {
                    account: existingAccount
                }
            });
        }
        const generatedAccNumber = generateAccountNumber();

        const accountData: IAccount = {
            userId: user._id,
            accountNumber: generatedAccNumber,
            accountType,
            balance: 0,
            status: EAccountStatus.ACTIVE,
            currency: currency || ECurrency.INR,
            createdAt: new Date(),
            updatedAt: new Date()
        }


        const result = await accountColl.insertOne(accountData);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                _id: result.insertedId,
                ...accountData
            }
        });

    } catch (error: any) {
        logger.error(`Error in createAccount: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}