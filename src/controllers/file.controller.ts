import { RequestHandler, Router } from "express";
import { IsAuthorized } from "../middlewares/authMiddleware";
import File, { upload } from "../models/File";
import prisma from "../db/prisma";
import { FileData } from "../types";
import { validateFile } from "../validations/fileValidation";

const fileController = Router();

fileController.use(IsAuthorized);

fileController.get("/:parentFolder/upload", (req, res) => {
  const { parentFolder } = req.params;
  res.render("forms/new-file", { parentFolder });
});

const uploadFile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/");
    const { parentFolder } = req.params;
    const file = req.file as Express.Multer.File;
    const uploadInfo = await File.uploadFile(file);

    const newFileData: FileData = {
      name: file.originalname,
      file_url: uploadInfo.url,
      ownerId: req.user.id,
      cloud_id: uploadInfo.public_id,
    };

    if (parentFolder !== "root") {
      const folder = await prisma.folder.findFirst({
        where: { name: parentFolder, ownerId: req.user.id },
      });
      if (folder === null)
        return res
          .status(400)
          .render("error", { status: 400, message: "Folder doesn't exist" });
      newFileData.folderId = folder.id;
    }

    await prisma.file.create({
      data: newFileData,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

fileController.post(
  "/:parentFolder/upload",
  upload.single("file"),
  validateFile,
  uploadFile
);

fileController.get("/:cloud_id/delete", async (req, res) => {
  const { cloud_id } = req.params;
  const file = await prisma.file.findUnique({
    where: { cloud_id, ownerId: req.user?.id },
  });
  if (!file) return res.redirect("/");
  res.render("forms/delete-file", { cloud_id, name: file?.name });
});

fileController.post("/:cloud_id/delete", async (req, res, next) => {
  try {
    const { filename } = req.body;
    const { cloud_id } = req.params;

    const file = await prisma.file.findUnique({
      where: { cloud_id, ownerId: req.user?.id },
    });
    if (!file)
      return res.status(400).render("forms/delete-file", {
        errors: [{ msg: "This file doesn't exist" }],
      });

    if (filename !== file.name)
      return res.render("forms/delete-file", {
        errors: [{ msg: "Incorrect name" }],
        cloud_id,
        name: file.name,
      });
    await File.deleteFile(cloud_id);
    await prisma.file.delete({ where: { cloud_id: file.cloud_id } });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

export default fileController;
