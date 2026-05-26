import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log("Testing SMTP connection with:");
console.log("  Host:", process.env.SMTP_HOST);
console.log("  Port:", process.env.SMTP_PORT);
console.log("  User:", process.env.SMTP_USER);

transporter.verify()
  .then(() => {
    console.log("✅ SMTP connection verified! Server is ready to send emails.");
  })
  .catch((err: any) => {
    console.error("❌ SMTP connection failed:", err.message);
  });
