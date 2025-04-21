import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { Payment } from "../models/payment.models.js";
import { Cart } from "../models/cart.models.js"; // Assuming this exists
import { User } from "../models/user.models.js"; // Assuming this exists
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session (replaces createRazorpayOrder)
const createStripeCheckoutSession = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const payment = await Payment.findById(paymentId).populate("orderId");
  if (!payment || payment.paymentStatus !== "Pending") {
    throw new ApiError(400, "Invalid or already processed payment");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Food Order",
            description: `Order #${payment.orderId._id}`,
          },
          unit_amount: payment.amount * 100, // Convert to paise
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // success_url: `${req.protocol}://${req.get("host")}/delivery?orderId=${
    //   payment.orderId._id
    // }`,
    // success_url: "http://localhost:5173/delivery",
    success_url: `http://localhost:5173/delivery?orderId=${payment.orderId._id}&paymentId=${payment._id}&paymentMethod=${payment.paymentMethod}`,
    cancel_url: `${req.protocol}://${req.get("host")}/order?orderId=${
      payment.orderId._id
    }`,
    metadata: { paymentId: payment._id.toString() },
  });

  payment.stripeSessionId = session.id; // Add this field to your Payment schema
  await payment.save();

  console.log("Stripe Session Created:", session.id);

  res.json({ id: session.id, key: process.env.STRIPE_PUBLIC_KEY });
});

// Verify Payment (via Webhook or manual check)
const verifyStripePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const payment = await Payment.findById(paymentId).populate("orderId");
  if (!payment) throw new ApiError(404, "Payment not found");

  const session = await stripe.checkout.sessions.retrieve(
    payment.stripeSessionId
  );
  console.log(session);
  if (session.payment_status === "paid") {
    payment.paymentStatus = "Paid";
    payment.transactionId = session.payment_intent;
    payment.orderId.orderStatus = "Order Placed";

    // Atomically update the cart
    const cart = await Cart.findOneAndUpdate(
      { customerId: req.user._id },
      { $set: { items: [], totalCartAmount: 0 } },
      { new: true } // Return the updated document
    );
    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    await Promise.all([payment.save(), payment.orderId.save()]);
    res.json({ status: "success", message: "Payment verified" });
  } else {
    payment.paymentStatus = "Failed";
    await payment.save();
    throw new ApiError(400, "Payment not completed");
  }
});

const verifyCashOnDeliveryPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  order.orderStatus = "Order Placed";

  // Atomically update the cart
  const cart = await Cart.findOneAndUpdate(
    { customerId: req.user._id },
    { $set: { items: [], totalCartAmount: 0 } },
    { new: true } // Return the updated document
  );
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  await Promise.all([order.save(), cart.save()]);
  res.json(new ApiResponce(200, order, "Order Placed Successfully"));
});

// Get Payment by Order ID (unchanged)
const getPaymentByOrderId = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const payment = await Payment.findOne({ orderId }).populate("orderId");
  if (!payment) throw new ApiError(404, "Payment not found");
  res.json(new ApiResponce(200, payment, "Payment fetched successfully"));
});

const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;
  const payment = await Payment.findOneAndUpdate(
    { orderId },
    { paymentMethod }
  ).populate("orderId");
  if (!payment) throw new ApiError(404, "Payment not found");
  res.json(
    new ApiResponce(200, payment, "Payment method updated successfully")
  );
});

export {
  createStripeCheckoutSession,
  verifyStripePayment,
  getPaymentByOrderId,
  updatePaymentMethod,
  verifyCashOnDeliveryPayment,
};
