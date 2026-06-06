import mongoose, { Document, Schema } from "mongoose";

export interface ISystemSettings extends Document {
  bounceValidationEnabled: boolean;
  emailVerificationRequired: boolean;
}

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    bounceValidationEnabled: { type: Boolean, default: true },
    emailVerificationRequired: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// We ensure there's only one document for global settings
const SystemSettings =
  mongoose.models.SystemSettings ||
  mongoose.model<ISystemSettings>("SystemSettings", systemSettingsSchema);

export default SystemSettings;
