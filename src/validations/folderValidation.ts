import { body } from "express-validator";

export const validateFolder = body("name")
  .notEmpty()
  .withMessage("folder's name cannot be empty")
  .isLength({ min: 3, max: 15 })
  .withMessage("folder's name must have between 3 and 15 length");
