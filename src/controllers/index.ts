import { Router } from "express";
import userController from "./user/user.controller";

const indexRouter = Router();

indexRouter.use("/user", userController);

export default indexRouter;
