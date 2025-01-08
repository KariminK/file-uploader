import { RequestHandler, Router } from "express";
import { IsAuthorized } from "../middlewares/authMiddleware";
import File, { upload } from "../models/File";
import prisma from "../db/prisma";
import { FileData } from "../types/global";

const fileController = Router();

fileController.use(IsAuthorized);

fileController.get("/:parentFolder/upload", (req, res) => {
  const { parentFolder } = req.params;
  res.render("forms/new-file", { parentFolder });
});

const validateFile: RequestHandler = (req, res, next) => {
  if (!req.file)
    return res.render("new-file", {
      error: { msg: "You must put one file in field" },
    });
  next();
};
const uploadFile: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/");
    const file = req.file as Express.Multer.File;
    const uploadInfo = await File.uploadFile(file);

    const newFileData: FileData = {
      name: file.originalname,
      file_url: uploadInfo.url,
      ownerId: req.user.id,
    };
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
