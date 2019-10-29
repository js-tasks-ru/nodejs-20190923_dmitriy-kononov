const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const msgList = await Message
      .find({chat: ctx.user._id})
      .sort({date: -1})
      .limit(20);

  const messages = (msgList) ? msgList.map((msg) => mapMessage(msg)) : [];

  ctx.body = {messages};
};
