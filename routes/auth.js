const crypto = require('crypto');
const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/signup',async(req,res)=>{
    res.render('signup')
})

// POST Signup - Register a new user (with OTP verification)
router.post('/signup', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    
    // Basic validation
    if (!name || !email || !password || !password2) {
        req.flash('error_msg', 'Please fill in all fields');
        return res.redirect('/auth/signup');
    }
    if (password !== password2) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/signup');
    }
    
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email is already registered');
            return res.redirect('/auth/signup');
        }
        
        // Store the pending user data in session (do not save yet)
        req.session.pendingUser = { name, email, password };
        
        // Generate a 6-digit OTP and set expiry (e.g., 5 minutes)
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        
        // Store OTP in session associated with this signup
        req.session.otp = { code: otp, expiry: otpExpiry, email };
        
        // Configure Nodemailer transporter (adjust settings as needed)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
             host:"smtp.gmail.com",
             port:465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code for EventFlow Signup',
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`
        };
        
        // Send OTP via email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP email:', error);
                req.flash('error_msg', 'Error sending OTP. Please try again.');
                return res.redirect('/auth/signup');
            }
            // Redirect to OTP verification page
            res.redirect('/auth/verify-otp');
        });
        
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server error. Please try again later.');
        res.redirect('/auth/signup');
    }
});

module.exports = router;


// Login Route

router.get('/login', (req, res) => {
    const logoutMsg = req.query.msg === 'logout' ? 'You are logged out' : null;
    res.render('login', {
        title: 'Login - EventFlow',
        logoutMsg
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Account not Exist please signup');
            return res.redirect('/auth/signup');
        }

        // Validate the password manually
        const isMatch = user.validatePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid credentials');
            return res.redirect('/auth/login');
        }
        console.log(user.email)
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
            // Add any other properties you want to store
        };

if(user.email=='vishnukumawat4546@gmail.com'){
    req.flash('success_msg', 'Logged in successfully');
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.session.user
    });
}
     else{ req.flash('success_msg', 'Logged in successfully');
        res.redirect('/dashboard');}
    } catch (error) {
        req.flash('error_msg', 'Server error. Please try again.');
        return res.redirect('/auth/login');
    }
});

// Logout Route
// Handle Logout
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.redirect('/');
            }
            res.clearCookie('connect.sid');
            res.redirect('/auth/login?msg=logout');
        });
    } else {
        res.redirect('/auth/login?msg=logout');
    }
});





// GET OTP Verification Page
router.get('/verify-otp', (req, res) => {
    res.render('verify-otp', { title: 'Verify OTP' });
});

// POST OTP Verification
router.post('/verify-otp', async (req, res) => {
    const { otpInput } = req.body;
    const storedOtp = req.session.otp;
    const pendingUser = req.session.pendingUser;
    
    // Ensure there is an OTP and pending user data
    if (!storedOtp || !pendingUser) {
        req.flash('error_msg', 'Session expired or invalid. Please sign up again.');
        return res.redirect('/auth/signup');
    }
    
    // Check if OTP is expired
    if (Date.now() > storedOtp.expiry) {
        req.flash('error_msg', 'OTP has expired. Please sign up again.');
        return res.redirect('/auth/signup');
    }
    
    // Validate the entered OTP
    if (otpInput === storedOtp.code) {
        let user = new User({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,  // Plaintext password here; it will be hashed in pre-save middleware.
            // role is set to default 'user' or you can specify if needed
        });
        
        try {
            await user.save();
            // Clear temporary session data
            delete req.session.pendingUser;
            delete req.session.otp;
            req.flash('success_msg', 'Your account has been created successfully! You can now log in.');
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Error saving user:', error);
            req.flash('error_msg', 'Error creating account. Please try again.');
            res.redirect('/auth/signup');
        }
    } else {
        req.flash('error_msg', 'Invalid OTP. Please try again.');
        res.redirect('/auth/verify-otp');
    }
});




module.exports = router;



