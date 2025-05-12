import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Food } from "../models/food.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { Feedback } from "../models/feedback.models.js";

import mongoose from "mongoose";

// Add Food
const addFood = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const { name, description, price, category, isAvailable, ingredients } =
    req.body;

  if (
    [name, description, price, category, isAvailable].some(
      (field) => field?.trim() === ""
    ) ||
    !ingredients
  ) {
    throw new ApiError(400, "All fields are required, including ingredients");
  }

  const existfood = await Food.findOne({
    name,
    restaurantId: req.restaurant._id,
  });
  if (existfood) {
    throw new ApiError(409, "Food already exists with this name");
  }

  // Convert comma-separated ingredients string to array
  const ingredientsArray = ingredients
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  // Handle food image upload
  const foodImageLocalPath = req.file?.path;
  let foodImage;
  if (foodImageLocalPath) {
    try {
      foodImage = await uploadOnCloudinary(foodImageLocalPath);
    } catch (uploadError) {
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  const food = await Food.create({
    restaurantId: req.restaurant._id,
    name,
    description,
    price,
    category,
    isAvailable,
    foodImage: foodImage?.url || "",
    ingredients: ingredientsArray,
  });

  const addedFood = await Food.findById(food._id);
  if (!addedFood) {
    if (foodImage?.public_id) {
      await deleteFromCloudinary(foodImage.public_id);
    }
    throw new ApiError(500, "Failed to add food");
  }

  return res
    .status(201)
    .json(new ApiResponce(201, addedFood, "Food added successfully"));
});

const updateFood = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const { _id, name, description, price, category, isAvailable, ingredients } =
    req.body;

  if (!_id) {
    throw new ApiError(400, "Food ID is required");
  }

  // Convert ingredients string to array if provided
  let ingredientsArray;
  if (ingredients) {
    ingredientsArray = ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }

  // Handle food image update
  const foodImageLocalPath = req.file?.path;
  let foodImage;
  if (foodImageLocalPath) {
    try {
      foodImage = await uploadOnCloudinary(foodImageLocalPath);
    } catch (uploadError) {
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  const existingFood = await Food.findOne({
    _id,
    restaurantId: req.restaurant._id,
  });
  if (!existingFood) {
    throw new ApiError(404, "Food not found");
  }

  const updatedFoodImage = foodImage?.url || existingFood.foodImage;

  try {
    const food = await Food.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          description,
          price,
          category,
          isAvailable,
          foodImage: updatedFoodImage,
          ...(ingredientsArray && { ingredients: ingredientsArray }), // Update only if provided
        },
      },
      { new: true }
    );

    if (!food) {
      throw new ApiError(404, "Food not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, food, "Food details updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update food details");
  }
});

const deleteFood = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  const { _id } = req.body;

  try {
    const food = await Food.findOneAndDelete({
      _id,
      restaurantId: req.restaurant._id,
    });

    if (!food) {
      throw new ApiError(404, "Food not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, food, "Food deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete food");
  }
});

