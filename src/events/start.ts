import joi from '@hapi/joi';
import { Socket } from '../middleware/authenticate';
import validateGrid from '../helpers/validate-grid';
import errorHandler from '../helpers/error-handler';
import { MongoClient } from 'mongodb';
import { insertGame } from '../helpers/game-store';

export interface Config {
  grid: number[][];
  chatVoteTime: number;
}

const schema = joi.object({
  grid: joi
    .array()
    .length(10)
    .items(
      joi
        .array()
        .length(10)
        .items(joi.string().valid('<', '-', '^', '|', '~'))
    ),
  chatVoteTime: joi
    .number()
    .min(10)
    .max(120)
    .required()
});

export default async (config: Config, socket: Socket, mongoClient: MongoClient) => {
  try {
    if (!socket.token) {
      throw Error('Authentication error');
    }

    const { grid, chatVoteTime } = await schema.validateAsync(config);

    const isValidGrid = validateGrid(grid);
    if (!isValidGrid) {
      throw Error('Invalid grid');
    }

    // Save grid to database
    const { username } = socket.token;
    insertGame(mongoClient, { username, chatVoteTime, grid });

    // Join room
    socket.join(username);

    // Respond with ?
    socket.emit('START_RESPONSE', { message: 'Game successfully created' });
  } catch (error) {
    const response = errorHandler(error);
    socket.emit('ERROR_RESPONSE', response);
  }
};
