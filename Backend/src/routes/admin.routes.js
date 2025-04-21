import { Router } from "express";

import {
  addFood,
  updateFood,
  deleteFood,
  getAllFood,
  getFoodByName,
  getAllCategory,
  getAllFoodBySearch,
} from "../controllers/food.controller.js";
import {
  deleteUser,
  getAllUser,
  getUserById,
} from "../controllers/user.controller.js";
import {
  updateOrderStatus,
  getOrdersByStatus,
  getOrderByUserId,
  getAllOrders,
  getAllStatus,
} from "../controllers/order.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT, verifyAdminJWT } from "../middlewares/auth.middleware.js";
import {
  loginAdmin,
  adminLogout,
  fetchAdmin,
} from "../controllers/admin.controller.js";

import {
  removeRestaurant,
  getAllRestaurants,
} from "../controllers/restaurant.controller.js";

const router = Router();

router
  .route("/addFood")
  .post(verifyAdminJWT, upload.single("foodImage"), addFood);
router
  .route("/updateFood")
  .put(verifyAdminJWT, upload.single("foodImage"), updateFood);
router.route("/deleteFood").delete(verifyAdminJWT, deleteFood);
router.route("/deleteUser").delete(verifyAdminJWT, deleteUser);
router.route("/getAllFood").get(verifyAdminJWT, getAllFood);
router.route("/getAllUser").get(verifyAdminJWT, getAllUser);
router.route("/getFoodByName").post(getFoodByName);
router.route("/getUserById").post(getUserById);
router.route("/updateOrderStatus").put(verifyAdminJWT, updateOrderStatus);
router
  .route("/getOrderByUserId")
  .get(verifyAdminJWT, varifyJWT, getOrderByUserId);
router.route("/getAllOrders").get(verifyAdminJWT, getAllOrders);
router.route("/getOrdersByStatus").get(verifyAdminJWT, getOrdersByStatus);
router.route("/loginAdmin").post(loginAdmin);
router.route("/getAllCategory").get(getAllCategory);
router.route("/getAllFoodBySearch").post(getAllFoodBySearch);
router.route("/adminLogout").post(adminLogout);
router.route("/fetchAdmin").get(verifyAdminJWT, fetchAdmin);
router.route("/getAllStatus").get(getAllStatus);

router.route("/removeRestaurant").delete(verifyAdminJWT, removeRestaurant);
router.route("/getAllRestaurants").get(verifyAdminJWT, getAllRestaurants);
export default router;