const getAllFood = asyncHandler(async (req, res) => {
  // const { restaurantId } = req.query || req.restaurant._id;

  let restaurantId;

  // For restaurant panel: use req.restaurant._id if authenticated
  if (req.restaurant?._id) {
    restaurantId = req.restaurant._id;
  }
  // For client side: use req.query.restaurantId if provided
  else if (req.query.restaurantId) {
    try {
      restaurantId = new mongoose.Types.ObjectId(req.query.restaurantId);
    } catch (error) {
      throw new ApiError(400, "Invalid restaurantId format");
    }
  }
  // If neither is provided, return empty or throw error (depending on use case)
  else {
    throw new ApiError(400, "Restaurant ID is required");
  }

  const matchStage = restaurantId
    ? { restaurantId: new mongoose.Types.ObjectId(restaurantId) }
    : {};

  try {
    const foods = await Food.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantId",
        },
      },
      {
        $unwind: {
          path: "$restaurantId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "feedback",
          foreignField: "_id",
          as: "feedbackDetails",
        },
      },
      {
        $addFields: {
          feedbackCount: { $size: "$feedbackDetails" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$feedbackDetails" }, 0] },
              then: { $avg: "$feedbackDetails.rating" },
              else: null,
            },
          },
          restaurantId: {
            $cond: {
              if: { $ne: ["$restaurantId", null] },
              then: {
                name: "$restaurantId.name",
                address: "$restaurantId.address",
              },
              else: {
                name: "Unknown",
                address: "N/A",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          foodImage: 1,
          category: 1,
          isAvailable: 1,
          ingredients: 1,
          restaurantId: {
            name: 1,
            address: 1,
          },
          averageRating: 1,
          feedbackCount: 1,
        },
      },
    ]);

    console.log("Foods found:", foods.length);
    console.log("Sample food:", foods.length > 0 ? foods[0] : "No foods");
    console.log("Response data length:", foods.length);

    return res
      .status(200)
      .json(new ApiResponce(200, foods, "Food items retrieved successfully"));
  } catch (error) {
    console.error("Error in getAllFood:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const getFoodByName = asyncHandler(async (req, res) => {
  const { name } = req.query; // Using query params
  const food = await Food.findOne({ name })
    .populate({
      path: "feedback",
      populate: { path: "customerId", select: "name" },
      select: "customerId rating review",
    })
    .populate("restaurantId", "name address"); // Populating restaurant information

  if (!food) {
    throw new ApiError(404, "Food not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, food, "Food Found Successfully"));
});

const getAllFoodByCategory = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const foods = await Food.find({ category }).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (foods.length === 0) {
    throw new ApiError(404, "No food found in this category");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, foods, "Foods Found Successfully"));
});

const getAllFoodByPrice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    const query = {};
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      query.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    const foods = await Food.find(query).populate({
      path: "feedback",
      populate: { path: "customerId", select: "name" },
      select: "customerId rating review",
    });

    if (foods.length === 0) {
      throw new ApiError(404, "No food found within this price range");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, foods, "Foods Found Successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to find food by price range", error);
  }
});

const getAllFoodByRating = asyncHandler(async (req, res) => {
  const { rating, restaurantId } = req.query;
  let matchStage = {};

  // Handle restaurantId if provided
  if (restaurantId) {
    try {
      matchStage.restaurantId = new mongoose.Types.ObjectId(restaurantId);
    } catch (error) {
      throw new ApiError(400, "Invalid restaurantId");
    }
  }

  // Handle rating filter if provided
  if (rating && rating !== "") {
    const targetRating = Number(rating);
    if (isNaN(targetRating) || targetRating < 1 || targetRating > 5) {
      throw new ApiError(400, "Please provide a valid rating between 1 and 5");
    }
    matchStage.avgRating = {
      $gte: targetRating - 0.5,
      $lte: targetRating + 0.5,
    };
  }

  try {
    const foods = await Food.aggregate([
      // Step 1: Match restaurantId if provided
      {
        $match: restaurantId ? { restaurantId: matchStage.restaurantId } : {},
      },
      // Step 2: Lookup feedback
      {
        $lookup: {
          from: "feedbacks",
          localField: "feedback",
          foreignField: "_id",
          as: "feedbackDetails",
        },
      },
      // Step 3: Lookup restaurant
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantDetails",
        },
      },
      // Step 4: Unwind restaurantDetails
      {
        $unwind: {
          path: "$restaurantDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Step 5: Calculate ratings and format restaurantId
      {
        $addFields: {
          feedbackCount: { $size: "$feedbackDetails" },
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: "$feedbackDetails" }, 0] },
              then: { $avg: "$feedbackDetails.rating" },
              else: null,
            },
          },
          restaurantId: {
            $cond: {
              if: { $ne: ["$restaurantDetails", null] },
              then: {
                name: "$restaurantDetails.name",
                address: "$restaurantDetails.address",
              },
              else: {
                name: "Unknown",
                address: "N/A",
              },
            },
          },
        },
      },
      // Step 6: Match rating if provided
      {
        $match:
          rating && rating !== "" ? { avgRating: matchStage.avgRating } : {},
      },
      // Step 7: Project fields
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          foodImage: 1,
          category: 1,
          isAvailable: 1,
          ingredients: 1,
          restaurantId: {
            name: 1,
            address: 1,
          },
          averageRating: "$avgRating",
          feedbackCount: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    console.log("Query:", { restaurantId, rating });
    console.log("Match stage:", matchStage);
    console.log("Foods found:", foods.length);
    console.log("Sample food:", foods.length > 0 ? foods[0] : "No foods");

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          foods,
          foods.length === 0
            ? "No food found for this criteria"
            : "Foods Found Successfully"
        )
      );
  } catch (error) {
    console.error("Error in getAllFoodByRating:", error);
    throw new ApiError(500, "Failed to find food by rating", error.message);
  }
});

