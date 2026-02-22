"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./utils/config/config");
const apiRoutes_1 = __importDefault(require("./apiRoutes"));
const morganLogger_1 = __importDefault(require("./loggers/morganLogger"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, helmet_1.default)());
app.use(morganLogger_1.default);
app.use((0, cookie_parser_1.default)());
// CORS Configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//Api Routes
app.use("/api", apiRoutes_1.default);
app.get("/test", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        environment: config_1.config.nodeEnv,
    });
});
// Simple route for checking server status
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        environment: config_1.config.nodeEnv,
    });
});
exports.default = app;
