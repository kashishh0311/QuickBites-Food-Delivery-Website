import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      match: /^\+?[1-9]\d{1,14}$/,
      unique: true,
      maxlength: 10,
    },
    address: [
      {
        type: {
          type: String,
          enum: ["Home", "Work", "Other"],
          default: "Home",
        },
        details: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    // address: {
    //   type: String,
    //   required: true,
    // },
    profileImage: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    // resetPasswordToken: {
    //   type: String,
    //   default: null,
    // },
    // resetPasswordExpires: {
    //   type: Date,
    //   default: null,
    // },

    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

// hashPassword
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      phone: this.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
