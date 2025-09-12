const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Replace this with your own user DB/model logic.
const findOrCreateUser = async (profile) => {
  // TODO: Implement user DB logic here
  // For demonstration, just return basic user info from profile
  return {
    id: profile.id,
    email: profile.emails[0].value,
    name: profile.displayName,
    photo: profile.photos?.[0]?.value,
  };
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Sessions
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;