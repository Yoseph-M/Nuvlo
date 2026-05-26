import mongoose, { Schema, model, type Document, type Types } from "mongoose";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IMessage extends Document {
  _id: Types.ObjectId;
  bookingId?: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const MessageSchema = new Schema<IMessage>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Compound index for efficiently fetching conversation threads
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Message =
  (mongoose as any).models.Message ?? model<IMessage>("Message", MessageSchema);
