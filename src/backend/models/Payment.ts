import { Schema, model, models, type Document, type Types } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaymentProvider = "Telebirr" | "Chapa" | "CBE Birr";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  amountPaid: number;
  platformCommission: number;
  hostPayout: number;
  provider: PaymentProvider;
  transactionReference: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amountPaid: { type: Number, required: true, min: 0 },
    platformCommission: { type: Number, required: true, min: 0 },
    hostPayout: { type: Number, required: true, min: 0 },
    provider: {
      type: String,
      enum: [
        "Telebirr",
        "Chapa",
        "CBE Birr",
      ] satisfies PaymentProvider[],
      required: true,
    },
    transactionReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "success",
        "failed",
        "refunded",
      ] satisfies PaymentStatus[],
      default: "pending",
    },
  },
  { timestamps: true },
);

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Payment =
  models.Payment ?? model<IPayment>("Payment", PaymentSchema);
