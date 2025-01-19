import { Router } from "express";
import { IsAuthorized } from "../middlewares/authMiddleware";
import prisma from "../db/prisma";
import "../types";
import { newFolderData } from "../types";
import { checkValidationResult } from "../helpers/checkValidationResult";
import { validateFolder } from "../validations/folderValidation";
const folderController = Router();

folderController.use(IsAuthorized);
folderController.get("/:parentName/new", (req, res) => {
  const { parentName } = req.params;
  if (!req.user) return res.status(401).redirect("/");
  const parentFolder = prisma.folder.findFirst({
    where: { name: parentName, ownerId: req.user?.id },
  });
  if (!parentFolder)
    return res
      .status(400)
      .render("error", { status: 400, message: "Invalid parent folder name" });
  return res.render("forms/new-folder", { parentName });
});

// TODO: ADD VALIDATION TO NEW FOLDER

folderController.post(
  "/:parentName/new",
  validateFolder,
  checkValidationResult("forms/new-folder"),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const { parentName } = req.params;
      if (!name || !req.user) return res.status(400).redirect("/");

      const folderData: newFolderData = {
        name: name,
        ownerId: req.user.id,
        parentFolderId: null,
      };
      if (parentName !== "root") {
        const parentFolder = await prisma.folder.findFirst({
          where: { name: parentName, ownerId: req.user.id },
        });
        if (!parentFolder) return res.status(400).redirect("/");
        folderData.parentFolderId = parentFolder.id;
      }
      await prisma.folder.create({ data: folderData });
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  }
);

folderController.get("/:name", async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).redirect("/");
    const { name } = req.params;
    const folders = await prisma.folder.findMany({
      where: {
        parentFolder: {
          name: name,
          ownerId: req.user.id,
        },
      },
    });
    const files = await prisma.file.findMany({
      where: {
        folder: { name },
        ownerId: req.user.id,
      },
    });

    return res.render("dashboard", {
      user: req.user,
      folders,
      parentName: name,
      files: files,
    });
  } catch (error) {
    next(error);
  }
});

folderController.get("/:name/delete", async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/");
    const { name } = req.params;
    const folder = await prisma.folder.findFirst({
      where: { name, ownerId: req.user.id },
    });
    if (!folder) return res.redirect("/");

    await prisma.folder.delete({ where: { id: folder.id } });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

export default folderController;
