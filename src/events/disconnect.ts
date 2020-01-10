import { container } from 'tsyringe';
import { Socket } from '../../src/middleware/authenticate';
import { GameStoreService } from '../../src/services/game-store.service';

const gameStoreService = container.resolve(GameStoreService);

export async function disconnect(reason: string, socket: Socket): Promise<void> {
  try {
    if (!socket.token) {
      return;
    }

    const { username } = socket.token;

    // Inform the partipants the host has disconnected
    socket.to(username).emit('host_disconnected');

    // Delete session
    gameStoreService.deleteGame(username);
  } catch {}
}
