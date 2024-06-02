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
  const { quantity } = req.body;
  const { productId } = req.params;
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

    // Find the cart by user ID
    let cart = await Cart.findOne({ userId });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check the stock for each product and update the cart accordingly
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .send(`Product with ID ${item.productId} not found`);
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === item.productId
      );

      if (productIndex > -1) {
        // If the product already exists in the cart, update its quantity
        const newQuantity =
          cart.products[productIndex].quantity + item.quantity;
        if (newQuantity > product.stock) {
          return res
            .status(400)
            .send(`Not enough stock for product ${product.title}`);
        }
        cart.products[productIndex].quantity = newQuantity;
      } else {
        // If the product does not exist in the cart, add it
        if (item.quantity > product.stock) {
          return res
            .status(400)
            .send(`Not enough stock for product ${product.title}`);
        }
        cart.products.push(item);
      }
    }

    // Save the updated cart
    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
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
const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params.id;
    const carts = await Cart.deleteOne(id);

    if (!carts) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.status(200).send({ message: "Item deleted successfully", carts });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting item", error: error.message });
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
