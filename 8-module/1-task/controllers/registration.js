const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();

  try {
    const user = new User({
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName,
      verificationToken: token,
    });

    await user.setPassword(ctx.request.body.password);
    await user.save();

  } catch (error) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Такой email уже существует'}};
    return;
  }

  await sendMail({
    template: 'confirmation',
    locals: {token: token},
    to: ctx.request.body.email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  try {
    const user = await User.findOne({verificationToken: ctx.request.body.verificationToken});
    user.verificationToken = undefined;
    user.save();

    const token = await ctx.login(user);
    ctx.body = {token};
  } catch (error) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
};
