import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Message } from "../models/Message.ts";
import { IMessage } from "../models/Message";

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await Message.find({})
    .populate("senderId", "name email")
    .populate("receiverId", "name email")
    .sort({ createdAt: -1 });
  res.json(messages);
});

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private
const getMessageById = asyncHandler(async (req: Request, res: Response) => {
  const message = await Message.findById(req.params.id)
    .populate("senderId", "name email")
    .populate("receiverId", "name email");

  if (message) {
    res.json(message);
  } else {
    res.status(404);
    throw new Error("Message not found");
  }
});

// @desc    Create a message
// @route   POST /api/messages
// @access  Private
const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId, senderId, receiverId, message, isRead } = req.body as IMessage;

  const messageObj = await Message.create({
    bookingId: bookingId || undefined,
    senderId,
    receiverId,
    message,
    isRead: isRead || false
  });

  if (messageObj) {
    res.status(201).json(messageObj);
  } else {
    res.status(400);
    throw new Error("Invalid message data");
  }
});

// @desc    Update message
// @route   PUT /api/messages/:id
// @access  Private
const updateMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Message.findById(req.params.id);

  if (message) {
    message.message = req.body.message || message.message;
    message.isRead = req.body.isRead !== undefined ? req.body.isRead : message.isRead;
    message.receiverId = req.body.receiverId || message.receiverId;

    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } else {
    res.status(404);
    throw new Error("Message not found");
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Message.findById(req.params.id);

  if (message) {
    await message.remove();
    res.json({ message: "Message removed" });
  } else {
    res.status(404);
    throw new Error("Message not found");
  }
});

export { 
  getMessages, 
  getMessageById, 
  createMessage, 
  updateMessage, 
  deleteMessage 
};
