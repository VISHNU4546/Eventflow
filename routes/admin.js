// routes/admin.js
const express = require('express');
const router = express.Router();
const ensureAdmin = require('../middleware/ensureAdmin'); // Adjust the path if needed

// GET /admin/dashboard - Admin Dashboard Route
router.get('/dashboard', ensureAdmin, (req, res) => {
    // Render the dashboard view and pass the user object from the session
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.session.user
    });
});

module.exports = router;
