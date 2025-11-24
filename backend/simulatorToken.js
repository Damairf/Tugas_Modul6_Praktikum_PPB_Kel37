import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const token = jwt.sign(
  { id: "simulator", role: "system" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

console.log("SIMULATOR TOKEN:", token);
