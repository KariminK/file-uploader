import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export function checkValidationResult(view: string): RequestHandler {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.render(view, { errors: errors.array() });
    else next();
  };
}
