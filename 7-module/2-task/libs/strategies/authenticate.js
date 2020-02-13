const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  const user = await User.findOne({email: email});

  if (!user) {
    const newUser = new User({
      email: email,
      displayName: displayName,
    });

    try {
      await newUser.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        return done(error);
      }
    }

    return done(null, newUser);
  }

  return done(null, user);
};
