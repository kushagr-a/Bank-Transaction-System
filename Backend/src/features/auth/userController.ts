import { Request, Response } from "express";
import argon2 from "argon2";

import logger from "../../loggers/wistonLogger";
import { ECollectionName, EDBName } from "../../db/collectionSchema";
import { IUser } from "./userModel";
import { getCollection } from "../../db/getCollection";
import { genrateToken } from "../../utils/jwt/jwtHelper";
import { config } from "../../utils/config/config";
import { sendRegistrationEmail } from "../../utils/service/emailService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Register User
export const registerUser = async (req: Request, res: Response) => {
    try {
        let { email, password, name, username } = req.body;

        // Normalize
        email = email?.toLowerCase().trim()
        username = username?.toLowerCase().trim()

        // validate request body
        if (!email || !password || !name || !username) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format kindly used valid email like example@gmail.com"
            })
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            })
        }

        // check if user already exists
        const userColl = await getCollection<IUser>(
            ECollectionName.USERS,
            EDBName.BANK
        )

        const userExists = await userColl.findOne({
            $or: [
                { email },
                { username }
            ]
        })

        // check if user already exists
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // hash password
        const hashedPassword = await argon2.hash(password)

        // create new user
        const newUser = {
            email,
            password: hashedPassword,
            name,
            username,
            // role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await userColl.insertOne(newUser)

        // generate token
        const token = await genrateToken({
            userId: result.insertedId,
        })

        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })

        // remove password safely
        const { password: _password, ...safeUser } = newUser

        // Send email in background (don't await)
        await sendRegistrationEmail(newUser.email, newUser.name)
            .catch((err) => {
                logger.error("Email sending failed: " + err.message)
            })

        // return response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: result.insertedId,
                ...safeUser,
                accessToken: token,
            }
        })



    } catch (error: any) {

        // Duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email or Username already exists"
            });
        }

        logger.error(`Error in registerUser: ${error.message}`)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Login User
export const loginUser = async (req: Request, res: Response) => {
    try {
        let { identifier, password } = req.body

        //normalize
        identifier = identifier?.toLowerCase().trim()

        // validate request body
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Username and password are required"
            })
        }

        // check if user exists
        const userColl = await getCollection<IUser>(
            ECollectionName.USERS,
            EDBName.BANK
        )

        // find user
        const userExists = await userColl.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        })

        // check if user exists
        if (!userExists) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        // check password
        const isPasswordValid = await argon2.verify(
            userExists.password,
            password
        )

        // check if password is valid
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        // generate token
        const token = await genrateToken({
            userId: userExists._id,
        })

        // set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.nodeEnv === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })

        // remove password safely
        const { password: _password, ...safeUser } = userExists

        // return response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                ...safeUser,
                accessToken: token,
            }
        })

    } catch (error: any) {
        logger.error(`Error in loginUser: ${error.message}`)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}