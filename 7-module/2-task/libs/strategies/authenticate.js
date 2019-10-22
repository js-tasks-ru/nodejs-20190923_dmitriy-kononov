const userModel = require('./../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  try {
    const userFound = await userModel.findOne({email});

    if (userFound) {
      done(null, userFound._doc);
      return;
    };

    const newUser = await userModel.create({email, displayName});

    done(null, newUser._doc);
  } catch (err) {
    done(err, false);
  };
};
