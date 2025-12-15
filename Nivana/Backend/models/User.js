const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Auto-increment ID logic if you use it
  userId: { type: Number, unique: true, index: true }, 

  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  provider: { type: String, default: 'local' },

  // ✅ NEW PROFILE FIELDS
  bio: { type: String, default: "Taking it one day at a time. 🌱" },
  location: { type: String, default: "" },
  wellnessFocus: { type: String, default: "General Wellness" },
  emergencyName: { type: String, default: "" },
  emergencyPhone: { type: String, default: "" },
  reminderPreference: { type: String, default: "none" },
  
  // ✅ IMAGE PATH STORE
  profileImage: { type: String, default: "" }, 

  createdAt: { type: Date, default: Date.now },

  // Streak Logic
  lastLoginDate: { type: Date, default: null },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    badges: [{ type: String }],
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);