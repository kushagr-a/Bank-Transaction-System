import { MongoClient, Db } from "mongodb"

import { config } from "../utils/config/config";
import logger from "../loggers/wistonLogger";
import { EDBName } from "./collectionSchema";

const client = new MongoClient(config.mongoUri);

let databases: Map<EDBName, Db> = new Map();

export const connectDB = async () => {
    try {
        // Connect to MongoDB
        await client.connect()

        logger.info("Connected to database successfully");

        // Select database
        // db = client.db(); // auto pic from db name in .env

        // Load all databases from enum
        (Object.values(EDBName) as unknown as EDBName[]).forEach((dbName) => {
            const dbInstance = client.db(dbName as string);
            databases.set(dbName, dbInstance);
        });
        // Optional: listen for close/error
        client.on("close", () => {
            logger.error("MongoDB connection closed");
        });

        client.on("error", (error) => {
            logger.error(`MongoDB connection error: ${error.message}`);
            process.exit(1);
        });

    } catch (error: any) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

// Close database connection
export const closeDB = async () => {
    try {
        await client.close();
        logger.info("MongoDB connection closed gracefully");
    } catch (error: any) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

// Get database instance
export const getDB = (dbName: EDBName): Db => {
    const dbInstance = databases.get(dbName);
    if (!dbInstance) {
        throw new Error(`Database "${dbName}" not found`);
    }
    return dbInstance;
}
