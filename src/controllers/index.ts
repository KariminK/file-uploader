import { Router } from "express";
import authController from "./auth.controller";
import folderController from "./folder.controller";
import prisma from "../db/prisma";
import "../types";
import errorMiddleware from "../middlewares/errorMiddleware";
import fileController from "./file.controller";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  if (!req.user) return res.render("index");

  const folders = await prisma.folder.findMany({
    where: { ownerId: req.user.id, parentFolderId: null },
  });
  const files = await prisma.file.findMany({
    where: { ownerId: req.user.id, folderId: null },
  });

  res.render("dashboard", {
    user: req.user,
    folders,
    files,
    parentName: "root",
  });
});
indexRouter.use("/user", authController);
indexRouter.use("/folder", folderController);
indexRouter.use("/file", fileController);

indexRouter.use(errorMiddleware);

export default indexRouter;
