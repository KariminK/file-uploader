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

  if (!req.user) {
    return res.status(401).redirect("/");
  }

  // czy tu nie trzeba czasem await?
  const parentFolder = prisma.folder.findFirst({
    // ten znak zapytania niepotrzebny, już wcześniej sprawdzasz czy user nie istnieje
    where: { name: parentName, ownerId: req.user?.id },
  });

  if (!parentFolder) {
    return res
      .status(400)
      .render("error", { status: 400, message: "Invalid parent folder name" });
  }

  return res.render("forms/new-folder", { parentName });
});

folderController.post(
  "/:parentName/new",
  validateFolder,
  checkValidationResult("forms/new-folder"),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const { parentName } = req.params;

      if (!name || !req.user) {
        return res.status(400).redirect("/");
      }

      const folderData: newFolderData = {
        name: name,
        ownerId: req.user.id,
        parentFolderId: null,
      };

      // można tutaj zastosować pattern early return, żeby pozbyć się zagnieżdżonych ifów i zrobić ten kod trochę czytelniejszy
      // if (parentName !== "root") {
      //   const parentFolder = await prisma.folder.findFirst({
      //     where: { name: parentName, ownerId: req.user.id },
      //   });
      //   if (!parentFolder) return res.status(400).redirect("/");
      //   folderData.parentFolderId = parentFolder.id;
      // }

      // await prisma.folder.create({ data: folderData });

      // res.redirect("/");

      if (parentName === "root") {
        await prisma.folder.create({ data: folderData });

        return res.redirect("/");
      }

      const parentFolder = await prisma.folder.findFirst({
        where: { name: parentName, ownerId: req.user.id },
      });

      if (!parentFolder) {
        return res.status(400).redirect("/");
      }

      await prisma.folder.create({ data: { ...folderData, parentFolderId: parentFolder.id } })

      return res.redirect("/");

    } catch (error) {
      next(error);
    }
  }
);

folderController.get("/:name", async (req, res, next) => {
  try {
    // czy to sprawdzanie w każdym endpoincie czy user istnieje jest potrzebne, skoro masz middleware do tego?
    if (!req.user) return res.status(401).redirect("/");

    const { name } = req.params;

    // tutaj też, zamienić na Promise.all(), żeby szły oba requesty na raz
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

// skoro to endpoint do usuwania, to powinien być DELETE, a nie GET
folderController.get("/:name/delete", async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/");

    const { name } = req.params;

    const folder = await prisma.folder.findFirst({
      where: { name, ownerId: req.user.id },
    });

    if (!folder) {
      return res.redirect("/");
    }

    await prisma.folder.delete({ where: { id: folder.id } });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

folderController.get("/:name/edit", (req, res) => {
  const { name } = req.params;
  res.render("forms/edit-folder", { name });
});

// skoro to endpoint do edycji, to powinien być PUT albo PATCH, a nie POST
folderController.post("/:name/edit", async (req, res, next) => {
  if (!req.user) return res.redirect("/");

  try {
    const { name } = req.params;
    const { newName } = req.body;

    // do tego można zrobić walidator, żeby nie sprawdzać już tego w kontrolerze
    if (!newName) {
      return res.render("forms/edit-folder", {
        errors: [{ msg: "New folder name cannot be empty" }],
      });
    }

    const folder = await prisma.folder.findFirst({
      where: { name: name, ownerId: req.user.id },
    });

    if (!folder) {
      return res.status(400).redirect("/");
    }

    // nie sprawdzasz czy nazwa takiego folderu już istnieje, nie wiem jakie są założenia tej aplikacji, ale nazwa folderu powinna być raczej unikalna
    await prisma.folder.update({
      where: { id: folder.id },
      data: { name: newName },
    });

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

export default folderController;
