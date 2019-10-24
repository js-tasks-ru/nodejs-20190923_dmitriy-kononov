const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const _uuid = uuid();
  
  const user = new User({
    email,
    displayName,
    verificationToken: _uuid,
  });

  await user.setPassword(password);

  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: _uuid},
    to: email,
    subject: 'Confirm register',
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
  return;
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};

    return;
  }

  user.verificationToken = undefined;
  await user.save();

  const session = await ctx.login(user);
  ctx.body = {token: session};
};
