import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const createCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const userId = req.decoded.id;
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (!cart) {
      if (quantity > product.stock) {
        return res.status(400).send("Quantity exceeds available stock");
      }
      cart = new Cart({ userId, products: [{ productId, quantity }] });
      await cart.save();
      return res.status(201).json(cart);
    } else {
      const itemIndex = cart.products.findIndex((item) =>
        item.productId.equals(productId)
      );
      if (itemIndex > -1) {
        return res.status(400).send("Product already in cart");
      }

      if (quantity > product.stock) {
        return res.status(400).send("Quantity exceeds available stock");
      }
      cart.products.push({ productId, quantity });
      await cart.save();
      return res.status(201).json(cart);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.decoded.id });
    const productIndex = cart.products.findIndex(
      (p) => p.productId == req.params.productId
    );

    if (productIndex >= 0) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update the quantity of a specific item in the cart
// controllers/cartControllers.js

// controllers/cartControllers.js

export const decreaseCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const userId = req.decoded.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products[productIndex].quantity -= 1;
    if (cart.products[productIndex].quantity < 1) {
      cart.products.splice(productIndex, 1);
    }
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error decreasing cart item quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const increaseCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const userId = req.decoded.id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    product.quantity += 1;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error increasing cart item quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// deleteCart all cart
export const deleteCart = async (req, res) => {
  const userId = req.decoded.id;

  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE endpoint to delete an item by ID
export const deleteCartItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.decoded.id; // Assuming you have the user ID decoded from the JWT token

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { _id: itemId } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Item deleted successfully", updatedCart });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyCart = async (req, res) => {
  const userId = req.decoded.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
