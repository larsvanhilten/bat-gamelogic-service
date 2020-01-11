import { Client, Userstate } from 'tmi.js';
import { singleton } from 'tsyringe';

export interface Votes {
  [index: string]: number[][];
}

@singleton()
export class TwitchService {
  public client = Client({
    options: { debug: true },
    connection: {
      reconnect: true,
      secure: true
    }
  });
  private votes: Votes = {};

  public async connect(): Promise<void> {
    await this.client.connect();
    this.client.on('message', (channel, userState, message) => this.onMessage(userState, message));
  }

  public joinChannel(username: string): void {
    this.client.join(username);
    console.log(username);
    this.votes[username] = this.initializeVotes(10, 10);
  }

  public leaveChannel(username: string): void {
    this.client.part(username);
    delete this.votes[username];
  }

  public getVotes(username: string): number[][] {
    return this.votes[username];
  }

  public clearVotes(username: string): void {
    this.votes[username] = this.initializeVotes(10, 10);
  }

  private initializeVotes(lengthX: number, lengthY: number): number[][] {
    const grid = [];

    for (let y = 0; y < lengthY; y++) {
      grid.push([]);
      for (let x = 0; x < lengthX; x++) {
        grid[y].push(0);
      }
    }

    return grid;
  }

  private onMessage(userState: Userstate, message: string): void {
    try {
      if (message.startsWith('!fire')) {
        const x = parseInt(message.substring(6, 7), 10);
        const y = parseInt(message.substring(8, 9), 10);

        if (!isNaN(x) && !isNaN(y)) {
          const username = userState['display-name'];
          const votes = this.votes[username];
          votes[y - 1][x - 1]++;
        }
      }
    } catch {}
  }
}
