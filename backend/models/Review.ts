import mongoose, { Schema, model, type Document, type Types } from "mongoose";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IReview extends Document {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  guestId: Types.ObjectId;
  rating: number;
  comment: string;
  hostReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const ReviewSchema = new Schema<IReview>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    guestId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    hostReply: { type: String, trim: true },
  },
  { timestamps: true },
);

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Review =
  (mongoose as any).models.Review ?? model<IReview>("Review", ReviewSchema);
