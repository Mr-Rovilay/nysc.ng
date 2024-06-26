import Product from "../models/productModel.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  const { title, description, image, categories, size, stock, color, price } =
    req.body;
  try {
    const newProduct = await Product.create({
      title,
      description,
      image,
      categories,
      size,
      stock,
      color,
      price,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(204).json();
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting item", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Product ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid Product ID format");
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.send(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Server error");
  }
};

export const getAllProduct = async (req, res) => {
  const isNew = req.query.new === "true";
  const category = req.query.category;
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    let query = {};

    // Handle category filter
    if (category) {
      query.categories = {
        $in: [category],
      };
    }

    // Handle search filter
    if (search) {
      query.title = {
        $regex: search,
        $options: "i", // case-insensitive
      };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    let currentPage = page;
    if (page < 1) {
      currentPage = 1;
    } else if (page > totalPages) {
      currentPage = totalPages;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: currentPage,
        perPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { title, description, image, categories, size, stock, color, price } =
    req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, image, categories, size, stock, color, price },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating item", error: error.message });
  }
};
