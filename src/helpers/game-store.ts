import { InsertOneWriteOpResult, Collection, FindAndModifyWriteOpResultObject, MongoClient } from 'mongodb';

export interface BATGame {
  username: string;
  grid: number[][];
  chatVoteTime: number;
}

export function insertGame(mongoClient: MongoClient, game: BATGame): Promise<InsertOneWriteOpResult<any>> {
  return gameCollection(mongoClient).insertOne(game);
}

export function findGame(mongoClient: MongoClient, username: string): Promise<BATGame> {
  return gameCollection(mongoClient).findOne({ username });
}

export function updateGame(
  mongoClient: MongoClient,
  username: string,
  updatedGame: Partial<BATGame>
): Promise<FindAndModifyWriteOpResultObject<BATGame>> {
  return gameCollection(mongoClient).findOneAndUpdate({ username }, { $set: updatedGame });
}

const gameCollection = (mongoClient: MongoClient): Collection => {
  return mongoClient.db('bat').collection('games');
};
