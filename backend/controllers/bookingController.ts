import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Booking } from "../models/Booking.ts";
import { IBooking } from "../models/Booking";

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({})
    .populate("propertyId", "title images")
    .populate("guestId", "name email")
    .populate("hostId", "name email");
  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate("propertyId", "title images")
    .populate("guestId", "name email")
    .populate("hostId", "name email");

  if (booking) {
    res.json(booking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId, guestId, checkIn, checkOut, totalPrice } = req.body as {
    propertyId: string;
    guestId: string;
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
    totalPrice: number;
  };

  const booking = await Booking.create({
    propertyId,
    guestId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    totalPrice,
  });

  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(400);
    throw new Error("Invalid booking data");
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.checkIn = req.body.checkIn ? new Date(req.body.checkIn) : booking.checkIn;
    booking.checkOut = req.body.checkOut ? new Date(req.body.checkOut) : booking.checkOut;
    booking.totalPrice = req.body.totalPrice || booking.totalPrice;
    booking.status = req.body.status || booking.status;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    await booking.remove();
    res.json({ message: "Booking removed" });
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

export { 
  getBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  deleteBooking 
};
