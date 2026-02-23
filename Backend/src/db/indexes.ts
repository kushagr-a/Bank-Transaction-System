import { getCollection } from "./getCollection";
import { ECollectionName, EDBName } from "./collectionSchema";
import { IUser } from "../features/auth/userModel";
import { IAccount } from "../features/account/accountModel";

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

    console.log("All indexes ensured successfully");
};