"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const authRouter = (0, express_1.Router)();
authRouter.route("/register").post(userController_1.registerUser);
authRouter.route("/login").post(userController_1.loginUser);
exports.default = authRouter;
