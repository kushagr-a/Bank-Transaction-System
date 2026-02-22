import app from "./app";
import logger from "./loggers/wistonLogger";
import { config } from "./utils/config/config"
import { connectDB, closeDB } from './db/db'
import { getCollection } from "./db/getCollection";
import { IUser } from "./features/auth/userModel";
import { ECollectionName, EDBName } from "./db/collectionSchema";

const PORT = config.port;

let server: any;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
    process.exit(1);
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
})

// Start  Server Properly 
const startServer = async () => {
    try {
        // console.log("PORT VALUE:", PORT);

        // connect to database
        await connectDB();

        // create index
        const userColl = await getCollection<IUser>(
            ECollectionName.USERS,
            EDBName.BANK
        )

        await userColl.createIndex({ email: 1 }, { unique: true });
        await userColl.createIndex({ username: 1 }, { unique: true });

        logger.info("User indexes ensured");

        //  Start server
        server = app.listen(PORT, () => {
            logger.info(`Server is running on http://localhost:${PORT}`);
            logger.debug(`Environment: ${config.nodeEnv}`);
        });


    } catch (error: any) {
        logger.error(`Server failed to start: ${error.message}`);
        process.exit(1);
    }
};
startServer();

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info("Starting graceful shutdown...");

    // Close the server
    server.close(async () => {
        logger.info("HTTP server closed")

        // Close database connection
        await closeDB();

        logger.info("Graceful shutdown completed");
        process.exit(0);
    })

    // Force shutdown after timeout
    setTimeout(() => {
        logger.error("Forcing shutdown after timeout");
        process.exit(1);
    }, 10000)
}

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

