# EventFlow

[Live Demo](https://eventflow-777r.onrender.com/)

## Table of Contents

- [About](#about)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

---

## About

**EventFlow** is a dynamic event management platform developed using Node.js, Express.js, MongoDB, and EJS. It allows users to manage and register for events, with role-based access control for administrators and regular users.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- EJS (Embedded JavaScript)
- HTML/CSS
- JavaScript
- Connect-Flash for flash messages

---

## Features

- User authentication (signup, login, and logout)
- OTP verification for new users
- Role-based admin dashboard for managing events
- Event registration for users
- Admin view of registered users per event
- Flash messages for success/error feedback
- Session-based user management
- Admin-only functionality for event creation and deletion

---

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**

```bash
$ git clone https://github.com/VISHNU4546/EventFlow.git
```

2. **Navigate to the project directory**

```bash
$ cd EventFlow
```

3. **Install dependencies**

```bash
$ npm install
```

4. **Set up environment variables** (See [Environment Variables](#environment-variables))

5. **Start the server**

```bash
$ npm start
```

The server will start on `http://localhost:3000/` by default.

---

## Environment Variables

Create a `.env` file in the project root and add the following environment variables:

```
MONGO_URL=<your-mongodb-url>
PORT=3000
SESSION_SECRET=<your-session-secret>
```

---

## Usage

1. **Home Page**: Access the home page and see available events.
2. **User Registration**: New users can sign up and will be asked to verify their email via OTP.
3. **User Dashboard**: Logged-in users can view registered events.
4. **Admin Dashboard**: Admin users can manage events (create, delete, view attendees).

---

## API Endpoints

- **POST** `/auth/signup` - Create a new user (with OTP verification)
- **POST** `/auth/login` - User login
- **GET** `/auth/logout` - Logout user
- **GET** `/events` - Fetch all events
- **POST** `/events/register/:id` - Register for an event
- **DELETE** `/events/:id` - Delete an event (Admin only)
- **GET** `/admin/events/:id/users` - View registered users for a specific event (Admin only)

---

## Contributing

If you'd like to contribute to this project, feel free to fork the repository and submit a pull request with your improvements.

---

### License

This project is licensed under the MIT License.

