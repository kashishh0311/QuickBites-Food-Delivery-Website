import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { Food } from "../models/food.models.js";
import { Feedback } from "../models/feedback.models.js";
import { User } from "../models/user.models.js"; // Adjust based on your User model
import mongoose from "mongoose";

// Get Monthly Orders
const getMonthlyOrders = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "foods",
        localField: "orderItems.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $match: {
        "foodDetails.restaurantId": new mongoose.Types.ObjectId(
          req.restaurant._id
        ),
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 12,
    },
    {
      $project: {
        month: {
          $arrayElemAt: [
            [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            { $subtract: ["$_id.month", 1] },
          ],
        },
        orders: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponce(200, orders, "Monthly orders fetched successfully"));
});

// Get Income and Expense
const getIncomeExpense = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "foods",
        localField: "orderItems.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $match: {
        "foodDetails.restaurantId": new mongoose.Types.ObjectId(
          req.restaurant._id
        ),
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        income: { $sum: "$totalPrice" },
      },
    },
  ]);

  // Placeholder expense (60% of income); replace with actual expense data
  const income = orders[0]?.income || 0;
  const expense = income * 0.6;

  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  return res
    .status(200)
    .json(
      new ApiResponce(200, data, "Income and expense fetched successfully")
    );
});

// Get Order Status
const getOrderStatus = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const orders = await Order.aggregate([
    {
      $lookup: {
        from: "foods",
        localField: "orderItems.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $match: {
        "foodDetails.restaurantId": new mongoose.Types.ObjectId(
          req.restaurant._id
        ),
      },
    },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);

  const statusMap = {
    Complete: 0,
    Delivered: 0,
    Cancelled: 0,
    Pending: 0,
  };

  orders.forEach(({ status, count }) => {
    if (status in statusMap) {
      statusMap[status] = count;
    }
  });

  return res
    .status(200)
    .json(new ApiResponce(200, statusMap, "Order status fetched successfully"));
});

// Get Overview Metrics (Net Revenue, Orders Processed, Total Customers, Menu Items)
const getOverviewMetrics = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const [orders, foods, customers] = await Promise.all([
    Order.aggregate([
      {
        $lookup: {
          from: "foods",
          localField: "orderItems.foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      {
        $match: {
          "foodDetails.restaurantId": new mongoose.Types.ObjectId(
            req.restaurant._id
          ),
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          netRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]),
    Food.countDocuments({ restaurantId: req.restaurant._id }),
    Order.aggregate([
      {
        $lookup: {
          from: "foods",
          localField: "orderItems.foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      {
        $match: {
          "foodDetails.restaurantId": new mongoose.Types.ObjectId(
            req.restaurant._id
          ),
        },
      },
      {
        $group: {
          _id: "$customerId",
        },
      },
      {
        $count: "totalCustomers",
      },
    ]),
  ]);

  const netRevenue = orders[0]?.netRevenue || 0;
  const totalOrders = orders[0]?.totalOrders || 0;
  const totalCustomers = customers[0]?.totalCustomers || 0;
  const menuItems = foods;

  const data = {
    netRevenue,
    totalOrders,
    totalCustomers,
    menuItems,
  };

  return res
    .status(200)
    .json(new ApiResponce(200, data, "Overview metrics fetched successfully"));
});

// Get Recent Activity
const getRecentActivity = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const activities = await Order.aggregate([
    {
      $lookup: {
        from: "foods",
        localField: "orderItems.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $match: {
        "foodDetails.restaurantId": new mongoose.Types.ObjectId(
          req.restaurant._id
        ),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        action: {
          $concat: ["Order #", { $toString: "$_id" }, " ", "$orderStatus"],
        },
        time: {
          $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" },
        },
        icon: "📦",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponce(200, activities, "Recent activity fetched successfully")
    );
});

// Get Top Selling Items
const getTopSellingItems = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const items = await Order.aggregate([
    {
      $unwind: "$orderItems",
    },
    {
      $lookup: {
        from: "foods",
        localField: "orderItems.foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $unwind: "$foodDetails",
    },
    {
      $match: {
        "foodDetails.restaurantId": new mongoose.Types.ObjectId(
          req.restaurant._id
        ),
      },
    },
    {
      $group: {
        _id: "$orderItems.foodId",
        name: { $first: "$foodDetails.name" },
        sales: { $sum: "$orderItems.quantity" },
        revenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
        },
      },
    },
    {
      $sort: { sales: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        sales: 1,
        revenue: 1,
        icon: "🍽️",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponce(200, items, "Top selling items fetched successfully")
    );
});

// Get Food Feedback
const getFoodFeedback = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const feedback = await Feedback.aggregate([
    {
      $lookup: {
        from: "foods",
        localField: "foodId",
        foreignField: "_id",
        as: "foodDetails",
      },
    },
    {
      $unwind: "$foodDetails",
    },
    {
      $match: {
        "foodDetails.restaurantId": new mongoose.Types.ObjectId(
          req.restaurant._id
        ),
      },
    },
    {
      $group: {
        _id: "$foodId",
        name: { $first: "$foodDetails.name" },
        totalRating: { $sum: "$rating" },
        count: { $sum: 1 },
        comments: { $push: "$comment" },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        rating: {
          $cond: [
            { $gt: ["$count", 0] },
            { $round: [{ $divide: ["$totalRating", "$count"] }, 1] },
            0,
          ],
        },
        comment: { $arrayElemAt: ["$comments", 0] },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponce(200, feedback, "Food feedback fetched successfully"));
});

export {
  getMonthlyOrders,
  getIncomeExpense,
  getOrderStatus,
  getOverviewMetrics,
  getRecentActivity,
  getTopSellingItems,
  getFoodFeedback,
};
