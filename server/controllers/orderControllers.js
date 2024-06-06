import express from "express";
import stripe from "stripe";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  try {
    const { products, address } = req.body;

    // Validate the request
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products data" });
    }

    // Calculate total amount and create line items for Stripe checkout session
    const lineItems = [];
    let totalPrice = 0;

    for (const product of products) {
      const { productId, quantity } = product;
      const productDoc = await Product.findById(productId);

      if (!productDoc) {
        return res
          .status(400)
          .json({ error: `Product not found: ${productId}` });
      }

      const price = productDoc.price;
      totalPrice += price * quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: productDoc.title,
          },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: quantity,
      });
    }

    // Add delivery charge to the total price
    totalPrice += 20;

    // Save the order details in the database
    const order = new Order({
      userId: req.decoded.id, // Assuming you have user authentication and get the user ID from the request
      products: products,
      amount: totalPrice,
      address: address,
      payment: false, // Assuming payment is not completed yet
    });

    // Create a session with line items for Stripe checkout
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${order._id}`,
    });

    await order.save();

    // Return the checkout session URL to the client
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//only admin can update order
export const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (status) {
      order.status = status;
    }
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const userId = req.decoded.id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderCreationTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - orderCreationTime;

    const timeLimit = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeDifference > timeLimit) {
      return res
        .status(403)
        .json({ message: "Order deletion time window has expired" });
    }

    await Order.deleteOne({ _id: orderId });

    res.status(204).json();
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const adminDeleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.deleteOne({ _id: orderId });

    res.status(204).json();
  } catch (error) {
    console.error("Error deleting order:", error);
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

export const cancelOrder = async (req, res) => {
  const userId = req.decoded.id; // Assuming you use JWT and store the user ID in the token
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is cancelable (e.g., it is in "Pending" or "Processing" status)
    if (order.status !== "Pending" && order.status !== "Processing") {
      return res.status(400).json({ message: "Order cannot be canceled" });
    }

    const orderCreationTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - orderCreationTime;

    const timeLimit = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeDifference > timeLimit) {
      return res
        .status(403)
        .json({ message: "Order cancellation time window has expired" });
    }

    // Restock the products in the order
    for (let item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Update the order status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order canceled successfully", order });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
