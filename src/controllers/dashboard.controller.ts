import { RequestHandler } from "express";
import prisma from "../db/prisma";

const getRootFolder: RequestHandler = async (req, res) => {
  if (!req.user) {
    return res.render("index");
  }

  const [folders, files] = await Promise.all([
    await prisma.folder.findMany({
      where: { ownerId: req.user.id, parentFolderId: null },
    }),
    await prisma.file.findMany({
      where: { ownerId: req.user.id, folderId: null },
    }),
  ]);

  res.render("dashboard", {
    user: req.user,
    folders,
    files,
    folderId: "root",
  });
};

export default { getRootFolder };
