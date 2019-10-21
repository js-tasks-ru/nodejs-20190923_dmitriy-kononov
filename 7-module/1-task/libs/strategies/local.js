const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
      passwordField: 'password',
    },
    async function(email, password, done) {
      let user;

      try {
        user = await User.findOne({email: email});
      } catch (err) {
        done(err);
      };

      if (!user) {
        done(null, false, 'Нет такого пользователя');
        return;
      }

      if (!await user.checkPassword(password)) {
        done(null, false, 'Неверный пароль');
        return;
      }

      done(null, user);
    }
);
