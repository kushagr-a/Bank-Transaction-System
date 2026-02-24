import { WithId } from "mongodb";
import { IUser } from "../features/auth/userModel";

declare global {
    namespace Express {
        interface Request {
            user?: WithId<IUser>;
        }
    }
}
