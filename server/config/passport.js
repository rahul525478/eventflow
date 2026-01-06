const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require('../controllers/authController');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // In a real DB, find user by ID.
    // For our mock memory store, we'll iterate locally.
    const user = authController.findUserById(id);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        // Here we would typically find or create a user in the DB
        // For now, we'll defer to a controller method or handle it here
        const user = authController.findOrCreateGoogleUser(profile);
        return cb(null, user);
    }
));

module.exports = passport;
