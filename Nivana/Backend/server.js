const path = require("path");
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
// Render par FRONTEND_URL zaroor set karein: https://nivana.vercel.app
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

console.log("🚀 Server Config:", { FRONTEND_URL, BACKEND_URL });

/* ---------------------- MIDDLEWARE ---------------------- */
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL, // Sirf aapka frontend allow karega
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only on Live
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 
    }
  })
);

app.use(passport.initialize());
// Session use nahi kar rahe JWT ke liye, par init zaroori hai

/* ---------------------- DB CONNECTION ---------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* ---------------------- MODELS ---------------------- */
require("./models/User");

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

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // 🔥 Note: Callback URL me '/api' add kiya hai kyunki routes wahan mounted hain
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
            provider: "google",
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

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const User = mongoose.model("User");
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
           let email = profile.emails && profile.emails.length > 0 
           ? (profile.emails.find(e => e.primary) || profile.emails[0]).value 
           : null;

           if(email) {
             user = await User.findOne({ email });
             if(user) {
               user.githubId = profile.id;
               await user.save();
               return done(null, user);
             }
           }

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
// Saare Auth Routes '/api/auth' par chalenge
app.use("/api/auth", require("./routes/auth"));

app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/dashboard", require("./middleware/auth"), require("./routes/dashboard"));
app.use("/api/moods", require("./routes/mood"));
app.use("/api/laughter", require("./routes/laughter"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running`)
);