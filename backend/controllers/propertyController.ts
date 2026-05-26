import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Property } from "../models/Property.ts";
import { IProperty } from "../models/Property";

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req: Request, res: Response) => {
  const properties = await Property.find({});
  res.json(properties);
});

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});

// @desc    Create a property
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req: Request, res: Response) => {
  const { 
    hostId, 
    title, 
    description, 
    images, 
    pricePerNight, 
    rooms, 
    utilities, 
    location, 
    isVerifiedByAdmin, 
    availableDates 
  } = req.body as IProperty;

  const property = await Property.create({
    hostId,
    title,
    description,
    images,
    pricePerNight,
    rooms,
    utilities,
    location,
    isVerifiedByAdmin,
    availableDates
  });

  if (property) {
    res.status(201).json(property);
  } else {
    res.status(400);
    throw new Error("Invalid property data");
  }
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.images = req.body.images || property.images;
    property.pricePerNight = req.body.pricePerNight || property.pricePerNight;
    property.rooms = req.body.rooms || property.rooms;
    property.utilities = req.body.utilities || property.utilities;
    property.location = req.body.location || property.location;
    property.isVerifiedByAdmin = req.body.isVerifiedByAdmin !== undefined ? req.body.isVerifiedByAdmin : property.isVerifiedByAdmin;
    property.availableDates = req.body.availableDates || property.availableDates;

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id);

  if (property) {
    await property.remove();
    res.json({ message: "Property removed" });
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});

export { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty 
};
