import { Router } from "express";

const userController = Router();

userController.get("/log-in", (req, res) => {
  res.render("forms/log-in");
});

userController.get("/sign-in", (req, res) => {
  res.render("forms/sign-in");
});

export default userController;
