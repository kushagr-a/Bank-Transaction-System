import { Document } from "mongodb";
import { ECollectionName, EDBName } from "./collectionSchema";
import { getDB } from "./db";

export const getCollection = async <T extends Document>(
    collection: ECollectionName,
    db: EDBName | string
) => {
    const database = getDB(db as EDBName);
    return database.collection<T>(collection);
};