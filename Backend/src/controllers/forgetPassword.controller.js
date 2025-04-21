// import { User } from "../models/user.models.js";
// import nodemailer from "nodemailer";
// import crypto from "crypto";
// import bcrypt from "bcrypt";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponce } from "../utils/ApiResponce.js";

// // Nodemailer Transporter Configuration
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Forget Password Controller
// export const forgetPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   // Validate email
//   if (!email) {
//     throw new ApiError(400, "Email is required");
//   }

//   // Find user by email
//   const user = await User.findOne({ email });

//   // Check if user exists
//   if (!user) {
//     throw new ApiError(404, "No account associated with this email found");
//   }

//   try {
//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");

//     // Hash the token before saving
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     // Save reset token and expiration
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
//     await user.save();

//     // Create reset link
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//     // Prepare email
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Password Reset for Your Account",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
//           <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
//             <h2 style="color: #333; text-align: center;">Password Reset Request</h2>

//             <p style="color: #666; line-height: 1.6;">
//               Hello ${user.username || "User"},
//             </p>

//             <p style="color: #666; line-height: 1.6;">
//               We received a request to reset the password for your account. If you did not make this request, please ignore this email or contact support if you have concerns.
//             </p>

//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${resetLink}" style="
//                 display: inline-block;
//                 padding: 12px 24px;
//                 background-color: #4CAF50;
//                 color: white;
//                 text-decoration: none;
//                 border-radius: 5px;
//                 font-weight: bold;
//               ">Reset Your Password</a>
//             </div>

//             <p style="color: #666; line-height: 1.6;">
//               This link will expire in 15 minutes for security reasons. If the button doesn't work, copy and paste this link into your browser:
//             </p>

//             <p style="word-break: break-all; color: #888;">
//               ${resetLink}
//             </p>

//             <p style="color: #666; font-size: 12px; margin-top: 20px;">
//               If you did not request a password reset, you can safely ignore this email.
//             </p>

//             <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
//               © ${new Date().getFullYear()} Your Company Name
//             </div>
//           </div>
//         </div>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     // Respond with success
//     return res
//       .status(200)
//       .json(
//         new ApiResponce(
//           200,
//           { message: "Password reset link sent to your email." },
//           "Password reset link sent successfully"
//         )
//       );
//   } catch (error) {
//     // Remove reset token if email sending fails
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     throw new ApiError(500, "Error sending password reset email", error);
//   }
// });

// // Reset Password Controller
// export const resetPassword = asyncHandler(async (req, res) => {
//   const { token, newPassword } = req.body;

//   if (!token) {
//     throw new ApiError(400, "Reset token is required");
//   }
//   if (!newPassword) {
//     throw new ApiError(400, "New password is required");
//   }

//   try {
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: new Date() },
//     });

//     if (!user) {
//       throw new ApiError(400, "Invalid or expired reset token");
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Use updateOne to avoid pre-save hook
//     await User.updateOne(
//       { _id: user._id },
//       {
//         $set: { password: hashedPassword },
//         $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
//       }
//     );

//     return res
//       .status(200)
//       .json(
//         new ApiResponce(
//           200,
//           { message: "Password reset successful" },
//           "Password reset completed successfully"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(500, "Error resetting password", error);
//   }
// });

// export default {
//   forgetPassword,
//   resetPassword,
// };
import { User } from "../models/user.models.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

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
export const requestOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    throw new ApiError(404, "No account associated with this email found");
  }

  try {
    // Generate OTP
    const otp = generateOTP();

    // Hash the OTP before saving (for security)
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    // Save OTP and expiration
    user.resetOTP = hashedOTP;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP for Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center;">Password Reset Code</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Hello ${user.name || "User"},
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
          { email: user.email },
          "OTP sent to your email successfully"
        )
      );
  } catch (error) {
    // Remove OTP if email sending fails
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    throw new ApiError(500, "Error sending OTP email", error);
  }
});

// Verify OTP and Reset Password Controller
export const verifyOTP = asyncHandler(async (req, res) => {
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
    const user = await User.findOne({
      email,
      resetOTPExpires: { $gt: new Date() },
    });

    // Check if user exists and OTP hasn't expired
    if (!user || !user.resetOTP) {
      throw new ApiError(400, "Invalid request or OTP expired");
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.resetOTP);
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
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }

  const user = await User.findOne({
    email,
    resetOTPExpires: { $gt: new Date() },
  });

  if (!user || !user.resetOTP) {
    throw new ApiError(400, "Invalid request or OTP expired");
  }

  const isValidOTP = await bcrypt.compare(otp, user.resetOTP);
  if (!isValidOTP) {
    throw new ApiError(400, "Invalid OTP");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Use updateOne to avoid pre-save hook
  await User.updateOne(
    { _id: user._id },
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

export default {
  requestOTP,
  verifyOTP,
  resetPassword,
};
