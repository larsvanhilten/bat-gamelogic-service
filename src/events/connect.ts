import start from './start';
import { Socket } from '../middleware/authenticate';
import { appendParameters } from '../helpers/utils';
import { MongoClient } from 'mongodb';

export default (io: SocketIO.Server, mongoClient: MongoClient) => {
  io.on('connect', (socket: Socket) => {
    socket.on('START', appendParameters(start, socket, mongoClient));
  });
};
