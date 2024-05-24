import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  const { userId, products, amount, address } = req.body;

  try {
    // Initialize an array to collect products with insufficient stock
    const insufficientStockProducts = [];

    // Check stock for all products
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        insufficientStockProducts.push(product.title); // Collect product titles with insufficient stock
      }
    }

    // If there are any products with insufficient stock, return an error message
    if (insufficientStockProducts.length > 0) {
      return res
        .status(400)
        .send(
          `Not enough stock for product(s): ${insufficientStockProducts.join(
            ", "
          )}`
        );
    }

    // Create the order if all products have sufficient stock
    const newOrder = new Order({
      userId,
      products,
      amount,
      address,
    });

    const order = await newOrder.save();

    // Deduct stock for all products after creating the order
    for (let item of products) {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error inserting document into collection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { userId, products, totalAmount, status } = req.body;

  try {
    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (products) {
      // First, restore stock levels for the products in the current order
      for (let item of order.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }

      // Check new product stock levels
      for (let item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).send(`Product not found: ${item.productId}`);
        }
        if (product.stock < item.quantity) {
          return res
            .status(400)
            .send(`Not enough stock for product: ${product.name}`);
        }
      }

      // Deduct stock levels for the new products
      for (let item of products) {
        const product = await Product.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      }

      // Update the order's products
      order.products = products;
    }

    // Update other fields if provided
    if (userId) order.userId = userId;
    if (totalAmount) order.amount = totalAmount;
    if (status) order.status = status;

    // Save the updated order
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating the order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting the order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyOrders = async (req, res) => {
  const userId = req.decoded.id;

  try {
    const orders = await Order.find({ userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};
