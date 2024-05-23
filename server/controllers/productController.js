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
  const isNew = req.query.new;
  const category = req.query.category;

  try {
    let products;
    if (isNew) {
      products = await Product.find().sort({ createdAt: -1 });
    } else if (category) {
      products = await Product.find({
        categories: {
          $in: [category],
        },
      }).sort({ createdAt: -1 });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
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
