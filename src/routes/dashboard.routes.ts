import { Router } from "express";
import { dashboardController } from "../controllers";

const dashboardRouter = Router();

dashboardRouter.get("/", dashboardController.getRootFolder);

export default dashboardRouter;
