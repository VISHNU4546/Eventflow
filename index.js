// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config(); // For environment variables (MongoDB URI, etc.)

// Initialize express app
const app = express();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session management and flash messages
app.use(session({
    secret: 'eventflowsecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware to make flash messages available to all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg') || null; // Default to null if undefined
    res.locals.error_msg = req.flash('error_msg') || null;     // Default to null if undefined
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');

// Use routes
app.use('/auth', authRoutes); // Authentication routes

// Basic route for home
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home - EventFlow',
    });
});

// Error handling for undefined routes
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
