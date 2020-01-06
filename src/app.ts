import socketIO from 'socket.io';
import connect from './events/connect';
import authenticate from './middleware/authenticate';
import { MongoClient } from 'mongodb';

export default (port: string, mongoClient: MongoClient) => {
  const io = socketIO(port);
  io.use(authenticate);

  connect(io, mongoClient);
};
