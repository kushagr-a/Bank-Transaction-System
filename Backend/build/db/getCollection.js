"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = void 0;
const db_1 = require("./db");
const getCollection = async (collection, db) => {
    const database = (0, db_1.getDB)(db);
    return database.collection(collection);
};
exports.getCollection = getCollection;
