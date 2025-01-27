import { RequestHandler, Router } from "express";
import { IsAuthorized } from "../middlewares/authMiddleware";
import prisma from "../db/prisma";
import "../types";
import { NewFolderData } from "../types";
import { user } from "@prisma/client";

const folderController = Router();

folderController.use(IsAuthorized);

const getNewFolderForm: RequestHandler = async (req, res) => {
  const { parentName } = req.params;
  const user = req.user as user;

  // czy tu nie trzeba czasem await?
  const parentFolder = await prisma.folder.findFirst({
    // ten znak zapytania niepotrzebny, już wcześniej sprawdzasz czy user nie istnieje
    where: { name: parentName, ownerId: user.id },
  });

  if (!parentFolder) {
    return res
      .status(400)
      .render("error", { status: 400, message: "Invalid parent folder name" });
  }

  return res.render("forms/new-folder", { parentName });
};

const addNewFolder: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { parentName } = req.params;
    const user = req.user as user;

    const folderData: NewFolderData = {
      name: name,
      ownerId: user.id,
      parentFolderId: null,
    };

    if (parentName === "root") {
      await prisma.folder.create({ data: folderData });

      return res.redirect("/");
    }

    const parentFolder = await prisma.folder.findFirst({
      where: { name: parentName, ownerId: user.id },
    });

    if (!parentFolder) {
      return res.status(400).redirect("/");
    }

    await prisma.folder.create({
      data: { ...folderData, parentFolderId: parentFolder.id },
    });

    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

// folderController.post(
//   "/:parentName/new",
//   validateFolder,
//   checkValidationResult("forms/new-folder"),
//   addNewFolder,
// );

const getFolderContent: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.params;
    const user = req.user as user;

    const [files, folders] = await Promise.all([
      await prisma.file.findMany({
        where: {
          folder: { name },
          ownerId: user.id,
        },
      }),
      await prisma.folder.findMany({
        where: {
          parentFolder: {
            name: name,
            ownerId: user.id,
          },
        },
      }),
    ]);

    return res.render("dashboard", {
      user: req.user,
      folders,
      parentName: name,
      files: files,
    });
  } catch (error) {
    next(error);
  }
};

// folderController.get("/:name", getFolderContent);

// skoro to endpoint do usuwania, to powinien być DELETE, a nie GET
const deleteFolder: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.params;
    const user = req.user as user;

    const folder = await prisma.folder.findFirst({
      where: { name, ownerId: user.id },
    });

    if (!folder) {
      return res.redirect("/");
    }

    await prisma.folder.delete({ where: { id: folder.id } });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};
// folderController.get("/:name/delete", deleteFolder);

const getEditFolderForm: RequestHandler = (req, res) => {
  const { name } = req.params;
  res.render("forms/edit-folder", { name });
};
// folderController.get("/:name/edit", getEditFolderForm);

// skoro to endpoint do edycji, to powinien być PUT albo PATCH, a nie POST
const editFolder: RequestHandler = async (req, res, next) => {
  try {
    const { name } = req.params;
    const { newName } = req.body;
    const user = req.user as user;

    const folder = await prisma.folder.findFirst({
      where: { name: name, ownerId: user.id },
    });

    if (!folder) {
      return res.status(400).redirect("/");
    }

    await prisma.folder.update({
      where: { id: folder.id },
      data: { name: newName },
    });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export default {
  getNewFolderForm,
  getEditFolderForm,
  getFolderContent,
  addNewFolder,
  editFolder,
  deleteFolder,
};
