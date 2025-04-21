import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodId: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    rating: {
      type: Number,
      // required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      // required: true,
      minlength: 5,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);
export const Feedback = mongoose.model("Feedback", feedbackSchema);
