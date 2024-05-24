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
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.products.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex > -1) {
        // Check if adding quantity exceeds available stock
        if (cart.products[itemIndex].quantity + quantity > product.stock) {
          return res
            .status(400)
            .send("Adding quantity exceeds available stock");
        }
        cart.products[itemIndex].quantity += quantity;
      } else {
        // Check if adding quantity exceeds available stock
        if (quantity > product.stock) {
          return res
            .status(400)
            .send("Adding quantity exceeds available stock");
        }
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

export const removeFromCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const userId = req.decoded.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId === productId
    );

    if (productIndex === -1) {
      return res.status(404).send("Product not found in cart");
    }

    // Remove the specified quantity from the product in the cart
    cart.products[productIndex].quantity -= quantity;

    // If the quantity becomes zero or negative, remove the product from the cart
    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const { products } = req.body;

    // Check the stock for each product
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .send(`Product with ID ${item.productId} not found`);
      }
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .send(`Not enough stock for product ${product.title}`);
      }
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
