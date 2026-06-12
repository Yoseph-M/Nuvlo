import connectDB from "./config/database.ts";
import { User } from "./models/User.ts";

async function seed() {
  await connectDB();
  try {
    const existingAdmin = await User.findOne({ email: "ab@gmail.com" });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const admin = await User.create({
      email: "ab@gmail.com",
      authProvider: "local",
      name: "Admin User",
      role: "admin",
      isVerified: true,
    });
    console.log("Admin user created successfully:", admin);
  } catch (err: any) {
    console.error("Error creating admin user:", err);
  }
  process.exit(0);
}

seed();
