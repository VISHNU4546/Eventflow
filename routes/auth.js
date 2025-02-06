const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/signup',async(req,res)=>{
    res.render('signup')
})
// Register Route (Sign Up)
router.post('/signup', async (req, res) => {
    const { name, email, password, password2 } = req.body;

    // Validate the form input
    if (!name || !email || !password || !password2) {
        req.flash('error_msg', 'Please fill in all fields');
        return res.redirect('/auth/signup');  // Redirect back to the sign-up form
    }

    if (password !== password2) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/signup');
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            // res.send("exits")
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/auth/signup');
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        // Save the user
        await user.save();

        req.flash('success_msg', 'You are registered and can now log in');
        return res.redirect('/auth/login');
        res.send("done")

    } catch (error) {
        // res.send(error.message);
        req.flash('error_msg', 'Server error. Please try again.');
        return res.redirect('/auth/signup');
    }
});

// Login Route

router.get('/login',async(req,res)=>{
    res.render('login')
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/auth/login');
        }

        // Validate the password manually
        const isMatch = user.validatePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/auth/login');
        }

        req.flash('success_msg', 'Logged in successfully');
        res.redirect('/dashboard');
    } catch (error) {
        req.flash('error_msg', 'Server error. Please try again.');
        return res.redirect('/auth/login');
    }
});

// Logout Route
// Handle Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
});


module.exports = router;
