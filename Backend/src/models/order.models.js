import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalOrderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    charges: {
      type: Number,
      default: 0,
    },
    orderItems: [
      {
        foodId: {
          type: Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
        // pricePerItem: {
        //   type: Number,
        //   required: true,
        //   min: 0,
        // },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    orderStatus: {
      type: String,
      // required: true,
      enum: [
        "Pending",
        "Order Placed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    deliveryAddress: {
      type: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Optional field
      },
    },
  },
  {
    timestamps: true,
  }
);
export const Order = mongoose.model("Order", orderSchema);
