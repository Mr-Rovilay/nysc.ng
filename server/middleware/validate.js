import { check, validationResult } from "express-validator";
import Product from "../models/productModel.js";

const CategoryEnum = ["Male", "Female", "Male & Female"];
const SizeEnum = ["S", "M", "L", "XL", "XXL", "Custom"];

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
    .not()
    .isEmpty()
    .withMessage("Category is required")
    .bail()
    .custom((categories) => {
      if (!CategoryEnum.includes(categories)) {
        throw new Error(
          "Invalid category. Must be one of: 'Male', 'Female', 'Male & Female'"
        );
      }
      return true;
    }),
  check("size")
    .not()
    .isEmpty()
    .withMessage("Size is required")
    .bail()
    .custom((size) => {
      if (!SizeEnum.includes(size)) {
        throw new Error(
          "Invalid size. Must be one of: 'S', 'M', 'L', 'XL', 'XXL', 'Custom'"
        );
      }
      return true;
    }),
  check("color").optional().not().isEmpty().withMessage("Color is required"),
  check("stock")
    .isInt({ min: 0 })
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

export const validateCart = [
  check("products.*.productId")
    .isMongoId()
    .withMessage("Product ID must be a valid Mongo ID"),
  check("quantity")
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

export const validateOrder = [
  check("products")
    .isArray({ min: 1 })
    .withMessage("Products must be an array with at least one item"),
  check("products.*.productId")
    .isMongoId()
    .withMessage("Product ID must be a valid Mongo ID"),
  check("address").isObject().withMessage("Address must be an object"),
  check("address.street").notEmpty().withMessage("Street is required"),
  check("address.city").notEmpty().withMessage("City is required"),
  check("address.state").notEmpty().withMessage("State is required"),
  check("address.postalCode").notEmpty().withMessage("Postal code is required"),
  check("address.country").notEmpty().withMessage("Country is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
// Validate order status
export const validateOrderStatus = [
  check("status")
    .optional()
    .isIn(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])
    .withMessage("Invalid status"),
];
