import dotenv from "dotenv";
dotenv.config({ quiet: true });

const _config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGODB_URI || "",
    jwtSecret: process.env.JWT_SECRET || "",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    emailUser: process.env.EMAIL_USER || "",
    clientId: process.env.CLIENT_ID || "",
    clientSecret: process.env.CLIENT_SECRET || "",
    refreshToken: process.env.REFRESH_TOKEN || "",
}

export const config = Object.freeze(_config);
