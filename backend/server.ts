import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes.ts";
import propertyRoutes from "./routes/properties.ts";
import bookingRoutes from "./routes/bookings.ts";
import paymentRoutes from "./routes/payment.ts";
import reviewRoutes from "./routes/review.ts";
import messageRoutes from "./routes/message.ts";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS & Security Middleware (must run before Better Auth)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
      ].filter(Boolean);

      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Connect to database
connectDB();

// Custom registration route with ZeroBounce
app.use("/api/auth", authRoutes);

// Better Auth catch-all handler (Express 5 syntax)
app.all("/api/auth/{*splat}", toNodeHandler(auth));

// Body parsing middleware (must run AFTER Better Auth catch-all)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Nuvlo API is running..." });
});

// API routes
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
