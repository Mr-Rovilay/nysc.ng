import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const createCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (quantity > product.stock) {
      return res.status(400).send("Not enough stock");
    }

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.products.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the cart by user ID
    let cart = await Cart.findOne({ userId });

    // If the cart doesn't exist, return a 404 error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update the products in the cart
    cart.products = products;

    // Save the updated cart
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter((p) => p.productId !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const id = req.decoded.id;
    const cart = await Cart.findByIdAndDelete(id);

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    res.status(204).json();
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
