import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./utils/config/config";
import apiRoutes from "./apiRoutes";
import morganLogger from "./loggers/morganLogger";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(helmet());
app.use(morganLogger)
app.use(cookieParser())

// CORS Configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)

//Api Routes
app.use("/api", apiRoutes);

app.get("/test", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        environment: config.nodeEnv,
    })
})

// Simple route for checking server status
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        environment: config.nodeEnv,
    })
})

export default app;
