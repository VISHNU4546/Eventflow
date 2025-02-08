// routes/events.js
const express = require('express');
const router = express.Router();
const ensureAdmin = require("../middleware/ensureAdmin");
const Event = require('../models/Event');
// Apply the admin-check middleware to all routes below



// GET Create Event Page (admin only)
router.get('/create', ensureAdmin,(req, res) => {
    res.render('admin/createEvent', {
        title: 'Create Event'
    });
});

// POST Create Event (admin only)
router.post('/create',ensureAdmin, async (req, res) => {
    // Example: Retrieve form data for event creation
    const { title, description, location, date,people, } = req.body;
    
    try {
        // Save event to the database. For example:
        const newEvent = new Event({ title, description, location, date,maxAttendees:people });
        let e = await newEvent.save();
         console.log(e);
        req.flash('success_msg', 'Event created successfully!');
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error creating event. Please try again.');
        res.redirect('/events/admin/create');
    }
});

router.get('/all', async (req, res) => {
    try {
      const events = await Event.find({});
      res.render('allEvents', {
        title: 'All Events',
        events,
        user: req.session.user // Pass user to conditionally show delete button
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error fetching events');
      res.redirect('/');
    }
  });
  
  // POST /events/delete/:id - Delete an event (only accessible to admin)
  router.post('/delete/:id', ensureAdmin, async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      req.flash('success_msg', 'Event deleted successfully');
      res.redirect('/events/all');
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error deleting event');
      res.redirect('/events/all');
    }
  });



// Route to register the logged-in user for an event
router.post('/register/:id', async (req, res) => {
  if (!req.session.user) {
    req.flash('error_msg', 'You must be logged in to register for events.');
    return res.redirect('/auth/login');
  }

  try {
    const eventId = req.params.id;
    const userId = req.session.user.id;

    const event = await Event.findById(eventId);
    if (!event) {
      req.flash('error_msg', 'Event not found.');
      return res.redirect('/events/all');
    }

    // Check if the user is already registered
    if (event.attendees.includes(userId)) {
      req.flash('error_msg', 'You are already registered for this event.');
      return res.redirect('/events/all');
    }

    // Add the user ID to the attendees array
    event.attendees.push(userId);
    await event.save();

    req.flash('success_msg', 'Successfully registered for the event!');
    res.redirect('/events/my');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error registering for event. Please try again.');
    res.redirect('/events/all');
  }
});
// Route to show all events the logged-in user is registered for
router.get('/my', async (req, res) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Please log in to view your registered events.');
      return res.redirect('/auth/login');
    }
  
    try {
      const userId = req.session.user.id;
      // Find events where the attendees array includes the user’s id
      const events = await Event.find({ attendees: userId });
      res.render('myEvents', {
        title: 'My Registered Events',
        events,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error fetching your events.');
      res.redirect('/dashboard');
    }
  });

  router.get('/details/:id', ensureAdmin, async (req, res) => {
    try {
      // Find the event by its ID and populate the attendees field to get user details
      const event = await Event.findById(req.params.id).populate('attendees');
      if (!event) {
        req.flash('error_msg', 'Event not found.');
        return res.redirect('/events/all');
      }
      res.render('eventDetails', {
        title: 'Event Details',
        event,
        user: req.session.user
      });
    } catch (error) {
      console.error(error);
      req.flash('error_msg', 'Error fetching event details.');
      res.redirect('/events/all');
    }
  });
  
module.exports = router;
