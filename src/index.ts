import 'reflect-metadata';
import dotenv from 'dotenv';
import app from './app';
import { MongoService } from './services/mongo.service';
import { container } from 'tsyringe';
import { TwitchService } from './services/twitch.service';

const start = async () => {
  dotenv.config();
  const { HTTP_PORT, NODE_ENV = 'develop' } = process.env;

  const mongoService = container.resolve(MongoService);
  mongoService.connect();

  const twitchService = container.resolve(TwitchService);
  twitchService.connect();

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

  app(HTTP_PORT);

  console.info(`(${NODE_ENV} environment) server listening on :: ${HTTP_PORT}`);
};

start();
