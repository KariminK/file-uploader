import { Router } from "express";
import authController from "./auth.controller";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  if (req.user) res.render("dashboard", { user: req.user });
  else res.render("index");
});
indexRouter.use("/user", authController);

export default indexRouter;
