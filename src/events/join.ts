import { Socket } from '../middleware/authenticate';

export default (socket: Socket, username: string) => {
  socket.join(username);
};
