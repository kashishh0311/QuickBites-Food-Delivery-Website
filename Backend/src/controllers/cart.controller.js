import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.models.js";
import { Food } from "../models/food.models.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const addToCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { _id, quantity = 1 } = req.body;
  if (!_id) throw new ApiError(400, "Food ID is required");
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  try {
    console.log("Fetching food with ID:", _id);
    const food = await Food.findById(_id);
    if (!food || !food.isAvailable) {
      throw new ApiError(404, "Food not found or not available");
    }

    if (food.stock < quantity) {
      throw new ApiError(400, "Requested quantity exceeds available stock");
    }

    console.log("Fetching cart for user:", req.user._id);
    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        customerId: req.user._id,
        items: [],
        totalCartAmount: 0,
      });
    }

    const existingItem = cart.items.find((item) =>
      item.foodId.equals(food._id)
    );

    if (existingItem) {
      throw new ApiError(400, "Food already exists in cart");
    }

    cart.items.push({
      foodId: food._id,
      quantity: quantity,
      totalPrice: food.price * quantity,
    });

    cart.totalCartAmount += food.price * quantity;

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponce(200, populatedCart, "Food added to cart successfully")
      );
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to add food to cart", error);
  }
});

const getCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: "items.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    return res
      .status(200)
      .json(new ApiResponce(200, cart, "Cart fetched successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to get cart", error);
  }
});

const clearCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    cart.items = [];
    cart.totalCartAmount = 0;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    return res
      .status(200)
      .json(new ApiResponce(200, populatedCart, "Cart cleared successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to clear cart", error);
  }
});

const updateQuantity = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { _id, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: "items.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const food = await Food.findById(_id);
    if (!food || !food.isAvailable) {
      throw new ApiError(404, "Food not found or not available");
    }

    if (food.stock < quantity) {
      throw new ApiError(400, "Requested quantity exceeds available stock");
    }

    const item = cart.items.find((item) => item.foodId.equals(food._id));

    if (!item) {
      throw new ApiError(404, "Item not found in cart");
    }

    if (quantity <= 0) {
      cart.items.splice(cart.items.indexOf(item), 1);
      await cart.save();
      return res
        .status(200)
        .json(
          new ApiResponce(200, cart, "Item removed from cart successfully")
        );
    }

    const priceDifference = food.price * quantity - item.totalPrice;
    item.quantity = quantity;
    item.totalPrice = food.price * quantity;
    cart.totalCartAmount += priceDifference;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponce(200, updatedCart, "Item quantity updated successfully")
      );
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to update item quantity", error);
  }
});

const foodExistsInCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate({
      path: "items.foodId",
      select: "name price foodImage isAvailable restaurantId",
      populate: {
        path: "restaurantId",
        select: "name",
      },
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const { foodId } = req.body;

    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      throw new ApiError(404, "Food not found or not available");
    }

    const item = cart.items.find((item) => item.foodId.equals(foodId));

    return res
      .status(200)
      .json(new ApiResponce(200, item, "Item check completed successfully"));
  } catch (error) {
    console.error("Detailed error:", error);
    throw new ApiError(500, "Failed to check food in cart", error);
  }
});

export { addToCart, getCart, clearCart, updateQuantity, foodExistsInCart };
