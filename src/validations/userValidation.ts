import { Schema } from "express-validator";

export const registerUserSchema: Schema = {
  username: {
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must be at least 3 length",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isStrongPassword: {
      errorMessage:
        "Password must have big letter, small letter, number, symbol and must be at least 8 length",
    },
  },
  confirmPassword: {
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: "Passwords do not match",
    },
  },
};

export const logInUserSchema: Schema = {
  email: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
  },
};
