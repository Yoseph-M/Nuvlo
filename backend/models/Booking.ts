import mongoose, { Schema, model, type Document, type Types } from "mongoose";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface IBooking extends Document {
  _id: Types.ObjectId;
  propertyId: Types.ObjectId;
  guestId: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const BookingSchema = new Schema<IBooking>(
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
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ] satisfies BookingStatus[],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Validate that check-out is after check-in
BookingSchema.pre("validate", function () {
  if (this.checkOut <= this.checkIn) {
    throw new Error("Check-out must be after check-in.");
  }
});

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Booking =
  (mongoose as any).models.Booking ?? model<IBooking>("Booking", BookingSchema);
