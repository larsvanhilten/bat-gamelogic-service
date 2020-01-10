import socketIO from 'socket.io';
import connect from './events/connect';
import authenticate from './middleware/authenticate';

export default (port: string) => {
  const io = socketIO(port);
  io.use(authenticate);

  connect(io);
};
