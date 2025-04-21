import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
    items: [
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
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalCartAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },

  {
    timestamps: true,
  }
);
export const Cart = mongoose.model("Cart", cartSchema);
