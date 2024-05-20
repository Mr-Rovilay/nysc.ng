import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  const { userId, products, amount, address } = req.body;

  try {
    const newOrder = new Order({
      userId,
      products,
      amount,
      address,
    });

    const order = await newOrder.save();
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send(`Product not found: ${item.productId}`);
      }

      product.stock -= item.quantity;
      if (product.stock < 0) {
        return res
          .status(400)
          .send(`Not enough stock for product: ${product.name}`);
      }
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

      // Then, update the order's products and adjust stock levels accordingly
      for (let item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).send(`Product not found: ${item.productId}`);
        }
        product.stock -= item.quantity;
        if (product.stock < 0) {
          return res
            .status(400)
            .send(`Not enough stock for product: ${product.name}`);
        }
        await product.save();
      }

      order.products = products;
    }

    // Update other fields if provided
    if (userId) order.userId = userId;
    if (totalAmount) order.amount = totalAmount;
    if (status) order.status = status;

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
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting the order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.params.userId;

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
