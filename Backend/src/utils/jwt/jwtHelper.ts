import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

export const genrateToken = async (payload: any) => {
    return jwt.sign(
        payload,
        config.jwtSecret,
        {
            expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
        }
    ) as string;
};