import mongoose, { Schema, model, type Document, type Types } from "mongoose";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = "guest" | "host" | "admin";
export type AuthProvider = "local" | "google";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  authProvider: AuthProvider;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false },
    authProvider: {
      type: String,
      enum: ["local", "google"] satisfies AuthProvider[],
      default: "local",
    },
    role: {
      type: String,
      enum: ["guest", "host", "admin"] satisfies UserRole[],
      default: "guest",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false; // Social-auth users have no password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving (skip for social-auth users)
UserSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** Re-use existing model during HMR to avoid OverwriteModelError. */
export const User = (mongoose as any).models.User ?? model<IUser>("User", UserSchema, "user");
