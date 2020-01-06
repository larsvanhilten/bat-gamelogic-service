import jwt from 'jsonwebtoken';

export interface Token {
  exp: number;
  iat: number;
  username: string;
}

export interface Socket extends SocketIO.Socket {
  token: Token;
}

export default (socket: Socket, next: CallableFunction) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err: Error, decoded: Token) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      socket.token = decoded;
      next();
    });
  } else {
    next();
  }
};
