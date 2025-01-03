import { RequestHandler } from "express";
import prisma from "../../db/prisma";
import bcrypt from "bcryptjs";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const newUserData = req.body;
    delete newUserData.confirmPassword;
    newUserData.password = await bcrypt.hash(newUserData.password, 15);

    await prisma.user.create({ data: newUserData });
    next();
  } catch (error) {
    return next(error);
  }
};
