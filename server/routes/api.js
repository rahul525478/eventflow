const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');
const aiController = require('../controllers/aiController');
const eventController = require('../controllers/eventController');
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const passport = require('passport');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- Auth Routes ---
router.post('/auth/signup', upload.single('profileImage'), authController.signup);
router.post('/auth/signup/verify', authController.verifySignupOtp);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/me', verifyToken, authController.getMe); // Get current user

// Google Auth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Successful authentication, redirect to frontend with token
        // Passport strategy should have returned the user
        const token = authController.generateToken(req.user);
        res.redirect(`http://localhost:5173/login?token=${token}&role=${req.user.role}`);
    }
);

// Event Routes
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEventById);
router.post('/events', verifyToken, upload.single('image'), eventController.createEvent);
router.delete('/events/:id', verifyToken, eventController.deleteEvent);

// AI Routes
router.post('/ai/generate', verifyToken, aiController.generateEventDescription);
router.post('/chat', verifyToken, aiController.chatWithAI);

// Report Routes
router.get('/reports/:type', verifyToken, reportController.getReportData);

module.exports = router;
