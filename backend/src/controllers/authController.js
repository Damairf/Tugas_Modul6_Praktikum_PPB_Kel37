// backend/controllers/authController.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_env";
const JWT_EXPIRES_IN = "7d"; // sesuaikan

// For demo: credentials come from env (simple). Anda bisa ganti ke supabase auth.
const ADMIN_USER = process.env.AUTH_USER || "admin";
const ADMIN_PASS = process.env.AUTH_PASS || "password";

export const AuthController = {
  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // demo check; ganti dengan supabase auth jika ingin
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const payload = { id: username, username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({ token, user: payload });
    }

    return res.status(401).json({ error: "Invalid credentials" });
  },

  async me(req, res) {
    // authMiddleware already sets req.user
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    return res.json({ user: req.user });
  },
};
