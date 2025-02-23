import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Schema
const recruitmentSchema = new mongoose.Schema({
    fullName: String,
    department: String,
    domain: [String],
    techStack: String,
    currentProjects: String,
    previousProjects: String,
    achievements: String,
    otherClubs: String,
    priority: String,
    availability: String,
    linkedIn: String,
    github: String,
    googleId: String,
    email: String
});

const Recruitment = mongoose.model('Recruitment', recruitmentSchema);

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;

    // Restrict to @rajalakshmi.edu.in domain
    if (!email.endsWith("@rajalakshmi.edu.in")) {
        return done(null, false, { message: "Unauthorized: Only @rajalakshmi.edu.in accounts allowed." });
    }

    let user = await Recruitment.findOne({ googleId: profile.id });

    if (!user) {
        user = await Recruitment.create({
            googleId: profile.id,
            email: email,
            fullName: profile.displayName
        });
    }

    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await Recruitment.findById(id);
    done(null, user);
});

// Google OAuth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login"
}), (req, res) => {
    res.redirect("http://localhost:5173/form"); // Adjust frontend URL if needed
});

// ✅ New Route: Check Authenticated User
app.get("/auth/user", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
});

// ✅ Logout Route
app.get("/auth/logout", (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.json({ message: "Logged out successfully" });
    });
});

// ✅ Handle Form Submission
app.post('/api/recruitment', async (req, res) => {
    try {
        const newEntry = new Recruitment(req.body);
        await newEntry.save();
        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting form' });
    }
});

// ✅ Fetch All Submissions
app.get('/api/recruitment', async (req, res) => {
    try {
        const entries = await Recruitment.find();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
