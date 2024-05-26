import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = async (req, res) => {
  const userId = req.decoded.id;
  const { products, address } = req.body;

  try {
    // Initialize an array to collect products with insufficient stock
    const insufficientStockProducts = [];
    // Initialize the total amount
    const totalAmount = 0;
    // Check stock and calculate the total amount for all products
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        insufficientStockProducts.push(product.title); // Collect product titles with insufficient stock
      }
      // Add the product price to the item
      item.price = product.price;

      // Calculate the total amount
      totalAmount += product.price * item.quantity;
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
      amount: totalAmount,
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
