import { Router } from "express";
import userRouter from "./features/auth/userRoutes";
import accountRouter from "./features/account/accountRoutes";

const apiRoutes = Router();

//  Auth controller
apiRoutes.use("/auth", userRouter)

//  Account controller
apiRoutes.use("/account", accountRouter)

export default apiRoutes;
