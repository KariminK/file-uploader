import { Router } from "express";
import { checkSchema } from "express-validator";
import { checkValidationResult } from "../../helpers/checkValidationResult";
import {
  logInUserSchema,
  registerUserSchema,
} from "../../validations/userValidation";
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
    failureRedirect: "/user/sign-in",
    failureMessage: "Failed to register",
  })
);

authController.post(
  "/log-in",
  checkSchema(logInUserSchema, ["body"]),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
    failureMessage: "Failed to log-in",
  })
);

authController.get("/log-out", (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default authController;
