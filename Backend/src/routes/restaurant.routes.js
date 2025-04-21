import { Router } from "express";
import { varifyrestaurantJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  getRestaurantDetails,
  loginRestaurant,
  logoutRestaurant,
  registerRestaurant,
  updateRestaurantDetails,
  getFoodPerformance,
  getSalesReport,
} from "../controllers/restaurant.controller.js";
import {
  getAllFood,
  getAllCategory,
  updateFood,
  deleteFood,
  addFood,
  getAllFoodBySearch,
} from "../controllers/food.controller.js";

import {
  updateOrderStatus,
  getOrderByUserId,
  getAllOrdersOfRestaurant,
  getOrdersByStatus,
  getAllStatus,
} from "../controllers/order.controller.js";

import { getFeedback } from "../controllers/feedback.controller.js";

import {
  getMonthlyOrders,
  getIncomeExpense,
  getOrderStatus,
  getOverviewMetrics,
  getRecentActivity,
  getTopSellingItems,
  getFoodFeedback,
} from "../controllers/restaurantDashboard.controller.js";

const router = Router();

router
  .route("/getRestaurantDetails")
  .get(varifyrestaurantJWT, getRestaurantDetails);
router.route("/loginRestaurant").post(loginRestaurant);
router.route("/registerRestaurant").post(registerRestaurant);
router.route("/logoutRestaurant").post(varifyrestaurantJWT, logoutRestaurant);
router.route("/getAllFoods").get(varifyrestaurantJWT, getAllFood);
router.route("/getAllCategory").get(varifyrestaurantJWT, getAllCategory);
router
  .route("/updateFood")
  .put(varifyrestaurantJWT, upload.single("foodImage"), updateFood);
router.route("/deleteFood").delete(varifyrestaurantJWT, deleteFood);
router
  .route("/addFood")
  .post(varifyrestaurantJWT, upload.single("foodImage"), addFood);

router.route("/updateOrderStatus").put(varifyrestaurantJWT, updateOrderStatus);
router.route("/getOrderByUserId").get(varifyrestaurantJWT, getOrderByUserId);
router
  .route("/getAllOrdersOfRestaurant")
  .get(varifyrestaurantJWT, getAllOrdersOfRestaurant);
router.route("/getOrdersByStatus").get(varifyrestaurantJWT, getOrdersByStatus);
router.route("/getAllCategory").get(getAllCategory);
router.route("/getAllFoodBySearch").post(getAllFoodBySearch);
router.route("/getAllStatus").get(getAllStatus);

router.route("/getFeedback").get(varifyrestaurantJWT, getFeedback);

router.route("/monthly-orders").get(varifyrestaurantJWT, getMonthlyOrders);
router.route("/income-expense").get(varifyrestaurantJWT, getIncomeExpense);
router.route("/order-status").get(varifyrestaurantJWT, getOrderStatus);
router.route("/overview-metrics").get(varifyrestaurantJWT, getOverviewMetrics);
router.route("/recent-activity").get(varifyrestaurantJWT, getRecentActivity);
router.route("/top-selling-items").get(varifyrestaurantJWT, getTopSellingItems);
router.route("/food-feedback").get(varifyrestaurantJWT, getFoodFeedback);

router
  .route("/updateRestaurantDetails")
  .put(varifyrestaurantJWT, upload.single("image"), updateRestaurantDetails);

router.route("/getSalesReport").get(varifyrestaurantJWT, getSalesReport);
router
  .route("/getFoodPerformance")
  .get(varifyrestaurantJWT, getFoodPerformance);

// router.route("/getAllRestaurants").get(varifyrestaurantJWT, getAllRestaurants);

export default router;
