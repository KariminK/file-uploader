import { RequestHandler } from "express";

const bytesToMegabytes = (bytes: number) => bytes / 1000000;

export const validateFile: RequestHandler = (req, res, next) => {
  const { parentFolder } = req.params;
  if (!req.file)
    return res.render("forms/new-file", {
      errors: [{ msg: "You must put one file in field" }],
      parentFolder: parentFolder,
    });
  if (bytesToMegabytes(req.file.size) > 10)
    return res.render("forms/new-file", {
      errors: [{ msg: "File size must be less than 10 MB" }],
      parentFolder: parentFolder,
    });
  next();
};
