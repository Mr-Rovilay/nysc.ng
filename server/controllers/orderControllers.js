import stripe from "stripe";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

//  const frontend_url = "http://localhost:5173";
export const createOrder = async (req, res) => {
  const frontend_url = "https://nysckit-ng-1.onrender.com";

  try {
    const { products, address } = req.body;

    // Validate the request
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products data" });
    }

    // Create an object to hold the product quantities for easy access
    const productQuantities = products.reduce((acc, item) => {
      acc[item.productId] = item.quantity;
      return acc;
    }, {});

    // Initialize variables for total price and line items
    let totalPrice = 0;
    const lineItems = [];

    // Find all products in a single query
    const productIds = products.map((item) => item.productId);
    const productDocs = await Product.find({ _id: { $in: productIds } });

    // Check stock for all products
    const insufficientStockProducts = [];
    productDocs.forEach((product) => {
      const requiredQuantity = productQuantities[product._id.toString()];
      if (product.stock < requiredQuantity) {
        insufficientStockProducts.push(product.title);
      }
    });

    // If any product has insufficient stock, return error
    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        error: `Insufficient stock for: ${insufficientStockProducts.join(
          ", "
        )}`,
      });
    }

    // Loop through each product in the request to calculate total price and create line items
    for (const product of products) {
      const productDoc = productDocs.find(
        (doc) => doc._id.toString() === product.productId
      );

      if (!productDoc) {
        return res
          .status(400)
          .json({ error: `Product not found: ${product.productId}` });
      }

      const price = productDoc.price;
      totalPrice += price * product.quantity;

      lineItems.push({
        price_data: {
          currency: "ngn",
          product_data: {
            name: productDoc.title,
          },
          unit_amount: price * 100, // Convert to cents
        },
        quantity: product.quantity,
      });
    }

    // Deduct stock for all products after creating the order
    for (let product of productDocs) {
      const quantity = productQuantities[product._id.toString()];
      product.stock -= quantity;
      await product.save();
    }

    // Add delivery charges to the total price
    const deliveryCharges = 2000;
    totalPrice += deliveryCharges;

    // Save the order details in the database
    const order = new Order({
      userId: req.decoded.id,
      products: products,
      amount: totalPrice,
      address: address,
      payment: false,
    });

    // Create the order if all products have sufficient stock
    const amount = productDocs.reduce((total, product) => {
      const quantity = productQuantities[product._id.toString()];
      return total + product.price * quantity;
    }, 0);

    // Create a session with line items for Stripe checkout
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        ...lineItems,
        {
          price_data: {
            currency: "ngn",
            product_data: {
              name: "Delivery Charges",
            },
            unit_amount: deliveryCharges * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
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

// Order verification endpoint
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    // Convert success string to boolean
    const isSuccess = success === "true";

    if (isSuccess) {
      // Update order payment status to true
      const order = await Order.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Processing",
      });

      // Clear the user's cart
      await Cart.findOneAndDelete({ userId: order.userId });

      res.json({ success: true, message: "Payment successful, cart cleared" });
    } else {
      // Delete order if payment unsuccessful
      await Order.findByIdAndDelete(orderId);
      res.json({
        success: false,
        message: "Payment unsuccessful, order deleted",
      });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
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

    await Order.deleteOne({ _id: orderId });
    return res.status(204).json();
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
    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 });
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
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const orders = await Order.find()
      .populate("products.productId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const cancelOrder = async (req, res) => {
  const userId = req.decoded.id;
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

    const timeLimit = 24 * 60 * 60 * 1000;

    if (timeDifference > timeLimit) {
      return res
        .status(403)
        .json({ message: "Order cancellation time window has expired" });
    }

    // Restock the products in the order
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      } else {
        console.warn(`Product with ID ${item.productId} not found`);
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
