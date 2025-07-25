import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userOwnerSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // We use Azure Storage Account/BLOB/Container
    },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MANAGER", "STAFF"],
      default: "STAFF",
      required: true,
    },
    
    // Reference to the currently active subscription instance for this user
    activeSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscription",
    },
    // Array of branches this user owns or manages
    ownedBranches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    assignedBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    index: true,
    },
    // Array of warehouses this user has access to
    warehouses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse"
        }
    ],
    contactInfo: {
        mobile: { type: String, trim: true },
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
          
        }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);



// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate a JWT access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a JWT refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const UserOwner = mongoose.model("UserOwner", userOwnerSchema);
