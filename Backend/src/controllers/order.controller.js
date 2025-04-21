import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.models.js";
import { Food } from "../models/food.models.js";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { Payment } from "../models/payment.models.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const addressIndex = req.body.addressIndex ?? 0;

  const cart = await Cart.findOne({ customerId: req.user._id });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  if (cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let charges;
  if (cart.totalCartAmount < 100) {
    charges = cart.totalCartAmount * 0.15;
  } else if (cart.totalCartAmount >= 100 && cart.totalCartAmount < 500) {
    charges = cart.totalCartAmount * 0.1;
  } else if (cart.totalCartAmount >= 500) {
    charges = 0;
  }

  if (
    !user.address ||
    user.address.length === 0 ||
    !user.address[addressIndex]
  ) {
    throw new ApiError(400, "Invalid delivery address selection");
  }

  try {
    const orderItems = cart.items.map((item) => ({
      foodId: item.foodId,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    }));

    const order = await Order.create({
      customerId: req.user._id,
      orderItems,
      totalOrderAmount: cart.totalCartAmount + charges,
      orderStatus: "Pending",
      deliveryAddress: {
        type: user.address[addressIndex]?.type,
        details: user.address[addressIndex]?.details,
      },
      charges,
    });

    const payment = await Payment.create({
      orderId: order._id,
      customerId: req.user._id,
      paymentMethod: "Digital",
      amount: order.totalOrderAmount,
      paymentStatus: "Pending",
    });

    const populatedOrder = await Order.findById(order._id).populate({
      path: "orderItems.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    return res
      .status(201)
      .json(new ApiResponce(201, populatedOrder, "Order created successfully"));
  } catch (error) {
    console.error("Error details:", error);
    throw new ApiError(500, "Failed to create order", error);
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId, addressIndex } = req.body;

  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const user = await User.findById(req.user._id);
  if (!user || !user.address || !user.address[addressIndex]) {
    throw new ApiError(400, "Invalid address selection");
  }

  order.deliveryAddress = {
    type: user.address[addressIndex].type,
    details: user.address[addressIndex].details,
  };

  await order.save();

  const populatedOrder = await Order.findById(order._id).populate({
    path: "orderItems.foodId",
    select: "name price foodImage isAvailable restaurantId",
    populate: {
      path: "restaurantId",
      select: "name",
    },
  });

  return res
    .status(200)
    .json(new ApiResponce(200, populatedOrder, "Order updated successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, orderId } = req.body;
  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    order.orderStatus = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id).populate({
      path: "orderItems.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          populatedOrder,
          "Order status updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to update order status", error);
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const order = await Order.findOneAndDelete({ _id: req.body.orderId });
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    return res
      .status(200)
      .json(new ApiResponce(200, order, "Order deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete order", error);
  }
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate({
        path: "orderItems.foodId",
        select: "name price foodImage isAvailable restaurantId",
        populate: {
          path: "restaurantId",
          select: "name",
        },
      })
      .populate({
        path: "customerId",
        select: "name email",
      })
      .populate({
        path: "deliveryAddress",
        select: "type details",
      });

    if (!orders.length) {
      throw new ApiError(404, "No orders found for this user");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve orders: " + error.message);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const order = await Order.findById(req.body.orderId)
      .populate({
        path: "orderItems.foodId",
        select: "name price foodImage isAvailable restaurantId",
        populate: {
          path: "restaurantId",
          select: "name",
        },
      })
      .populate({
        path: "customerId",
        select: "name email phone foodImage",
      })
      .populate({
        path: "deliveryAddress",
        select: "type details",
      });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, order, "Order fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get order", error, {
      orderId: req.body.orderId,
    });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "orderItems.foodId",
        select: "name price foodImage isAvailable restaurantId",
        populate: {
          path: "restaurantId",
          select: "name",
        },
      })
      .populate({
        path: "customerId",
        select: "name email",
      })
      .populate({
        path: "deliveryAddress",
        select: "type details",
      });

    if (!orders) {
      throw new ApiError(404, "Orders not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get orders", error);
  }
});

const getAllOrdersOfRestaurant = asyncHandler(async (req, res) => {
  // Ensure restaurant is authenticated
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  try {
    const orders = await Order.aggregate([
      // Step 1: Unwind orderItems to process each item
      {
        $unwind: {
          path: "$orderItems",
          preserveNullAndEmptyArrays: true, // Keep orders with empty orderItems
        },
      },
      // Step 2: Lookup food details to get restaurantId
      {
        $lookup: {
          from: "foods",
          localField: "orderItems.foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      // Step 3: Unwind foodDetails to access restaurantId
      {
        $unwind: {
          path: "$foodDetails",
          preserveNullAndEmptyArrays: true, // Handle cases where foodId might not exist
        },
      },
      // Step 4: Match orders where food belongs to the authenticated restaurant
      {
        $match: {
          "foodDetails.restaurantId": new mongoose.Types.ObjectId(
            req.restaurant._id
          ),
        },
      },
      // Step 5: Group back to reconstruct orders
      {
        $group: {
          _id: "$_id",
          customerId: { $first: "$customerId" },
          orderItems: {
            $push: {
              foodId: "$orderItems.foodId",
              quantity: "$orderItems.quantity",
              price: "$orderItems.price",
            },
          },
          totalPrice: { $first: "$totalPrice" },
          orderStatus: { $first: "$orderStatus" },
          paymentStatus: { $first: "$paymentStatus" },
          deliveryAddress: { $first: "$deliveryAddress" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      // Step 6: Lookup food details for population
      {
        $lookup: {
          from: "foods",
          localField: "orderItems.foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      // Step 7: Lookup restaurant details for food
      {
        $lookup: {
          from: "restaurants",
          localField: "foodDetails.restaurantId",
          foreignField: "_id",
          as: "restaurantDetails",
        },
      },
      // Step 8: Lookup customer details
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      // Step 9: Lookup delivery address
      {
        $lookup: {
          from: "addresses",
          localField: "deliveryAddress",
          foreignField: "_id",
          as: "addressDetails",
        },
      },
      // Step 10: Project the final structure
      {
        $project: {
          _id: 1,
          customerId: {
            $cond: {
              if: { $gt: [{ $size: "$customerDetails" }, 0] },
              then: {
                _id: { $arrayElemAt: ["$customerDetails._id", 0] },
                name: { $arrayElemAt: ["$customerDetails.name", 0] },
                email: { $arrayElemAt: ["$customerDetails.email", 0] },
              },
              else: null,
            },
          },
          orderItems: {
            $map: {
              input: "$orderItems",
              as: "item",
              in: {
                foodId: {
                  _id: "$$item.foodId",
                  name: {
                    $arrayElemAt: [
                      "$foodDetails.name",
                      {
                        $indexOfArray: ["$foodDetails._id", "$$item.foodId"],
                      },
                    ],
                  },
                  price: {
                    $arrayElemAt: [
                      "$foodDetails.price",
                      {
                        $indexOfArray: ["$foodDetails._id", "$$item.foodId"],
                      },
                    ],
                  },
                  foodImage: {
                    $arrayElemAt: [
                      "$foodDetails.foodImage",
                      {
                        $indexOfArray: ["$foodDetails._id", "$$item.foodId"],
                      },
                    ],
                  },
                  isAvailable: {
                    $arrayElemAt: [
                      "$foodDetails.isAvailable",
                      {
                        $indexOfArray: ["$foodDetails._id", "$$item.foodId"],
                      },
                    ],
                  },
                  restaurantId: {
                    _id: {
                      $arrayElemAt: [
                        "$restaurantDetails._id",
                        {
                          $indexOfArray: [
                            "$foodDetails.restaurantId",
                            "$foodDetails.restaurantId",
                          ],
                        },
                      ],
                    },
                    name: {
                      $arrayElemAt: [
                        "$restaurantDetails.name",
                        {
                          $indexOfArray: [
                            "$foodDetails.restaurantId",
                            "$foodDetails.restaurantId",
                          ],
                        },
                      ],
                    },
                  },
                },
                quantity: "$$item.quantity",
                price: "$$item.price",
              },
            },
          },
          totalPrice: 1,
          orderStatus: 1,
          paymentStatus: 1,
          deliveryAddress: {
            $cond: {
              if: { $gt: [{ $size: "$addressDetails" }, 0] },
              then: {
                type: { $arrayElemAt: ["$addressDetails.type", 0] },
                details: { $arrayElemAt: ["$addressDetails.details", 0] },
              },
              else: null,
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      // Step 11: Sort by createdAt descending
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res
        .status(200)
        .json(new ApiResponce(200, [], "No orders found for this restaurant"));
    }

    console.log(
      "Orders found for restaurant",
      req.restaurant._id,
      ":",
      orders.length
    );
    console.log("Sample order:", orders[0] || "No orders");

    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw new ApiError(500, "Failed to get orders", error.message);
  }
});

const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  try {
    const orders = await Order.find({ orderStatus: status })
      .populate({
        path: "orderItems.foodId",
        select: "name price foodImage isAvailable restaurantId",
        populate: {
          path: "restaurantId",
          select: "name",
        },
      })
      .populate({
        path: "customerId",
        select: "name email",
      })
      .populate({
        path: "deliveryAddress",
        select: "type details",
      });

    if (!orders) {
      throw new ApiError(404, "Orders not found");
    }
    return res
      .status(200)
      .json(new ApiResponce(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get orders", error);
  }
});

const getAllStatus = asyncHandler(async (req, res) => {
  try {
    const statusEnum = Order.schema.path("orderStatus").enumValues;
    console.log("Enum statuses:", statusEnum);

    return res
      .status(200)
      .json(new ApiResponce(200, statusEnum, "Statuses fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get statuses", error.message || error);
  }
});

export {
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderByUserId,
  getAllOrders,
  getAllOrdersOfRestaurant,
  getOrdersByStatus,
  getOrderById,
  getAllStatus,
};
