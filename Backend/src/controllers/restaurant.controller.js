import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { Restaurant } from "../models/restaurant.models.js";
import { Food } from "../models/food.models.js";
import { Order } from "../models/order.models.js";
import { Feedback } from "../models/feedback.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

const registerRestaurant = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Validate input fields
  if (
    [name, email, password, phone, address].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existUser = await Restaurant.findOne({
    $or: [{ email }, { phone }],
  });

  if (existUser) {
    throw new ApiError(
      409,
      "Restaurant already exists with this email or phone number"
    );
  }

  const restaurant = await Restaurant.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    address,
    isActive: true,
    image: "",
  });

  // Retrieve created user without sensitive information
  const createdRestaurant = await Restaurant.findById(restaurant._id).select(
    "-password -refreshToken"
  );

  if (!createdRestaurant) {
    throw new ApiError(500, "Failed to create restaurant");
  }

  return res
    .status(200)
    .json(
      new ApiResponce(200, restaurant, "Restaurant registered successfully")
    );
});

const generateAccessAndRefreshToken = async (restaurantId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new ApiError(404, "Restaurant not found");
    }

    const accessToken = restaurant.generateAccessToken();
    const refreshToken = restaurant.generateRefreshToken();

    restaurant.refreshToken = refreshToken;
    await restaurant.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went wrong while generating refresh and access token"
    );
  }
};

const loginRestaurant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  const isPasswordCorrect = await restaurant.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    restaurant._id
  );
  const loggedInRestaurant = await Restaurant.findById(restaurant._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponce(
        200,
        { restaurant: loggedInRestaurant, accessToken, refreshToken },
        "Restaurant logged in successfully"
      )
    );
});

const logoutRestaurant = asyncHandler(async (req, res) => {
  await Restaurant.findOneAndUpdate(
    req.restaurant._id,

    {
      $unset: { refreshToken: undefined },
    },

    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, "Restaurant logged out successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Refresh Token");
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const restaurant = await Restaurant.findById(decodeToken?._id);

    if (!restaurant) {
      throw new ApiError(401, "Unauthorized Restaurant");
    }

    if (incomingRefreshToken !== restaurant?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }

    const options = {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production", // Only secure in production
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(restaurant._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponce(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ isActive: true });
  return res
    .status(200)
    .json(
      new ApiResponce(200, restaurants, "Restaurants retrieved successfully")
    );
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id).lean();
  if (!restaurant) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Optionally fetch foods for this restaurant
  const foods = await Food.find({ restaurantId: id })
    .select("name price foodImage isAvailable category")
    .lean();

  const restaurantWithFoods = { ...restaurant, foods };

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        restaurantWithFoods,
        "Restaurant retrieved successfully"
      )
    );
});

const getRestaurantDetails = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponce(200, req.restaurant, "User details fetched successfully")
    );
});

const removeRestaurant = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Restaurant ID is required"));
  }
  const deleted = await Restaurant.findByIdAndDelete(_id);

  if (!deleted) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Restaurant not found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Restaurant deleted successfully"));
});

const updateRestaurantDetails = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  console.log("Request body:", { name, email, phone, address });
  console.log("File:", req.file);

  // Validate required fields
  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  // Validate user authentication
  if (!req.restaurant || !req.restaurant._id) {
    throw new ApiError(401, "Restaurant not authenticated or ID missing");
  }

  // Handle profile image upload if provided
  let image;
  const imageLocalPath = req.file?.path;
  if (imageLocalPath) {
    try {
      image = await uploadOnCloudinary(imageLocalPath);
      if (!image?.url) {
        throw new ApiError(
          500,
          "Cloudinary upload succeeded but no URL returned"
        );
      }
      console.log("Uploaded to Cloudinary:", image.url);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      throw new ApiError(500, `Image upload failed: ${uploadError.message}`);
    }
  }

  try {
    console.log("Updating user with ID:", req.restaurant._id);
    // console.log("Parsed address for update:", parsedAddress);

    const updateData = {
      name: name || req.restaurant.name,
      email: email || req.restaurant.email,
      phone: phone || req.restaurant.phone,
      address: address || req.restaurant.address, // Use parsed array
    };
    if (image) {
      updateData.image = image.url;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.restaurant._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedRestaurant) {
      console.log("No restaurant  found with ID:", req.restaurant._id);
      throw new ApiError(404, "Restaurant not found in database");
    }

    console.log("Restaurant updated successfully:", updatedRestaurant);
    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          updatedRestaurant,
          "Account details updated successfully"
        )
      );
  } catch (error) {
    console.error(
      "Database update error:",
      error.name,
      error.message,
      error.stack
    );
    throw new ApiError(500, error.message || "Failed to update user details");
  }
});

