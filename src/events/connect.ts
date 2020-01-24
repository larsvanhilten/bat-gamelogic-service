import { Socket } from '../middleware/authenticate';
import { appendParameters } from '../utils/append-parameters';
import { start } from './start';
import { getVotes } from './votes';
import { disconnect } from './disconnect';
import { playerFire } from './player-fire';

export default (io: SocketIO.Server) => {
  io.on('connect', (socket: Socket) => {
    socket.on('START', appendParameters(start, socket));
    socket.on('VOTES', appendParameters(getVotes, socket));
    socket.on('PLAYER_FIRE', appendParameters(playerFire, socket));
    socket.on('disconnect', appendParameters(disconnect, socket));
  });
};
