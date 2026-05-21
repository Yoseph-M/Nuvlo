import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/nuvlo";

/**
 * Cached promise so hot-reloads in development don't open new connections.
 *
 * In production the module-level cache is sufficient.
 * In development Vite may re-import this file; the global cache prevents leaks.
 */
const g = globalThis as typeof globalThis & {
  __mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectDB(): Promise<typeof mongoose> {
  if (g.__mongoosePromise) return g.__mongoosePromise;

  g.__mongoosePromise = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  return g.__mongoosePromise;
}
