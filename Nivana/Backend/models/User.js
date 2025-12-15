const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 🔢 AUTO-INCREMENT USER ID (1, 2, 3...)
  userId: {
    type: Number,
    unique: true,
    index: true,
  },

  fullName: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    default: '' 
  },

  provider: { 
    type: String, 
    default: 'local' 
  }, // local | google | github

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  // 🔥 STREAK FIELDS
  lastLoginDate: {
    type: Date,
    default: null, // ❗ IMPORTANT: null for first-time detection
  },

  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    badges: [{ type: String }], // ['weekly', 'monthly']
  },
});

module.exports =
  mongoose.models.User || mongoose.model('User', userSchema);
