import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import app from './app';

const start = async () => {
  dotenv.config();

  const { HTTP_PORT, DATABASE_URL, NODE_ENV = 'develop' } = process.env;

  const mongoClient = await MongoClient.connect(DATABASE_URL);

  const onError = (error: any) => {
    let message = '';

    switch (error.code) {
      case 'EACCES':
        message = `Port ${HTTP_PORT} requires elevated privileges`;
        break;
      case 'EADDRINUSE':
        message = `Port ${HTTP_PORT} is already in use`;
        break;
      default:
        message = error;
    }

    console.error(message);
    process.exit(1);
  };

  process.on('unhandledRejection', onError);
  process.on('uncaughtException', onError);

  app(HTTP_PORT, mongoClient);

  console.info(`(${NODE_ENV} environment) server listening on :: ${HTTP_PORT}`);
};

start();
