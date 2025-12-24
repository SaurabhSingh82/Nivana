const path = require("path");
// ✅ .env file load
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const app = express();

/* ---------------------- CONFIG ---------------------- */
// Render par FRONTEND_URL set hona chahiye: https://nivana.vercel.app
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

console.log("🚀 Server Config:", { FRONTEND_URL, BACKEND_URL });

/* ---------------------- MIDDLEWARE ---------------------- */
app.use(express.json()); // Body Parser

// ✅ CORS Settings (Crucial for Vercel connection)
app.use(
  cors({
    origin: FRONTEND_URL, // Sirf aapke Frontend ko allow karega
    credentials: true,    // Cookies/Headers allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve Static Files (Uploaded Images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Session Config (Passport ko init karne ke liye zaroori hai)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key_nivana",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Live par HTTPS zaroori
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

app.use(passport.initialize());
// app.use(passport.session()); // JWT use kar rahe hain to session storage ki strict need nahi hai.

/* ---------------------- DB CONNECTION ---------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ---------------------- MODELS ---------------------- */
require("./models/User"); // User model load karna zaroori hai
require("./models/Assessment");
require("./models/Mood");

/* ---------------------- PASSPORT STRATEGIES ---------------------- */

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const User = mongoose.model("User");
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 👉 1. Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // 🔥 Note: '/api' add kiya hai taaki routes match karein
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (_, __, profile, done) => {
      try {
        const User = mongoose.model("User");
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });
        
        if (!user) {
          user = await User.create({
            fullName: profile.displayName,
            email,
            provider: "google", // Provider set kiya
            googleId: profile.id
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// 👉 2. GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // 🔥 Note: '/api' add kiya hai taaki routes match karein
      callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const User = mongoose.model("User");
        
        // Step 1: Check by GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
           // Step 2: Check by Email (Account Merging)
           let email = profile.emails && profile.emails.length > 0 
           ? (profile.emails.find(e => e.primary) || profile.emails[0]).value 
           : null;

           if(email) {
             user = await User.findOne({ email });
             if(user) {
               // User exists via Email -> Link GitHub ID
               user.githubId = profile.id;
               await user.save();
               return done(null, user);
             }
           }

           // Step 3: Create New User
           // Agar email hidden hai to dummy email banao
           const finalEmail = email || `${profile.username}@github.local`;
           
           user = await User.create({
             fullName: profile.displayName || profile.username,
             email: finalEmail,
             provider: "github",
             githubId: profile.id,
           });
        }
        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

/* ---------------------- ROUTES ---------------------- */

// ✅ Auth Routes ko '/api/auth' par mount kiya
// Note: Is file me '/google' aur '/google/callback' routes hone chahiye
app.use("/api/auth", require("./routes/auth"));

// Other Routes
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/dashboard", require("./middleware/auth"), require("./routes/dashboard"));
app.use("/api/moods", require("./routes/mood"));
app.use("/api/laughter", require("./routes/laughter"));

// Health Check
app.get("/api/health", (req, res) => res.json({ ok: true, msg: "Server is running 🚀" }));

/* ---------------------- ERROR HANDLING ---------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 Global Server Error:", err.stack);
  res.status(500).json({ msg: "Internal Server Error", error: err.message });
});

/* ---------------------- START SERVER ---------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on Port: ${PORT}`)
);