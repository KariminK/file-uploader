import { Router } from "express";
import authController from "./auth/auth.controller";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index");
});
indexRouter.use("/user", authController);

export default indexRouter;
