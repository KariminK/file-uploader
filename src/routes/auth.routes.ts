import { Router } from "express";
import { upload } from "../models/File";
import { checkSchema } from "express-validator";
import { registerUserSchema, logInUserSchema } from "../validations";
import passport from "passport";
import { checkValidationResult } from "../helpers/checkValidationResult";
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.use(upload.none());

authRouter.get("/log-in", authController.getLogInForm);

authRouter.get("/sign-in", authController.getSignInForm);

authRouter.post(
  "/sign-in",
  checkSchema(registerUserSchema, ["body"]),
  checkValidationResult("forms/sign-in"),
  authController.registerUser,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/sign-in",
    failureMessage: "Failed to register",
  }),
);

authRouter.post(
  "/log-in",
  checkSchema(logInUserSchema, ["body"]),
  checkValidationResult("forms/log-in"),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
    failureMessage: "Failed to log-in",
  }),
);

export default authRouter;
