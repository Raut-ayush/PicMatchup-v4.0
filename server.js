const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const eloRoutes = require('./routes/eloRoutes');
const resetRoutes = require('./routes/resetRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Add admin routes
const termsAndConditions = require('./terms');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/elo', eloRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/admin', adminRoutes);  // Add admin routes

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/terms.css', express.static(path.join(__dirname, 'terms.css')));

// Terms and Conditions Route
app.get('/terms', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(termsAndConditions);
});

// Serve Privacy Policy and Terms of Service
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

app.get('/terms-of-service', (req, res) => {
    res.sendFile(path.join(__dirname, 'terms-of-service.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error details:', err);
    res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
