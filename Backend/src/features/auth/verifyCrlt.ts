import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import logger from "../../loggers/wistonLogger";
import { config } from "../../utils/config/config";
import { getCollection } from "../../db/getCollection";
import { IUser } from "./userModel";
import { ECollectionName, EDBName } from "../../db/collectionSchema";

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token ||
            req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const decodedToken = jwt.verify(token, config.jwtSecret) as { userId: string }

        const userColl = await getCollection<IUser>(
            ECollectionName.USERS,
            EDBName.BANK
        )

        const currentUser = await userColl.findOne(
            {
                _id: new ObjectId(decodedToken.userId)
            }

        )

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "The user belonging to this token no longer exists",
            })
        }

        (req as any).user = currentUser
        next()

    } catch (error: any) {

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            })
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }

        logger.error(`Error in verifyJwt: ${error.message}`)

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });

    }
}