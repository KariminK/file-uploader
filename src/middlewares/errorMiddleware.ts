import { ErrorRequestHandler } from "express";

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).render("error", {
    status: 500,
    message: `Internal server error: ${err}`,
  });
};

export default errorMiddleware;
