import { container } from 'tsyringe';
import joi from '@hapi/joi';
import { Socket } from '../middleware/authenticate';
import { validateGrid } from '../utils/validate-grid';
import { handleErrors } from '../utils/handle-errors';
import { generateGrid } from '../utils/generate-grid';
import { GameStoreService } from '../services/game-store.service';
import { TwitchService } from '../services/twitch.service';

const gameStoreService = container.resolve(GameStoreService);
const twitchService = container.resolve(TwitchService);

export async function getVotes(socket: Socket): Promise<void> {
  try {
    if (!socket.token) {
      throw Error('Authentication error');
    }

    const { username } = socket.token;
    const votes = twitchService.getVotes(username);
    socket.emit('VOTES_RESPONSE', votes);
  } catch (error) {
    const response = handleErrors(error);
    socket.emit('ERROR_RESPONSE', response);
  }
}
