import { container } from 'tsyringe';
import { Socket } from '../middleware/authenticate';
import { handleErrors } from '../utils/handle-errors';
import { GameStoreService } from '../services/game-store.service';
import { isShip } from '../utils/is-ship';
import { TwitchService } from '../services/twitch.service';
import { hasBeenFiredUpon } from '../utils/has-been-fired-upon';
import { isGridComplete } from '../../src/utils/is-grid-complete';
import { chatFire } from './chat-fire';

const gameStoreService = container.resolve(GameStoreService);
const twitchService = container.resolve(TwitchService);

export async function playerFire(x: number, y: number, socket: Socket): Promise<void> {
  try {
    if (!socket.token) {
      throw Error('Authentication error');
    }

    const { username } = socket.token;
    const game = await gameStoreService.findGame(username);
    const { chatGrid, chatVoteTime } = game;

    const targetedByPlayer = chatGrid[y][x];
    if (hasBeenFiredUpon(targetedByPlayer)) {
      throw Error('Target has already been hit');
    }

    const didHit = isShip(targetedByPlayer);

    let isChatGridComplete = false;
    if (didHit) {
      chatGrid[y][x] = 'x';
      isChatGridComplete = isGridComplete(chatGrid);
    } else {
      chatGrid[y][x] = 'o';
    }

    gameStoreService.updateGame(username, game);

    if (!isChatGridComplete) {
      socket.emit('PLAYER_FIRE_RESPONSE', { x, y }, didHit, chatVoteTime);

      // Bot listen to channel to collect votes
      twitchService.joinChannel(username);
      setTimeout(() => chatFire(game, socket), chatVoteTime * 1000);
    } else {
      socket.emit('WINNER_RESPONSE', username);
    }
  } catch (error) {
    const response = handleErrors(error);
    socket.emit('ERROR_RESPONSE', response);
  }
}
