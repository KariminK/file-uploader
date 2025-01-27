import { RequestHandler, Router } from "express";
import { checkSchema } from "express-validator";
import { checkValidationResult } from "../helpers/checkValidationResult";
import {
  logInUserSchema,
  registerUserSchema,
} from "../validations/userValidation";
import passport from "passport";
import prisma from "../db/prisma";
import bcrypt from "bcryptjs";
import { user } from "@prisma/client";
import { upload } from "../models/File";

const authController = Router();

const registerUser: RequestHandler = async (req, res, next) => {
  try {
    // nie ma potrzeby tutaj mutować tego obiektu, można po prostu nie używać tego pola
    const { confirmPassword, ...newUserData } = req.body
    // delete req.body.confirmPassword;
    // const newUserData: user = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: newUserData.email,
          },
          {
            username: newUserData.username,
          },
        ],
      },
    });

    // to co sprawdzasz w tym ifie, sprawdzasz już w sql
    // wystarczy samo sprawdzenie czy baza coś zwróciła
    // if (
    //   existingUser?.email === newUserData.email ||
    //   existingUser?.username === newUserData.username
    // )
    if (existingUser) {
      return res.status(400).render("forms/sign-in", {
        errors: { msg: "Email or username is already in use." },
      });
    }

    // to samo co wyżej, nie ma potrzeby mutować obiektu
    const { password, ...userPayload } = newUserData
    // newUserData.password = await bcrypt.hash(newUserData.password, 15);
    const hashedPassword = await bcrypt.hash(newUserData.password, 15);

    await prisma.user.create({
      data: {
        password: hashedPassword,
        ...userPayload
      }
    });

    next();
  } catch (error) {
    return next(error);
  }
};

authController.use(upload.none());

authController.get("/log-in", (req, res) => {
  res.render("forms/log-in");
});

authController.get("/sign-in", (req, res) => {
  res.render("forms/sign-in");
});

authController.post(
  "/sign-in",
  checkSchema(registerUserSchema, ["body"]),
  checkValidationResult("forms/sign-in"),
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
  checkValidationResult("forms/log-in"),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
    failureMessage: "Failed to log-in",
  })
);

authController.get("/log-out", (req, res, next) => {
  req.logOut(error => {
    if (error) {
      return next(error);
    }

    res.redirect("/");
  });
});

export default authController;
