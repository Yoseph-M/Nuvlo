import { Schema, model, models, type Document, type Types } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = "guest" | "host";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
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
    role: {
      type: String,
      enum: ["guest", "host"] satisfies UserRole[],
      default: "guest",
    },
  },
  { timestamps: true },
);

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** Re-use existing model during HMR to avoid OverwriteModelError. */
export const User = models.User ?? model<IUser>("User", UserSchema);
