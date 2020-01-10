import { InsertOneWriteOpResult, Collection, FindAndModifyWriteOpResultObject, MongoClient } from 'mongodb';
import { singleton } from 'tsyringe';
import { MongoService } from './mongo.service';

export interface BATGame {
  username: string;
  chatVoteTime: number;
  playerGrid: string[][];
  chatGrid: string[][];
}

@singleton()
export class GameStoreService {
  constructor(private mongoService: MongoService) {}

  public insertGame(game: BATGame): Promise<InsertOneWriteOpResult<any>> {
    return this.gameCollection.insertOne(game);
  }

  public findGame(username: string): Promise<BATGame> {
    return this.gameCollection.findOne({ username });
  }

  public updateGame(username: string, updatedGame: Partial<BATGame>): Promise<FindAndModifyWriteOpResultObject<BATGame>> {
    return this.gameCollection.findOneAndUpdate({ username }, { $set: updatedGame });
  }

  public deleteGame(username: string) {
    return this.gameCollection.findOneAndDelete({ username });
  }

  get gameCollection(): Collection {
    const { mongoClient } = this.mongoService;
    return mongoClient.db('bat').collection('games');
  }
}
