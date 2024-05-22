import { check, validationResult } from "express-validator";

export const validateProduct = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  check("description").not().isEmpty().withMessage("Description is required"),
  check("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),
  check("size").not().isEmpty().withMessage("Size must be an array"),
  check("color").optional().not().isEmpty().withMessage("Color is required"),
  check("stock")
    .isInt({ gt: 0 })
    .withMessage("Stock must be a non-negative integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateCart = [
  check("userId").isMongoId().withMessage("User ID must be a valid Mongo ID"),
  check("products.*.productId")
    .isMongoId()
    .withMessage("Product ID must be a valid Mongo ID"),
  check("products.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
