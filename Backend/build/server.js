"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const wistonLogger_1 = __importDefault(require("./loggers/wistonLogger"));
const config_1 = require("./utils/config/config");
const db_1 = require("./db/db");
const getCollection_1 = require("./db/getCollection");
const collectionSchema_1 = require("./db/collectionSchema");
const PORT = config_1.config.port;
let server;
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    wistonLogger_1.default.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    wistonLogger_1.default.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
});
// Start  Server Properly 
const startServer = async () => {
    try {
        // console.log("PORT VALUE:", PORT);
        // connect to database
        await (0, db_1.connectDB)();
        // create index
        const userColl = await (0, getCollection_1.getCollection)(collectionSchema_1.ECollectionName.USERS, collectionSchema_1.EDBName.BANK);
        await userColl.createIndex({ email: 1 }, { unique: true });
        await userColl.createIndex({ username: 1 }, { unique: true });
        wistonLogger_1.default.info("User indexes ensured");
        //  Start server
        server = app_1.default.listen(PORT, () => {
            wistonLogger_1.default.info(`Server is running on http://localhost:${PORT}`);
            wistonLogger_1.default.debug(`Environment: ${config_1.config.nodeEnv}`);
        });
    }
    catch (error) {
        wistonLogger_1.default.error(`Server failed to start: ${error.message}`);
        process.exit(1);
    }
};
startServer();
// Graceful shutdown
const gracefulShutdown = async () => {
    wistonLogger_1.default.info("Starting graceful shutdown...");
    // Close the server
    server.close(async () => {
        wistonLogger_1.default.info("HTTP server closed");
        // Close database connection
        await (0, db_1.closeDB)();
        wistonLogger_1.default.info("Graceful shutdown completed");
        process.exit(0);
    });
    // Force shutdown after timeout
    setTimeout(() => {
        wistonLogger_1.default.error("Forcing shutdown after timeout");
        process.exit(1);
    }, 10000);
};
// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
