"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const wistonLogger_1 = __importDefault(require("./wistonLogger"));
// Create separate stream object
const stream = {
    write: (message) => {
        wistonLogger_1.default.http(message.trim());
    },
};
const format = ":remote-addr :method :url :status :res[content-length] - :response-time ms";
const morganLogger = (0, morgan_1.default)(format, { stream });
exports.default = morganLogger;
