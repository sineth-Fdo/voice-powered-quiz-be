import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import * as serverless from 'serverless-http';

const app = express();

async function bootstrap() {
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(app),
  );
  
  // Apply your CORS settings and middlewares here
  nestApp.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  await nestApp.init();
  return app;
}

let cachedHandler;

export default async (req, res) => {
  if (!cachedHandler) {
    const expressApp = await bootstrap();
    cachedHandler = serverless(expressApp);
  }
  return cachedHandler(req, res);
};