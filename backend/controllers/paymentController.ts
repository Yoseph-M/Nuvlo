import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import Payment from "../models/Payment";
import { IPayment } from "../models/Payment";

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = asyncHandler(async (req: Request, res: Response) => {
  const payments = await Payment.find({})
    .populate("bookingId", "checkIn checkOut totalPrice")
    .populate("userId", "name email");
  res.json(payments);
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id)
    .populate("bookingId", "checkIn checkOut totalPrice")
    .populate("userId", "name email");

  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

// @desc    Create a payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId, userId, amountPaid, platformCommission, hostPayout, provider, transactionReference, status } = req.body as IPayment;

  const payment = await Payment.create({
    bookingId,
    userId,
    amountPaid,
    platformCommission,
    hostPayout,
    provider,
    transactionReference,
    status: status || "pending"
  });

  if (payment) {
    res.status(201).json(payment);
  } else {
    res.status(400);
    throw new Error("Invalid payment data");
  }
});

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private
const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    payment.amountPaid = req.body.amountPaid || payment.amountPaid;
    payment.platformCommission = req.body.platformCommission || payment.platformCommission;
    payment.hostPayout = req.body.hostPayout || payment.hostPayout;
    payment.provider = req.body.provider || payment.provider;
    payment.transactionReference = req.body.transactionReference || payment.transactionReference;
    payment.status = req.body.status || payment.status;

    const updatedPayment = await payment.save();
    res.json(updatedPayment);
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    await payment.remove();
    res.json({ message: "Payment removed" });
  } else {
    res.status(404);
    throw new Error("Payment not found");
  }
});

export { 
  getPayments, 
  getPaymentById, 
  createPayment, 
  updatePayment, 
  deletePayment 
};
