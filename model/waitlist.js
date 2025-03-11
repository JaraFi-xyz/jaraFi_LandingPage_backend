const mongoose = require("mongoose");


const waitlistUserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
      minlength: [3, "Fullname must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    joinedAt: {  
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const WaitlistUser = mongoose.model("WaitlistUser", waitlistUserSchema);

module.exports = WaitlistUser;
