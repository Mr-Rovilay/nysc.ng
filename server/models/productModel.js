import mongoose from "mongoose";

const CategoryEnum = ["Male", "Female", "Male & Female"];
const SizeEnum = ["S", "M", "L", "XL", "XXL", "Custom"];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      enum: CategoryEnum,
      required: true,
    },
    size: {
      type: String,
      enum: SizeEnum,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    color: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
