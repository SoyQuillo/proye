import express from "express";
import { protect } from "../middleware/auth.js";
import { login, logout, register } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.post("/logout", logout);

export default router;
