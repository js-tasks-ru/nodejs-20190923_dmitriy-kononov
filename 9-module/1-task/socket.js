const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {

    if (!socket.handshake.query.token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token: socket.handshake.query.token}).populate('user');

    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    socket.user = session._doc.user._doc;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const message = new Message({
        user: socket.user.displayName,
        chat: socket.user._id,
        text: msg,
        date: new Date(),
      });

      message.save();
    });
  });

  return io;
}

module.exports = socket;
