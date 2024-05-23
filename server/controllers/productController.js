import Product from "../models/productModel.js";

export const createPost = async (req, res) => {
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
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProduct = async (req, res) => {
  const isNew = req.query.new === "true";
  const category = req.query.category;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit) || 20;

  try {
    let query = {};

    if (isNew) {
      query = {};
    } else if (category) {
      query = {
        categories: {
          $in: [category],
        },
      };
    }

    const products = await Product.find(query)
      .sort({ createdAt: isNew ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
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
