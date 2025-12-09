// Backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

require('dotenv').config();

const app = express();

// ---------------------- BASIC CONFIG CONSTANTS ----------------------
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Debug ENV Keys
console.log('Google ENV:', {
  id: process.env.GOOGLE_CLIENT_ID,
  secret: !!process.env.GOOGLE_CLIENT_SECRET,
});
console.log('GitHub ENV:', {
  id: process.env.GITHUB_CLIENT_ID,
  secret: !!process.env.GITHUB_CLIENT_SECRET,
});

// ---------------------- MIDDLEWARE ----------------------
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'some_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------------------- DB CONNECTION ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// ---------------------- USER MODEL ----------------------
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  provider: { type: String, default: 'local' }, // local, google, github
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// ---------------------- PASSPORT SERIALIZE ----------------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ---------------------- GOOGLE STRATEGY (Chrome Icon) ----------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // IMPORTANT: Must match Google Cloud console EXACTLY
      callbackURL: 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullName: name,
            email,
            provider: 'google',
            password: '',
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ---------------------- GITHUB STRATEGY ----------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.local`;

        const name = profile.displayName || profile.username;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullName: name,
            email,
            provider: 'github',
            password: '',
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ---------------------- JWT Redirect Helper ----------------------
const sendTokenAndRedirect = (req, res) => {
  if (!req.user)
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);

  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
};

// ---------------------- LOCAL SIGNUP ----------------------
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ msg: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hash,
      provider: 'local',
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------------- LOCAL LOGIN ----------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.provider !== 'local')
      return res
        .status(400)
        .json({ msg: 'Invalid login method or user does not exist' });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ msg: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ---------------------- GOOGLE ROUTES ----------------------
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login?error=google` }),
  sendTokenAndRedirect
);

// ---------------------- GITHUB ROUTES ----------------------
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login?error=github` }),
  sendTokenAndRedirect
);

// ---------------------- SERVER START ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
