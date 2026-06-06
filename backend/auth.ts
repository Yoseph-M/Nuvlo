import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendVerificationEmail, sendPasswordResetEmail } from "./utils/mailer.ts";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/nuvlo";
const client = new MongoClient(mongoUri);
const db = client.db();

export const auth = betterAuth({
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "a-very-long-and-secure-secret-for-nuvlo-development-123456",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5001",
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
  ],
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
      const backendUrl = process.env.BETTER_AUTH_URL || "http://localhost:5001";
      const clientUrl = url.replace(backendUrl, frontendUrl);
      
      console.log("\n" + "=".repeat(60));
      console.log(`🔑 PASSWORD RESET LINK FOR: ${user.email}`);
      console.log(`🔗 Link: ${clientUrl}`);
      console.log("=".repeat(60) + "\n");

      try {
        await sendPasswordResetEmail(user.email, user.name || user.email, clientUrl);
      } catch (err: any) {
        console.warn(`⚠️ SMTP Failed to send reset email: ${err.message}. (Link was printed to console)`);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
      const token = new URL(url).searchParams.get("token") || "";
      const clientUrl = `${frontendUrl}/verify-email?token=${token}`;

      console.log("\n" + "=".repeat(60));
      console.log(`📧 EMAIL VERIFICATION LINK FOR: ${user.email}`);
      console.log(`🔗 Link: ${clientUrl}`);
      console.log("=".repeat(60) + "\n");

      try {
        await sendVerificationEmail(user.email, user.name || user.email, clientUrl);
      } catch (err: any) {
        console.warn(`⚠️ SMTP Failed to send verification email: ${err.message}. (Link was printed to console)`);
      }
    },
    sendOnSignUp: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "guest" },
    },
  },
});
