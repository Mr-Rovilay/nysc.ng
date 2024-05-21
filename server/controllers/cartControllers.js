import Cart from "../models/cartModel.js";

export const createCart = async (req, res) => {
  const newCart = req.body;
  try {
    const savedCart = await Cart.create(newCart);
    res.status(201).json(savedCart);
  } catch (error) {
    console.error("Error inserting document into collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  const id = req.params.id;
  const { userId, products } = req.body;
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { userId, products },
      { new: true }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(201).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }
    res.status(204).json();
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting item", error: error.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCart = async (req, res) => {
  try {
    const cart = await Cart.find();
    res.send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
