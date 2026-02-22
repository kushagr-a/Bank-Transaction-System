"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = exports.closeDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../utils/config/config");
const wistonLogger_1 = __importDefault(require("../loggers/wistonLogger"));
const collectionSchema_1 = require("./collectionSchema");
const client = new mongodb_1.MongoClient(config_1.config.mongoUri);
let databases = new Map();
const connectDB = async () => {
    try {
        // Connect to MongoDB
        await client.connect();
        wistonLogger_1.default.info("Connected to database successfully");
        // Select database
        // db = client.db(); // auto pic from db name in .env
        // Load all databases from enum
        Object.values(collectionSchema_1.EDBName).forEach((dbName) => {
            const dbInstance = client.db(dbName);
            databases.set(dbName, dbInstance);
        });
        // Optional: listen for close/error
        client.on("close", () => {
            wistonLogger_1.default.error("MongoDB connection closed");
        });
        client.on("error", (error) => {
            wistonLogger_1.default.error(`MongoDB connection error: ${error.message}`);
            process.exit(1);
        });
    }
    catch (error) {
        wistonLogger_1.default.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Close database connection
const closeDB = async () => {
    try {
        await client.close();
        wistonLogger_1.default.info("MongoDB connection closed gracefully");
    }
    catch (error) {
        wistonLogger_1.default.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};
exports.closeDB = closeDB;
// Get database instance
const getDB = (dbName) => {
    const dbInstance = databases.get(dbName);
    if (!dbInstance) {
        throw new Error(`Database "${dbName}" not found`);
    }
    return dbInstance;
};
exports.getDB = getDB;
