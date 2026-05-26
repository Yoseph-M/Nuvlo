import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Review } from "../models/Review.ts";
import { IReview } from "../models/Review";

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({})
    .populate("propertyId", "title images")
    .populate("guestId", "name");
  res.json(reviews);
});

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id)
    .populate("propertyId", "title images")
    .populate("guestId", "name");

  if (review) {
    res.json(review);
  } else {
    res.status(404);
    throw new Error("Review not found");
  }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId, guestId, rating, comment, hostReply } = req.body as IReview;

  const review = await Review.create({
    propertyId,
    guestId,
    rating,
    comment,
    hostReply: hostReply || undefined
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error("Invalid review data");
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    review.hostReply = req.body.hostReply !== undefined ? req.body.hostReply : review.hostReply;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error("Review not found");
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    await review.remove();
    res.json({ message: "Review removed" });
  } else {
    res.status(404);
    throw new Error("Review not found");
  }
});

export { 
  getReviews, 
  getReviewById, 
  createReview, 
  updateReview, 
  deleteReview 
};