const getSalesReport = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  try {
    const sales = await Order.aggregate([
      // Unwind orderItems
      {
        $unwind: {
          path: "$orderItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup food details
      {
        $lookup: {
          from: "foods",
          localField: "orderItems.foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      // Unwind foodDetails
      {
        $unwind: {
          path: "$foodDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Match restaurant
      {
        $match: {
          "foodDetails.restaurantId": new mongoose.Types.ObjectId(
            req.restaurant._id
          ),
          orderStatus: "Delivered", // Only count completed orders
        },
      },
      // Group by date
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalOrderAmount" },
        },
      },
      // Project final structure
      {
        $project: {
          date: "$_id",
          totalOrders: 1,
          totalRevenue: 1,
          _id: 0,
        },
      },
      // Sort by date descending
      {
        $sort: { date: -1 },
      },
    ]);

    if (!sales || sales.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponce(200, [], "No sales data found for this restaurant")
        );
    }

    console.log("Sales data found:", sales.length);
    console.log("Sample sales:", sales[0] || "No sales");

    return res
      .status(200)
      .json(new ApiResponce(200, sales, "Sales report fetched successfully"));
  } catch (error) {
    console.error("Error in getSalesReport:", error);
    throw new ApiError(500, "Failed to fetch sales report", error.message);
  }
});

const getFoodPerformance = asyncHandler(async (req, res) => {
  if (!req.restaurant?._id) {
    throw new ApiError(401, "Unauthorized: Restaurant not authenticated");
  }

  try {
    // Fetch all foods for the restaurant
    const foods = await Food.find({ restaurantId: req.restaurant._id }).select(
      "_id name price feedback"
    );

    // Aggregate order data
    const orders = await Order.aggregate([
      // Unwind orderItems
      {
        $unwind: {
          path: "$orderItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Lookup food details
      {
        $lookup: {
          from: "foods",
          localField: "orderItems.foodId",
          foreignField: "_id",
          as: "foodDetails",
        },
      },
      // Unwind foodDetails
      {
        $unwind: {
          path: "$foodDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Match restaurant
      {
        $match: {
          "foodDetails.restaurantId": new mongoose.Types.ObjectId(
            req.restaurant._id
          ),
          orderStatus: "Delivered",
        },
      },
      // Group by foodId
      {
        $group: {
          _id: "$orderItems.foodId",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$orderItems.totalPrice" },
        },
      },
    ]);

    // Combine food data with order data
    const performanceData = await Promise.all(
      foods.map(async (food) => {
        const orderData = orders.find(
          (order) => order._id?.toString() === food._id.toString()
        ) || {
          totalOrders: 0,
          totalRevenue: 0,
        };

        // Calculate average rating
        let averageRating = null;
        if (food.feedback && food.feedback.length > 0) {
          const feedback = await Feedback.find({
            _id: { $in: food.feedback },
          }).exec(); // Execute query
          const ratings = feedback
            .map((fb) => fb.rating)
            .filter((r) => r != null);
          averageRating =
            ratings.length > 0
              ? (
                  ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                ).toFixed(1)
              : null;
        }

        return {
          foodId: food._id,
          name: food.name,
          totalOrders: orderData.totalOrders,
          totalRevenue: orderData.totalRevenue || 0,
          averageRating,
        };
      })
    );

    if (!performanceData || performanceData.length === 0) {
      return res
        .status(200)
        .json(new ApiResponce(200, [], "No food performance data found"));
    }

    console.log("Food performance data found:", performanceData.length);
    console.log("Sample performance:", performanceData[0] || "No data");

    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          performanceData,
          "Food performance fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error in getFoodPerformance:", error);
    throw new ApiError(500, "Failed to fetch food performance", error.message);
  }
});

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000);

  // Pad with leading zeros if necessary to ensure 6 digits
  return otp.toString().padStart(6, "0");
};

// Request OTP Controller
const requestOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Find user by email
  const restaurant = await Restaurant.findOne({ email });

  // Check if user exists
  if (!restaurant) {
    throw new ApiError(404, "No account associated with this email found");
  }

  try {
    // Generate OTP
    const otp = generateOTP();

    // Hash the OTP before saving (for security)
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Save OTP and expiration
    restaurant.resetOTP = hashedOTP;
    restaurant.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: restaurant.email,
      subject: "Password Reset OTP for Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">Password Reset Code</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hello ${restaurant.name || "Restaurant"},
            </p>
            
            <p style="color: #666; line-height: 1.6;">
               We received a request to reset the password for your QuickBites account. Please use the OTP below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="
                display: inline-block; 
                padding: 15px 30px; 
                background-color: #f0f0f0; 
                border: 1px dashed #999;
                border-radius: 5px;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 5px;
              ">${otp}</div>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              This code will expire in 10 minutes for security reasons.
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              If you did not request a password reset, you can safely ignore this email.
            </p>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} QuickBites
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with success (don't send actual OTP in response for security)
    return res
      .status(200)
      .json(
        new ApiResponce(
          200,
          { email: restaurant.email },
          "OTP sent to your email successfully"
        )
      );
  } catch (error) {
    // Remove OTP if email sending fails
    restaurant.resetOTP = undefined;
    restaurant.resetOTPExpires = undefined;
    await user.save();

    throw new ApiError(500, "Error sending OTP email", error);
  }
});

