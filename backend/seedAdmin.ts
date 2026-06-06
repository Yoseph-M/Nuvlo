import { auth } from "./auth.ts";
import connectDB from "./config/database.ts";

async function seed() {
  await connectDB();
  try {
    const user = await auth.api.signUpEmail({
      body: {
        email: "ab@gmail.com",
        password: "12345678",
        name: "Admin User",
        role: "admin",
      },
    });
    console.log("Admin user created successfully:", user);
  } catch (err: any) {
    if (err.message?.includes("already exists")) {
      console.log("Admin user already exists.");
    } else {
      console.error("Error creating admin user:", err);
    }
  }
  process.exit(0);
}

seed();
