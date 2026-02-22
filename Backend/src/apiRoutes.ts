    import { Router } from "express";
    import userRouter from "./features/auth/userRoutes";

    const apiRoutes = Router();

    //  Auth controller
    apiRoutes.use("/auth", userRouter)

    export default apiRoutes;
