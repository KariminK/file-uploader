import { Router } from "express";
import authController from "./auth.controller";
import folderController from "./folder.controller";
import prisma from "../db/prisma";
// unikaj takich importów, nie jest to zbyt czytelne, lepiej importować tylko te rzeczy, które potrzebujesz
import "../types";
import errorMiddleware from "../middlewares/errorMiddleware";
import fileController from "./file.controller";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  if (!req.user) {
    return res.render("index")
  }

  // tutaj można użyć Promise.all(), żeby te dwa zapytania do bazy poszły na raz
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


// Generalnie pliki index.ts powinny służyć do exportowania innych plików z danego folderu
// dlatego ten router można by w ogóle usunąć, ten pierwszy endpoint przenieść do kontrolera folder, albo jakiegoś nowego

