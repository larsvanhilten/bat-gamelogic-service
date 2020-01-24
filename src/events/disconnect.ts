import { container } from 'tsyringe';
import { Socket } from '../../src/middleware/authenticate';
import { GameStoreService } from '../../src/services/game-store.service';
import { TwitchService } from '../../src/services/twitch.service';

const gameStoreService = container.resolve(GameStoreService);
const twitchService = container.resolve(TwitchService);

export async function disconnect(reason: string, socket: Socket): Promise<void> {
  try {
    if (!socket.token) {
      return;
    }

    const { username } = socket.token;

    // Inform the partipants the host has disconnected
    socket.to(username).emit('DISCONNECTED_RESPONSE');

    // Stop listening to Twitch channels' chat
    twitchService.leaveChannel(username);

    // Delete session
    gameStoreService.deleteGame(username);
  } catch {}
}
