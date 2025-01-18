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
    };

    if (parentFolder !== "root") {
      const folder = await prisma.folder.findFirst({
        where: { name: parentFolder, ownerId: req.user.id },
      });
      if (folder === null)
        return res
          .status(400)
          .render("error", { status: 400, message: "Folder doesn't exisist" });
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

export default fileController;
