import { RequestHandler, Router } from "express";
import { IsAuthorized } from "../middlewares/authMiddleware";
import File from "../models/File";
import prisma from "../db/prisma";
import { FileData } from "../types";

const fileController = Router();

fileController.use(IsAuthorized);

const getUploadForm: RequestHandler = (req, res) => {
  const { parentFolder } = req.params;

  res.render("forms/new-file", { parentFolder });
};

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
      size: file.size,
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

const getDeleteForm: RequestHandler = async (req, res) => {
  const { cloud_id } = req.params;

  const file = await prisma.file.findUnique({
    where: { cloud_id, ownerId: req.user?.id },
  });

  if (!file) return res.redirect("/");

  res.render("forms/delete-file", { cloud_id, name: file?.name });
};

const deleteFile: RequestHandler = async (req, res, next) => {
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
};

const getFileDetails: RequestHandler = async (req, res) => {
  const { cloud_id } = req.params;
  if (!cloud_id) res.redirect("/");

  const file = await prisma.file.findUnique({
    where: { cloud_id },
    include: { owner: true, folder: true },
  });

  if (!file) return res.redirect("/");

  res.render("file-details", { file, size: file.size * 1000 });
};

export default {
  getFileDetails,
  deleteFile,
  getDeleteForm,
  getUploadForm,
  uploadFile,
};
