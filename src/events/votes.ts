import { container } from 'tsyringe';
import { Socket } from '../middleware/authenticate';
import { handleErrors } from '../utils/handle-errors';
import { TwitchService } from '../services/twitch.service';

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
