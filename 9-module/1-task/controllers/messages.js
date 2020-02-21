const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  let messages = await Message.find({chat: ctx.user._id}, null, {limit: 20});
  messages = messages.map(mapMessage);

  ctx.body = {
    messages,
  };
};

function mapMessage(message) {
  return {
    date: message.date.toISOString(),
    text: message.text,
    id: message._id,
    user: message.user,
  };
}
