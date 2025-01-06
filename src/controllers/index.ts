import { Router } from "express";
import authController from "./auth.controller";
import folderController from "./folder.controller";
import prisma from "../db/prisma";
import "../types/global";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  if (!req.user) return res.render("index");

  const folders = await prisma.folder.findMany({
    where: { ownerId: req.user.id, parentFolderId: null },
  });

  res.render("dashboard", { user: req.user, folders, parentName: "root" });
});
indexRouter.use("/user", authController);
indexRouter.use("/folder", folderController);

export default indexRouter;
