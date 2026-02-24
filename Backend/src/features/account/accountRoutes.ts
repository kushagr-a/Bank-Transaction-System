import { Router } from "express";
import { createAccount } from "./accountController";
import { verifyJwt } from "../auth/verifyCrlt";

const accountRouter = Router();

accountRouter.route("/createAccount").post(verifyJwt, createAccount)

accountRouter.route("/").get()

accountRouter.route("/").get()

accountRouter.route("/").put()

accountRouter.route("/").delete()

export default accountRouter;
