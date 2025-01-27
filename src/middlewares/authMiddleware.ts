import { RequestHandler } from "express";

// nazwy funkcji z małej litery
export const IsAuthorized: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).render("error", {
      status: 401,
      message: "You need to log in to see this",
    });
  }

  next();
};
