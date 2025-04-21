import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { Feedback } from "../models/feedback.models.js";
import { User } from "../models/user.models.js";
import { Food } from "../models/food.models.js";
import { Order } from "../models/order.models.js";
import mongoose from "mongoose";

const createFeedback = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { rating, review } = req.body;
  const { foodId } = req.body;

  try {
    const previousOrder = await Order.findOne({
      customerId: req.user._id,
      // "orderItems.foodId": req.body._id,
      orderItems: { $elemMatch: { foodId: foodId } },
      orderStatus: "Delivered",
    });

    if (!previousOrder) {
      throw new ApiError(
        400,
        "You can only give feedback on foods you have previously ordered and received."
      );
    }

    const existingFeedback = await Feedback.findOne({
      customerId: req.user._id,
      foodId: foodId,
    });

    if (existingFeedback) {
      throw new ApiError(
        400,
        "You have already given feedback for this food item."
      );
    }

    const feedback = await Feedback.create({
      customerId: req.user._id,
      // foodId: req.params.id,
      foodId: foodId,
      rating,
      review,
    });

    console.log(feedback);

    await Food.findByIdAndUpdate(
      foodId,
      { $push: { feedback: feedback._id } },
      { new: true }
    );
    console.log(feedback._id);

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate({ path: "customerId", select: "name profileImage" })
      .populate({ path: "foodId", select: "name description price" });

    return res
      .status(201)
      .json(
        new ApiResponce(
          201,
          populatedFeedback,
          "Feedback Recieved Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to create feedback", error);
  }
});

const getFeedback = asyncHandler(async (req, res) => {
  // Ensure restaurant is authenticated
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  try {
    const feedback = await Feedback.aggregate([
      // Step 1: Lookup food details to get restaurantId
      {
        $lookup: {
          from: "foods", // Adjust to match your Food collection name
          localField: "foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      // Step 2: Unwind foodDetails to filter by restaurantId
      {
        $unwind: {
          path: "$foodDetails",
          preserveNullAndEmptyArrays: false, // Exclude feedback with no matching food
        },
      },
      // Step 3: Match feedback where food belongs to the authenticated restaurant
      {
        $match: {
          "foodDetails.restaurantId": new mongoose.Types.ObjectId(
            req.restaurant._id
          ),
        },
      },
      // Step 4: Lookup customer details
      {
        $lookup: {
          from: "users", // Adjust to match your User collection name
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      // Step 5: Unwind customerDetails for easier projection
      {
        $unwind: {
          path: "$customerDetails",
          preserveNullAndEmptyArrays: true, // Allow feedback with no customer details
        },
      },
      // Step 6: Lookup food details again for population
      {
        $lookup: {
          from: "foods",
          localField: "foodId",
          foreignField: "_id",
          as: "foodIdPopulated",
        },
      },
      // Step 7: Unwind foodIdPopulated
      {
        $unwind: {
          path: "$foodIdPopulated",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Step 8: Project the final structure
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          customerId: {
            _id: "$customerDetails._id",
            name: "$customerDetails.name",
            profileImage: "$customerDetails.profileImage",
            email: "$customerDetails.email",
          },
          foodId: {
            _id: "$foodIdPopulated._id",
            name: "$foodIdPopulated.name",
            foodImage: "$foodIdPopulated.foodImage",
          },
        },
      },
      // Step 9: Sort by createdAt descending
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!feedback || feedback.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponce(
            200,
            [],
            "No feedback found for this restaurant's food items"
          )
        );
    }

    console.log(
      "Feedback found for restaurant",
      req.restaurant._id,
      ":",
      feedback.length
    );
    console.log("Sample feedback:", feedback[0] || "No feedback");

    return res
      .status(200)
      .json(new ApiResponce(200, feedback, "Feedback fetched successfully"));
  } catch (error) {
    console.error("Error in getFeedback:", error);
    throw new ApiError(500, "Failed to get feedback", error.message);
  }
});

export { createFeedback, getFeedback };
