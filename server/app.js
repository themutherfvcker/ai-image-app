const express = require('express');
const session = require('express-session');
const passport = require('./auth/google');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.use('/auth', authRoutes);

// Example protected route
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <h1>Welcome, ${req.user.name}!</h1>
      <p>Email: ${req.user.email}</p>
      <img src="${req.user.photo}" alt="Profile Photo" />
      <br />
      <a href="/auth/logout">Logout</a>
    `);
  } else {
    res.redirect('/auth/google');
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('Home page. <a href="/auth/google">Login with Google</a>');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
