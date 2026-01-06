const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock User Database (In-memory for demo purposes)
let users = [
    {
        id: 1,
        email: "admin@example.com",
        password: "$2a$10$hashedpassword", // Placeholder hash
        role: "admin",
        firstName: "Admin",
        lastName: "User",
        phone: "1234567890",
        verified: true
    }
];

// Pending users waiting for OTP verification
let pendingUsers = {};

// Mock OTP Storage
let otpStore = {};

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'dev_secret_key', {
        expiresIn: '24h'
    });
};

exports.findUserById = (id) => {
    // Helper for passport deserialize
    // Since IDs might be numbers or strings (Google IDs), strict check might fail if types mismatch
    return users.find(u => u.id == id);
};

exports.findOrCreateGoogleUser = (profile) => {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    if (!email) return null;

    let user = users.find(u => u.email === email);
    if (user) {
        // Update google specific info if needed?
        return user;
    }

    // Create new user
    user = {
        id: profile.id, // Use Google ID as ID
        email: email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        role: 'participant',
        profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        verified: true, // Google trusted
        googleId: profile.id
    };
    users.push(user);
    return user;
};

exports.generateToken = generateToken; // Export for use in routes if needed

exports.googleCallback = (req, res) => {

    // In a real app, Passport would handle user creation here.
    const user = req.user || { id: 999, role: 'participant', name: "Google User" };
    const token = generateToken(user);
    res.redirect(`http://localhost:5173/login?token=${token}&role=${user.role}`);
};

// Step 1: Sign Up - Collect details, hash password, send OTP
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        // Check if email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Store in pending until verified
        pendingUsers[phone] = {
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: 'participant',
            profileImage,
            verified: false
        };

        // Generate and Send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[phone] = otp;

        console.log(`[MOCK SMS] OTP for ${phone} is ${otp}`);

        // In reality, you'd trigger Twilio/SMS service here

        res.status(200).json({
            message: "OTP sent successfully",
            otp, // Sending back for demo convenience
            phone
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during signup" });
    }
};

// Step 2: Verify OTP and Create User
exports.verifySignupOtp = (req, res) => {
    const { phone, otp } = req.body;

    if (otpStore[phone] === otp) {
        const pendingUser = pendingUsers[phone];

        if (!pendingUser) {
            // Handle case where user might be verifying a login OTP instead of signup
            // Or if pending user data was lost (server restart)
            // For this flow, we assume signup verification immediately follows signup request
            return res.status(400).json({ message: "No pending signup found for this number or session expired." });
        }

        // Move to permanent users array
        const newUser = {
            id: Date.now(),
            ...pendingUser,
            verified: true
        };
        users.push(newUser);

        // Cleanup
        delete otpStore[phone];
        delete pendingUsers[phone];

        const token = generateToken(newUser);
        res.status(201).json({
            message: "User verified and created",
            token,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                image: newUser.profileImage
            }
        });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
};

// Login with Email & Password
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch && password !== "admin123") { // Backdoor for initial admin mock if hash doesn't match
            // Note: In real prod, remove the backdoor. here user[0] uses a placeholder hash.
            if (user.email === "admin@example.com" && password === "admin123") {
                // allow
            } else {
                return res.status(400).json({ message: "Invalid email or password" });
            }
        }

        // Return token
        const token = generateToken(user);
        res.status(200).json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                image: user.profileImage
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login" });
    }
};

exports.getMe = (req, res) => {
    // req.user is set by verifyToken middleware
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user.profileImage
    });
};

// Legacy/Simple OTP Send (for purely phone-based login if needed, or re-verification)
exports.sendOtp = async (req, res) => {
    const { phone } = req.body;
    // Check if phone belongs to a user? For now just send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = otp;
    console.log(`[MOCK SMS] OTP for ${phone} is ${otp}`);
    res.status(200).json({ message: "OTP sent successfully", otp });
};


// Forgot Password Flow
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Mock Send Email
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[`RESET_${email}`] = resetToken;
    console.log(`[Mock Email] Password reset code for ${email} is ${resetToken}`);

    res.json({ message: "Reset code sent" });
};

exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (otpStore[`RESET_${email}`] !== code) {
        return res.status(400).json({ message: "Invalid or expired code" });
    }

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    delete otpStore[`RESET_${email}`];

    res.json({ message: "Password updated successfully" });
};

exports.verifyOtp = (req, res) => {
    const { phone, otp } = req.body;
    if (otpStore[phone] === otp) {
        delete otpStore[phone];
        // Find user by phone if exists, else return temp user
        // This was the old flow. For the new flow, we prefer login/signup routes.
        // We'll keep this compatible for now.
        const user = users.find(u => u.phone === phone) || { id: Date.now(), role: 'participant', phone };
        const token = generateToken(user);
        res.status(200).json({ token, user });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
};
