import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  let errMessage = "Internal server error";
  if (err.message) {
    errMessage = `Internal server error: ${err.message}`;
  }
  if (err.code) {
    errMessage += `\t Code: ${err.code}`;
  }

  res.status(500).render("error", {
    status: 500,
    message: errMessage,
  });
};

export default errorMiddleware;
