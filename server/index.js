const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://eventflow-rho.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
// Serve uploads directory specifically
app.use('/uploads', express.static('uploads'));

const passport = require('./config/passport');
app.use(passport.initialize());

// Routes
app.use('/api', apiRoutes);

// Export app for Vercel
module.exports = app;

// Only start server if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
