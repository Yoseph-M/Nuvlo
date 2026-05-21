import { Schema, model, models, type Document, type Types } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IPropertyUtilities {
  wifi: boolean;
  generator: boolean;
  waterTank: boolean;
  solarPower: boolean;
}

export interface IPropertyCoordinates {
  type: "Point";
  coordinates: [longitude: number, latitude: number];
}

export interface IPropertyLocation {
  city: string;
  area: string;
  address: string;
  coordinates: IPropertyCoordinates;
}

export interface IProperty extends Document {
  _id: Types.ObjectId;
  hostId: Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  pricePerNight: number;
  rooms: number;
  utilities: IPropertyUtilities;
  location: IPropertyLocation;
  isVerifiedByAdmin: boolean;
  availableDates: Date[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const PropertySchema = new Schema<IProperty>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one image is required.",
      },
    },
    pricePerNight: { type: Number, required: true, min: 0 },
    rooms: { type: Number, required: true, min: 1 },

    // Utilities tailored for Ethiopian infrastructure
    utilities: {
      wifi: { type: Boolean, default: false },
      generator: { type: Boolean, default: false },
      waterTank: { type: Boolean, default: false },
      solarPower: { type: Boolean, default: false },
    },

    // GeoJSON location with geospatial index
    location: {
      city: { type: String, required: true, trim: true },
      area: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: {
          type: [Number],
          required: true,
          validate: {
            validator: (v: number[]) => v.length === 2,
            message: "Coordinates must be [longitude, latitude].",
          },
        },
      },
    },

    isVerifiedByAdmin: { type: Boolean, default: false },
    availableDates: [{ type: Date }],
  },
  { timestamps: true },
);

// Enable geospatial queries (e.g. $near, $geoWithin)
PropertySchema.index({ "location.coordinates": "2dsphere" });

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

export const Property =
  models.Property ?? model<IProperty>("Property", PropertySchema);
