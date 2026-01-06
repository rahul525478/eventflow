const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve uploads directory specifically
app.use('/uploads', express.static('uploads'));

const passport = require('./config/passport');
app.use(passport.initialize());

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
