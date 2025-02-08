// middleware/ensureAdmin.js (optional, or inline below)
function ensureAdmin(req, res, next) {
    // Check if the session exists, a user is logged in, and that user is an admin
    if (req.session && req.session.user && req.session.user.email === 'vishnukumawat4546@gmail.com') {
        return next();
    } else {
        // Render 404 if the user is not an admin
        return res.status(404).render('404', { title: 'Page Not Found' });
    }
}

module.exports = ensureAdmin;
