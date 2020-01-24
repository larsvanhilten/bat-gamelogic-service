import { container } from 'tsyringe';
import { Socket } from '../middleware/authenticate';
import { handleErrors } from '../utils/handle-errors';
import { GameStoreService, BATGame } from '../services/game-store.service';
import { isShip } from '../utils/is-ship';
import { TwitchService } from '../services/twitch.service';
import { getMaxVote } from '../utils/get-max-vote';
import { isGridComplete } from '../../src/utils/is-grid-complete';

const gameStoreService = container.resolve(GameStoreService);
const twitchService = container.resolve(TwitchService);

// Triggered by/after player-fire event
export async function chatFire(game: BATGame, socket: Socket): Promise<void> {
  try {
    const { username } = socket.token;
    const { playerGrid } = game;

    twitchService.leaveChannel(username);

    const votes = twitchService.getVotes(username);
    const { x, y } = getMaxVote(votes, playerGrid);
    twitchService.clearVotes(username);

    const playerTarget = playerGrid[y][x];
    const didHit = isShip(playerTarget);

    socket.emit('CHAT_FIRE', { x, y }, didHit);

    let isPlayerGridComplete = false;
    if (didHit) {
      playerGrid[y][x] = 'x';
      isPlayerGridComplete = isGridComplete(playerGrid);
    } else {
      playerGrid[y][x] = 'o';
    }

    gameStoreService.updateGame(username, game);

    if (isPlayerGridComplete) {
      socket.emit('WINNER', 'Chat');
    }
  } catch (error) {
    const response = handleErrors(error);
    socket.emit('ERROR_RESPONSE', response);
  }
}
