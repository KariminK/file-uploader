import { body } from "express-validator";

export const validateFolder = body("name")
  // jeśli sprawdzasz długość stringa, to chyba już nie ma potrzeby sprawdzać, czy nie jest pusty
  .notEmpty()
  .withMessage("folder's name cannot be empty")
  .isLength({ min: 3, max: 15 })
  .withMessage("folder's name must have between 3 and 15 length");
