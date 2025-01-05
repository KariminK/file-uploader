import { Router } from "express";
import { IsAuthorized } from "../middlewares/authMiddleware";
import prisma from "../db/prisma";

const folderController = Router();

folderController.use(IsAuthorized);
folderController.get("/new", (req, res) => {
  res.render("forms/new-folder");
});

// TODO: ADD VALIDATION TO NEW FOLDER

folderController.post("/new", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (name && req.user) {
      await prisma.folder.create({
        data: {
          name: name,
          ownerId: req.user.id,
        },
      });
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
});

export default folderController;
