import { RequestHandler } from "express";
import prisma from "../../db/prisma";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const newUserData = req.body;
    delete newUserData.confirmPassword;
    await prisma.user.create({ data: newUserData });
    next();
  } catch (error) {
    return next(error);
  }
};
