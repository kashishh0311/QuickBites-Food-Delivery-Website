import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  deleteUserAccount,
  changePassword,
  refreshToken,
} from "../controllers/user.controller.js";
import {
  addToCart,
  getCart,
  clearCart,
  updateQuantity,
  foodExistsInCart,
} from "../controllers/cart.controller.js";
import {
  createOrder,
  deleteOrder,
  getOrderByUserId,
  getOrderById,
  updateOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import {
  getAllFood,
  getAllFoodBySearch,
  getFoodById,
  getAllCategory,
  getAllFoodByCategory,
  getAllFoodByPrice,
  getAllFoodByRating,
  getAllFoodByAvailability,
  getFoodByName,
} from "../controllers/food.controller.js";
import {
  createStripeCheckoutSession,
  verifyStripePayment,
  getPaymentByOrderId,
  updatePaymentMethod,
  verifyCashOnDeliveryPayment,
} from "../controllers/payment.controller.js";
import { createFeedback } from "../controllers/feedback.controller.js";
import {
  requestOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/forgetPassword.controller.js";
import {
  getAllRestaurants,
  getRestaurantById,
} from "../controllers/restaurant.controller.js"; // New controller import
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// User Routes
router.route("/register").post(upload.single("profileImage"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(varifyJWT, logoutUser);
router.route("/getUserDetails").get(varifyJWT, getUserDetails);
router
  .route("/updateUserDetails")
  .put(varifyJWT, upload.single("profileImage"), updateUserDetails);
router.route("/deleteUserAccount").delete(varifyJWT, deleteUserAccount);
router.route("/changePassword").post(changePassword);
router.route("/refreshToken").post(refreshToken);

// Cart Routes
router.route("/addToCart").post(varifyJWT, addToCart);
router.route("/getCart").get(varifyJWT, getCart);
router.route("/clearCart").delete(varifyJWT, clearCart);
router.route("/updateQuantity").put(varifyJWT, updateQuantity);
router.route("/foodExistsInCart").post(varifyJWT, foodExistsInCart);

// Order Routes
router.route("/createOrder").post(varifyJWT, createOrder);
router.route("/deleteOrder").delete(varifyJWT, deleteOrder);
router.route("/getOrderByUserId").get(varifyJWT, getOrderByUserId);
router.route("/getOrderById").post(varifyJWT, getOrderById);
router.route("/updateOrder").put(varifyJWT, updateOrder);
router.route("/updateOrderStatus").put(varifyJWT, updateOrderStatus);

// Food Routes
router.route("/getAllFood").get(getAllFood);
router.route("/getAllFoodBySearch").post(getAllFoodBySearch);
router.route("/getFoodById/:id").get(getFoodById);
router.route("/getAllCategory").get(getAllCategory);
router.route("/getAllFoodByCategory").get(getAllFoodByCategory);
router.route("/getAllFoodByPrice").get(getAllFoodByPrice);
router.route("/getAllFoodByRating").get(getAllFoodByRating);
router.route("/getAllFoodByAvailability").get(getAllFoodByAvailability);
router.route("/getFoodByName").get(getFoodByName);

// Feedback Routes
router.route("/createFeedback").post(varifyJWT, createFeedback);

// Payment Routes
router
  .route("/createStripeCheckoutSession")
  .post(varifyJWT, createStripeCheckoutSession);
router.route("/verifyStripePayment").post(varifyJWT, verifyStripePayment);
router.route("/getPaymentByOrderId").post(varifyJWT, getPaymentByOrderId);
router.route("/updatePaymentMethod").put(varifyJWT, updatePaymentMethod);
router
  .route("/verifyCashOnDeliveryPayment")
  .post(varifyJWT, verifyCashOnDeliveryPayment);

// Password Reset Routes
router.route("/requestOTP").post(requestOTP);
router.route("/verifyOTP").post(verifyOTP);
router.route("/resetPassword").post(resetPassword);

// Restaurant Routes (New)
router.route("/restaurants").get(getAllRestaurants);
router.route("/restaurants/:id").get(getRestaurantById);

export default router;
