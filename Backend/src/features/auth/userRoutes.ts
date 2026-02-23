import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser
} from "./userController";

import { verifyJwt } from "./verifyCrlt";

const authRouter = Router()

authRouter.route("/register").post(registerUser)
authRouter.route("/login").post(loginUser)
authRouter.route("/logout").post(verifyJwt, logoutUser)

export default authRouter