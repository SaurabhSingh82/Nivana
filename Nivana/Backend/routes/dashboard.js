const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Assessment = require("../models/Assessment"); // Assessment data ke liye

// GET /api/dashboard
router.get("/", auth, async (req, res) => {
  try {
    // 1. User ko fetch karein
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // --- STREAK LOGIC START ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Aaj ka date (time hata kar)

    const lastLogin = new Date(user.lastLoginDate || Date.now());
    lastLogin.setHours(0, 0, 0, 0); // Last login ka date

    // Din ka antar (Difference in days)
    const diffTime = Math.abs(today - lastLogin);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Agar streak object exist nahi karta toh initialize karein
    if (!user.streak) {
      user.streak = { current: 1, longest: 1, badges: [] };
    }

    let currentStreak = user.streak.current || 0;
    let longestStreak = user.streak.longest || 0;
    let badges = user.streak.badges || [];

    if (diffDays === 0) {
      // Aaj user pehle hi login kar chuka hai -> Streak same rahegi
    } else if (diffDays === 1) {
      // User KAL aaya tha (Consecutive) -> Streak badhao
      currentStreak += 1;
    } else {
      // User ne gap kiya -> Streak reset to 1
      currentStreak = 1;
    }

    // Longest streak update
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    // Badges update logic
    if (currentStreak >= 7 && !badges.includes("weekly")) badges.push("weekly");
    if (currentStreak >= 30 && !badges.includes("monthly")) badges.push("monthly");
    if (currentStreak >= 365 && !badges.includes("yearly")) badges.push("yearly");

    // Database mein save karein
    user.streak = { current: currentStreak, longest: longestStreak, badges };
    user.lastLoginDate = new Date(); // Abhi ka time update karein
    await user.save();
    // --- STREAK LOGIC END ---

    // 2. Assessments Data Fetch (Graph aur Stats ke liye)
    // Last 7 assessments nikalein taaki graph ban sake
    const assessments = await Assessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7);

    // Graph ke liye data format karein
    const weeklyMood = assessments.map((a) => ({
      day: new Date(a.createdAt).toLocaleDateString("en-US", { weekday: "short" }),
      score: a.moodScore || 5, // Agar moodScore nahi hai toh default 5
    })).reverse(); // Purana pehle, naya baad mein

    // Response bhejein
    res.json({
      streak: user.streak,          // ✅ Updated Streak
      weeklyMood: weeklyMood,       // ✅ Mood Graph Data
      latestAssessment: assessments[0] || null, // ✅ Improvement Areas Data
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;