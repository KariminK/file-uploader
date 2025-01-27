import { RequestHandler } from "express";

import prisma from "../db/prisma";
import bcrypt from "bcryptjs";

const registerUser: RequestHandler = async (req, res, next) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...newUserData } = req.body;

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
    if (existingUser) {
      return res.status(400).render("forms/sign-in", {
        errors: { msg: "Email or username is already in use." },
      });
    }

    const { password, ...userPayload } = newUserData;
    const hashedPassword = await bcrypt.hash(password, 15);

    await prisma.user.create({
      data: {
        password: hashedPassword,
        ...userPayload,
      },
    });

    next();
  } catch (error) {
    return next(error);
  }
};

const getLogInForm: RequestHandler = (req, res) => {
  res.render("forms/log-in");
};

const getSignInForm: RequestHandler = (req, res) => {
  res.render("forms/sign-in");
};

const logOutUser: RequestHandler = (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }

    res.redirect("/");
  });
};

export default { registerUser, getLogInForm, getSignInForm, logOutUser };
