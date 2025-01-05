import { RequestHandler } from "express";

export const IsAuthorized: RequestHandler = (req, res, next) => {
  if (!req.user)
    return res.status(401).render("erorr", {
      status: 401,
      message: "You need to log in to see this",
    });
  next();
};