// Verify OTP and Reset Password Controller
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate inputs
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  try {
    // Find user with the email
    const restaurant = await Restaurant.findOne({
      email,
      resetOTPExpires: { $gt: new Date() },
    });

    // Check if user exists and OTP hasn't expired
    if (!restaurant || !restaurant.resetOTP) {
      throw new ApiError(400, "Invalid request or OTP expired");
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, restaurant.resetOTP);
    if (!isValidOTP) {
      throw new ApiError(400, "Invalid OTP");
    }

    // Don't clear OTP yet since we'll need it for the reset password step

    // Respond with success
    return res
      .status(200)
      .json(
        new ApiResponce(200, { verified: true }, "OTP verified successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Error verifying OTP", error);
  }
});

// Modify your existing verifyOTPAndResetPassword to handle the final step
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }

  const restaurant = await Restaurant.findOne({
    email,
    resetOTPExpires: { $gt: new Date() },
  });

  if (!restaurant || !restaurant.resetOTP) {
    throw new ApiError(400, "Invalid request or OTP expired");
  }

  const isValidOTP = await bcrypt.compare(otp, restaurant.resetOTP);
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid OTP");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Use updateOne to avoid pre-save hook
  await Restaurant.updateOne(
    { _id: restaurant._id },
    {
      $set: { password: hashedPassword },
      $unset: { resetOTP: "", resetOTPExpires: "" },
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponce(
        200,
        { message: "Password reset successful" },
        "Password has been reset successfully"
      )
    );
});

export {
  getAllRestaurants,
  getRestaurantById,
  registerRestaurant,
  loginRestaurant,
  logoutRestaurant,
  removeRestaurant,
  refreshToken,
  getRestaurantDetails,
  updateRestaurantDetails,
  getSalesReport,
  getFoodPerformance,
  requestOTP,
  verifyOTP,
  resetPassword,
};
