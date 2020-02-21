const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;

    socket.session = await Session.findOne({
      token: token,
    }).populate('user');

    next();
  });

  io.on('connection', (socket) => {
    if (!socket.session) {
      io.emit('error', 'anonymous sessions are not allowed');
      io.emit('close');
    }

    socket.on('message', async (msg) => {
      await Message.create({
        date: new Date(),
        text: msg,
        chat: socket.session.user._id,
        user: socket.session.user.displayName,
      });
    });

    io.on('error', (err) => {
      console.log(err);
    });
  });

  return io;
}

module.exports = socket;
