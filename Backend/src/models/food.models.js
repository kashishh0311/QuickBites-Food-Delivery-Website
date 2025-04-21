import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Punjabi",
        "South Indian",
        "North Indian",
        "Maharashtrian",
        "Bengali",
        "Gujarati",
        "Indo-Chinese",
        "Italian",
        "Middle Eastern",
        "French",
        "Chinese",
        "Mexican",
        "Spanish",
        "Australian",
        "Thai",
        "Canadian",
        "Venezuelan",
        "German",
        "Greek",
        "American",
        "Vietnamese",
        "Korean",
        "Latin American",
        "Japanese",
        "Fast Food",
        "Dessert",
        "Cold Drink",
      ],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    foodImage: {
      type: String,
      required: true,
      trim: true,
    },
    // rating: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Feedback",
    //   },
    // ],
    // review: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Feedback",
    //   },
    // ],
    // ingredients: [
    //   {
    //     type: String,
    //     required: true,
    //     trim: true,
    //   },
    // ],
    ingredients: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    feedback: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Food = mongoose.model("Food", foodSchema);
