import mongoose, { Schema, model, type Document, type Types } from "mongoose";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = "guest" | "host" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
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
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["guest", "host", "admin"] satisfies UserRole[],
      default: "guest",
    },
  },
  { timestamps: true },
);

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** Re-use existing model during HMR to avoid OverwriteModelError. */
export const User = (mongoose as any).models.User ?? model<IUser>("User", UserSchema);
