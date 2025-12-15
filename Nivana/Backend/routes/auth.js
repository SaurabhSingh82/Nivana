const express = require("express");
const router = express.Router();
const { login, signup, getMe, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload"); // ✅ Import Upload Middleware

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authMiddleware, getMe);

// ✅ Add Upload Middleware to PUT route
router.put("/profile", authMiddleware, upload.single('profileImage'), updateProfile);

module.exports = router;