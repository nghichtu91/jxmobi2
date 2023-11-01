import { NestExpressApplication } from '@nestjs/platform-express';

import session from 'express-session';
import parseDuration from 'parse-duration';
import passport from 'passport';
import flash = require('connect-flash');
import { Logger } from '@nestjs/common';
import { redisPort, redisUrl, sessionMaxAge, sessionSecret } from '@config';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';

export function configSession(app: NestExpressApplication) {
  const RedisStore = connectRedis(session);

  const redisClient = createClient({
    url: `redis://${redisUrl}:${redisPort}`,
    legacyMode: true,
  });

  redisClient.on('error', (err) => {
    Logger.log(
      `Could not establish a connection with redis. ${err}`,
      'Bootstrap',
    );
  });

  redisClient.connect();

  redisClient.on('connect', () => {
    Logger.log(`Connected to redis successfully`, 'Bootstrap');
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      resave: false,
      saveUninitialized: false,
      secret: sessionSecret,
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: parseDuration(sessionMaxAge, 'ms'), // session max age in milliseconds. Please restart Redis server after change this value!
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
}
