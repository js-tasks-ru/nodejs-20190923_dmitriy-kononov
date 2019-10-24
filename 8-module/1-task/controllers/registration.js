const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  console.log('----------- register');

  const {email, displayName, password} = ctx.request.body;
  const _uuid = uuid();

  const user = new User({
    email,
    displayName,
    verificationToken: _uuid,
  });

  await user.setPassword(password);

  await user.save().catch((err) => {
    if (err.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {
        errors: {
          email: err.errors.email.message,
        },
      };

      return;
    }

    throw err;
  });

  await sendMail({
    template: 'confirmation',
    locals: {token: _uuid},
    to: email,
    subject: 'Confirm register',
  });

  next();
};

module.exports.confirm = async (ctx, next) => {
  const {token} = ctx.params;

  const user = await User.findOne({verificationToken: token});

  if (!user) {
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};

    return;
  }

  user.verificationToken = '';
  await user.save();

  const session = await ctx.login(user);
  ctx.body = {session};
};