const getAllFoodByAvailability = asyncHandler(async (req, res) => {
  const { isAvailable } = req.query;
  const available = isAvailable === "true"; // Convert string to boolean
  const foods = await Food.find({ isAvailable: available }).populate({
    path: "feedback",
    populate: { path: "customerId", select: "name" },
    select: "customerId rating review",
  });

  if (foods.length === 0) {
    throw new ApiError(404, "No food found with this availability");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, foods, "Foods Found Successfully"));
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = Food.schema.path("category").enumValues;

  if (!categories || categories.length === 0) {
    throw new ApiError(404, "Categories not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, categories, "Categories Found Successfully"));
});

const getAllFoodBySearch = asyncHandler(async (req, res) => {
  const { search } = req.body;

  if (!search || search.length < 2) {
    return res.json({ data: [] });
  }

  try {
    const food = await Food.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    })
      .populate({
        path: "feedback",
        populate: {
          path: "customerId",
          select: "name",
        },
        select: "customerId rating review",
      })
      .populate("restaurantId", "name"); // Populate restaurant name

    if (!food || food.length === 0) {
      return res
        .status(200)
        .json(new ApiResponce(200, [], "No food items found"));
    }

    return res
      .status(200)
      .json(new ApiResponce(200, food, "Food Found Successfully"));
  } catch (error) {
    console.error("Search error:", error);
    throw new ApiError(500, "Failed to find food");
  }
});

const getFoodById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const foodWithRatings = await Food.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "feedbacks",
          localField: "feedback",
          foreignField: "_id",
          as: "feedbackDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "feedbackDetails.customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurantId",
        },
      },
      {
        $unwind: {
          path: "$restaurantId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          isAvailable: 1,
          foodImage: 1,
          ingredients: 1,
          restaurantId: {
            $cond: {
              if: { $ne: ["$restaurantId", null] },
              then: {
                name: "$restaurantId.name",
                address: "$restaurantId.address",
              },
              else: {
                name: "Unknown",
                address: "N/A",
              },
            },
          },
          feedbackDetails: {
            $map: {
              input: "$feedbackDetails",
              as: "fb",
              in: {
                _id: "$$fb._id",
                rating: "$$fb.rating",
                review: "$$fb.review",
                customer: {
                  $let: {
                    vars: {
                      customer: {
                        $arrayElemAt: [
                          "$customerDetails",
                          {
                            $indexOfArray: [
                              "$customerDetails._id",
                              "$$fb.customerId",
                            ],
                          },
                        ],
                      },
                    },
                    in: {
                      name: "$$customer.name",
                      profileImage: "$$customer.profileImage",
                    },
                  },
                },
              },
            },
          },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$feedbackDetails" }, 0] },
              then: { $round: [{ $avg: "$feedbackDetails.rating" }, 1] },
              else: null,
            },
          },
          totalRatings: { $size: "$feedbackDetails" },
        },
      },
    ]);

    if (!foodWithRatings || foodWithRatings.length === 0) {
      throw new ApiError(404, "Food not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponce(200, foodWithRatings[0], "Food retrieved successfully")
      );
  } catch (error) {
    console.error("Error in getFoodById:", error);
    throw new ApiError(
      500,
      error.name === "CastError"
        ? "Invalid food ID"
        : "Failed to retrieve food",
      error.message
    );
  }
});

export {
  addFood,
  updateFood,
  deleteFood,
  getAllFood,
  getFoodByName,
  getFoodById,
  getAllFoodBySearch,
  getAllCategory,
  getAllFoodByCategory,
  getAllFoodByPrice,
  getAllFoodByRating,
  getAllFoodByAvailability,
};
