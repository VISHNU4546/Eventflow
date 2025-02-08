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
const dns = require('dns');
dns.lookup('cluster0.ltwzo.mongodb.net', (err, address, family) => {
  if (err) console.error(err);
  else console.log('Address:', address, 'Family:', family);
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
const adminRoutes = require('./routes/admin');
const eventRoutes = require("./routes/events");
// Use routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/admin', adminRoutes);
app.use("/events",eventRoutes);
// Basic route for home
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home - EventFlow',
    });
});

app.get('/dashboard', (req, res) => {
    // Assume req.session.user contains authenticated user information
    console.log(req.session);
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view the dashboard');
        return res.redirect('/auth/login');
    }
    res.render('dashboard', {
        title: 'Dashboard - EventFlow',
        user: req.session.user // Pass user data to the view
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
