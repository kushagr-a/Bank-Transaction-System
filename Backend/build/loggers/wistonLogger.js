"use strict";
// import winston from "winston";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     debug: 4,
// };
// const getLevel = () => {
//     const env = process.env.NODE_ENV || "development";
//     switch (env) {
//         case "production":
//             return "info";
//         case "testing":
//             return "warn";
//         default:
//             return "debug";
//     }
// };
// winston.addColors({
//     error: "red",
//     warn: "yellow",
//     info: "blue",
//     http: "white",
//     debug: "white",
// });
// const logger = winston.createLogger({
//     level: getLevel(),
//     levels,
//     transports: [
//         new winston.transports.Console({
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.colorize({ all: true }),
//                 winston.format.printf(
//                     (info) => `${info.timestamp} [${info.level}]: ${info.message}`
//                 )
//             ),
//         }),
//     ],
//     exitOnError: false,
// });
// export default logger;
const winston_1 = __importDefault(require("winston"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const getLevel = () => {
    const env = process.env.NODE_ENV || "development";
    return env === "production" ? "info" : "debug";
};
winston_1.default.addColors({
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    debug: "white",
});
const format = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`));
const logger = winston_1.default.createLogger({
    level: getLevel(),
    levels,
    format,
    transports: [
        // ✅ Console
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), format),
        }),
        // ❌ Error logs only
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        // ✅ All logs
        new winston_1.default.transports.File({
            filename: "logs/combined.log",
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
