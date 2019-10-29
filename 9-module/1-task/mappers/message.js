module.exports = function mapMessage(message) {
  return {
    date: message.date,
    text: message.text,
    id: message._id.toString(),
    user: message.user,
  };
};
