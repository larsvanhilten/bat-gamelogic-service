import { container } from 'tsyringe';
import joi from '@hapi/joi';
import { Socket } from '../middleware/authenticate';
import { validateGrid } from '../utils/validate-grid';
import { handleErrors } from '../utils/handle-errors';
import { generateGrid } from '../utils/generate-grid';
import { GameStoreService } from '../services/game-store.service';

export interface Config {
  grid: string[][];
  chatVoteTime: number;
}

const gameStoreService = container.resolve(GameStoreService);

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

export async function start(config: Config, socket: Socket): Promise<void> {
  try {
    if (!socket.token) {
      throw Error('Authentication error');
    }

    const { grid: playerGrid, chatVoteTime } = await schema.validateAsync(config);

    const isValidGrid = validateGrid(playerGrid);
    if (!isValidGrid) {
      throw Error('Invalid grid');
    }

    // Generate grid for chat
    const chatGrid = generateGrid();

    // Save game to database
    const { username } = socket.token;
    gameStoreService.insertGame({ username, chatVoteTime, playerGrid, chatGrid });

    // Join socket room
    socket.join(username);

    // Respond that backend is ready
    socket.emit('START_RESPONSE');
  } catch (error) {
    const response = handleErrors(error);
    socket.emit('ERROR_RESPONSE', response);
  }
}
