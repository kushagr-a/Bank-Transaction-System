"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const wistonLogger_1 = __importDefault(require("../../loggers/wistonLogger"));
const collectionSchema_1 = require("../../db/collectionSchema");
const getCollection_1 = require("../../db/getCollection");
const jwtHelper_1 = require("../../utils/jwt/jwtHelper");
const config_1 = require("../../utils/config/config");
const emailService_1 = require("../../utils/service/emailService");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Register User
const registerUser = async (req, res) => {
    try {
        let { email, password, name, username } = req.body;
        // Normalize
        email = email?.toLowerCase().trim();
        username = username?.toLowerCase().trim();
        // validate request body
        if (!email || !password || !name || !username) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format kindly used valid email like example@gmail.com"
            });
        }
        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters"
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }
        // check if user already exists
        const userColl = await (0, getCollection_1.getCollection)(collectionSchema_1.ECollectionName.USERS, collectionSchema_1.EDBName.BANK);
        const userExists = await userColl.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        // check if user already exists
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        // hash password
        const hashedPassword = await argon2_1.default.hash(password);
        // create new user
        const newUser = {
            email,
            password: hashedPassword,
            name,
            username,
            // role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await userColl.insertOne(newUser);
        // generate token
        const token = await (0, jwtHelper_1.genrateToken)({
            userId: result.insertedId,
        });
        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config_1.config.nodeEnv === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
        // remove password safely
        const { password: _password, ...safeUser } = newUser;
        // Send email in background (don't await)
        await (0, emailService_1.sendRegistrationEmail)(newUser.email, newUser.name)
            .catch((err) => {
            wistonLogger_1.default.error("Email sending failed: " + err.message);
        });
        // return response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: result.insertedId,
                ...safeUser,
                accessToken: token,
            }
        });
    }
    catch (error) {
        // Duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email or Username already exists"
            });
        }
        wistonLogger_1.default.error(`Error in registerUser: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.registerUser = registerUser;
// Login User
const loginUser = async (req, res) => {
    try {
        let { identifier, password } = req.body;
        //normalize
        identifier = identifier?.toLowerCase().trim();
        // validate request body
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Username and password are required"
            });
        }
        // check if user exists
        const userColl = await (0, getCollection_1.getCollection)(collectionSchema_1.ECollectionName.USERS, collectionSchema_1.EDBName.BANK);
        // find user
        const userExists = await userColl.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });
        // check if user exists
        if (!userExists) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        // check password
        const isPasswordValid = await argon2_1.default.verify(userExists.password, password);
        // check if password is valid
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        // generate token
        const token = await (0, jwtHelper_1.genrateToken)({
            userId: userExists._id,
        });
        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config_1.config.nodeEnv === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        // remove password safely
        const { password: _password, ...safeUser } = userExists;
        // return response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                ...safeUser,
                accessToken: token,
            }
        });
    }
    catch (error) {
        wistonLogger_1.default.error(`Error in loginUser: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
exports.loginUser = loginUser;
