// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5000', credentials: true })); // Allow requests from frontend
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// In-memory user data store (Replace this with a proper database in production)
const users = [
  { id: 1, username: 'john', password: 'password1' },
  { id: 2, username: 'jane', password: 'password2' },
  { id: 3, username: 'kamalkp@dewsolutions.in', password: 'password2' },
];

// Passport configuration
passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  (username, password, done) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) return done(null, false);

    return done(null, user);
  }
));

// Passport configuration for Google OAuth
passport.use(new GoogleStrategy({
  clientID: 'clientID',
  clientSecret: 'clientSecret',
  callbackURL: 'http://localhost:3000/auth/google/callback', // Change this URL as needed
},
(accessToken, refreshToken, profile, done) => {
  // You can save the user's Google profile data to your database or session
  const user = { id: profile.id, displayName: profile.displayName };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  console.log("user>>>>>>>>>>>>> ",user)
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // console.log("id>>>>>>>>>> ",id)
  // const user = users.find((u) => u.id === id);
  return done(null, user);
});

// Create a route for user login
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.send({ message: 'Login successful', user: req.user });
});

// Create a route for user logout
app.get('/api/logout', (req, res) => {
  req.logout(() => {});
  res.send({ message: 'Logged out successfully' });
});

// Create a route to check if the user is authenticated
app.get('/api/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ isAuthenticated: true, user: req.user });
  } else {
    res.send({ isAuthenticated: false });
  }
});



// Create a route for Google login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the frontend URL
    console.log("Successful authentication, redirect to the frontend URL");
  res.redirect('http://localhost:5000/');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
