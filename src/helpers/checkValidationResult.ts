import { RequestHandler } from "express";
import { validationResult } from "express-validator";

export function checkValidationResult(
  view: string,
  locals?: Object
): RequestHandler {
  return (req, res, next) => {
    const { parentName } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render(view, {
        errors: errors.array({ onlyFirstError: true }),
        parentName,
        ...locals,
      });
    else next();
  };
}
