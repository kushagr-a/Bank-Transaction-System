import { getCollection } from "./getCollection";
import { ECollectionName, EDBName } from "./collectionSchema";
import { IUser } from "../features/auth/userModel";
import { IAccount } from "../features/account/accountModel";
import { ITransaction } from "../features/transactions/transactionModel";
import { ILedger } from "../features/ledger/ledger";
import logger from "../loggers/wistonLogger";

export const ensureIndexes = async () => {
    // USER COLLECTION
    const userColl = await getCollection<IUser>(
        ECollectionName.USERS,
        EDBName.BANK
    );

    await userColl.createIndex({ email: 1 }, { unique: true });
    await userColl.createIndex({ username: 1 }, { unique: true });

    // ACCOUNT COLLECTION
    const accountColl = await getCollection<IAccount>(
        ECollectionName.ACCOUNTS,
        EDBName.BANK
    );

    await accountColl.createIndex({ userId: 1 });
    await accountColl.createIndex({ userId: 1, status: 1 });

    // TRANSACTION COLLECTION 
    const transcationColl = await getCollection<ITransaction>(
        ECollectionName.TRANSACTIONS,
        EDBName.BANK
    );

    await transcationColl.createIndex({ fromAccount: 1 })
    await transcationColl.createIndex({ toAccount: 1 })
    await transcationColl.createIndex({ fromAccount: 1, toAccount: 1 })
    await transcationColl.createIndex({ idempotencyKey: 1 }, { unique: true });

    // LEDGER COLLECTION
    const ledgerColl = await getCollection<ILedger>(
        ECollectionName.LEDGER,
        EDBName.BANK
    );

    await ledgerColl.createIndex({ account: 1 });
    await ledgerColl.createIndex({ transaction: 1 });
    await ledgerColl.createIndex({ account: 1, createdAt: -1 });
    await ledgerColl.createIndex({ transaction: 1, createdAt: -1 });
    await ledgerColl.createIndex({ account: 1, transaction: 1 });

    logger.info("All indexes ensured successfully");
};