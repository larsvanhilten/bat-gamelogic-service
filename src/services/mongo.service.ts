import { MongoClient } from 'mongodb';
import { singleton } from 'tsyringe';

@singleton()
export class MongoService {
  public mongoClient: MongoClient;

  public async connect(): Promise<void> {
    const { DATABASE_URL } = process.env;
    this.mongoClient = await MongoClient.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }
}
