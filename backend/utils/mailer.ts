import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "nulvo.bet@gmail.com",
    pass: process.env.SMTP_PASS || "jihmnmgjjqgtwvyf",
  },
});

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
) => {
  const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Nuvlo" <${process.env.FROM_EMAIL || "nulvo.bet@gmail.com"}>`,
    to: email,
    subject: "Verify Your Email Address - Nuvlo",
    html: `
      <div style="font-family: 'Outfit', 'Inter', sans-serif; background-color: #faf9f6; padding: 40px; color: #141414;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e0; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(20, 20, 20, 0.03);">
          <!-- Logo Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="font-size: 24px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">Nuvlo</span>
          </div>
          
          <h2 style="font-size: 20px; font-weight: 500; margin-bottom: 20px; text-align: center;">Welcome, ${name}!</h2>
          
          <p style="font-size: 14px; line-height: 1.6; color: #5a5a54; margin-bottom: 25px; text-align: center;">
            Thank you for creating an account on Nuvlo. To complete your registration and unlock your access, please verify your email address.
          </p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${verifyUrl}" style="display: inline-block; background-color: #141414; color: #faf9f6; text-decoration: none; padding: 12px 30px; font-size: 12px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 4px; transition: background-color 0.2s;">
              Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 12px; line-height: 1.6; color: #8a8a80; text-align: center; margin-bottom: 0;">
            Or copy and paste this link in your browser:
            <br />
            <a href="${verifyUrl}" style="color: #141414; text-decoration: underline; word-break: break-all;">${verifyUrl}</a>
          </p>
          
          <div style="margin-top: 40px; border-top: 1px solid #e5e5e0; padding-top: 20px; text-align: center; font-size: 11px; color: #8a8a80; letter-spacing: 0.05em;">
            &copy; ${new Date().getFullYear()} Nuvlo. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Could not send verification email. Please check SMTP settings.");
  }
};
