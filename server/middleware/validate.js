import { check, validationResult } from "express-validator";

export const validateUser = [
  check("email").notEmpty().withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
  check("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("isAdmin must be a boolean value"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUpdateUser = [
  check("fullname")
    .optional()
    .isString()
    .withMessage("Fullname must be a string"),
  check("email").optional().isEmail().withMessage("Email must be valid"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateProduct = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("categories")
    .isArray()
    .withMessage("Categories must be an array")
    .custom((categories) => {
      const allowedCategories = ["male", "female"];
      const isValid = categories.some((category) =>
        allowedCategories.includes(category)
      );
      if (!isValid) {
        throw new Error(
          "Categories must include at least one of 'male' or 'female'"
        );
      }
      return true;
    }),
  check("size").not().isEmpty().withMessage("Size is required"),
  check("color").optional().not().isEmpty().withMessage("Color is required"),
  check("stock")
    .isInt({ gt: 0 })
    .withMessage("Stock must be a non-negative integer"),
  check("image").isURL().withMessage("Image must be a valid URL"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
