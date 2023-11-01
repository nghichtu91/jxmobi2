import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import cookieParser from 'cookie-parser';
import multer from 'multer';

const upload = multer();

export function appGlobalConfig(app: NestExpressApplication): void {
  app.use(cookieParser());

  // app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));

  // for parsing multipart/form-data
  app.use(upload.any());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: { target: false },
    }),
  );
}
