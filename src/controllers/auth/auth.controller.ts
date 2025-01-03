import { Router } from "express";
import { checkSchema } from "express-validator";
import prisma from "../../db/prisma";
import { checkValidationResult } from "../../helpers/checkValidationResult";
import { registerUserSchema } from "../../validations/userValidation";
import { registerUser } from "./auth.service";
import passport from "passport";

const authController = Router();

authController.get("/log-in", (req, res) => {
  res.render("forms/log-in");
});

authController.get("/sign-in", (req, res) => {
  res.render("forms/sign-in");
});

authController.post(
  "/sign-in",
  checkSchema(registerUserSchema, ["body"]),
  checkValidationResult("sign-in"),
  registerUser,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
    failureMessage: "Failed to register",
  })
);

export default authController;
