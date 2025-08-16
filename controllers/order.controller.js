const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least one item" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country ||
      !shippingAddress.phoneNumber
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const orderItems = [];
    let itemsPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Only ${product.stock} left in stock` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      itemsPrice += product.price * item.quantity;

      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }
    const shippingCost = itemsPrice > 1000 ? 0 : 100; //free shipping for orders above 1000

    const order = new Order({
      userId,
      items: orderItems,
      itemsPrice,
      shippingCost,
      shippingAddress,
      notes,
    });

    await order.save();

    // Populate user and product details for response
    await order.populate("userId", "FirstName LastName email");
    await order.populate("items.product", "name image price");

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

const getOrderbyId = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "FirstName LastName email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "FirstName LastName email")
      .populate("items.product", "name image price");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrderbyId,
  getAllOrders,
};
