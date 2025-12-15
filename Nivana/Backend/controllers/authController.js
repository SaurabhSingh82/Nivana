const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.provider !== "local") {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🔥 UPDATED JWT PAYLOAD
    const token = jwt.sign(
      {
        id: user._id,       // MongoDB ObjectId (for relations)
        userId: user.userId // Numeric ID (1,2,3...)
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    // ✅ RESPONSE (unchanged behaviour)
    return res.json({
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
