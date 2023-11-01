import path from 'path';

// Application configuration
export const apiUrls = process.env.API_URLS.split('|');
export const apiUrl = apiUrls[0];
export const apiHost = new URL(apiUrl).origin;
export const fullApiUrl = `${apiUrl}/${process.env.API_VERSION}`;
export const clientUrl = process.env.CLIENT_URL;

// Logging (morgan)
export const enableLogging = !!process.env.ENABLE_LOGGING;
export const logDir = process.env.LOG_DIR;
export const onlyErrorRequests = !!process.env.ONLY_ERROR_REQUESTS;
export const logFormat = process.env.LOG_FORMAT;

// Environment config variables
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = +process.env.PORT || 3000;
export const LISTEN_ON = process.env.LISTEN_ON || '0.0.0.0';
export const WORKING_DIR = path.resolve(__dirname, '../../../../'); // Notice: Pay attention to this variable when restructuring the project

// Basic auth (Cookies configuration)
export const sessionSecret = process.env.SESSION_SECRET;
export const sessionMaxAge = process.env.SESSION_MAX_AGE;

// JSON Web Token
export const jwtSecretKey = process.env.JWT_SECRET_KEY;
export const jwtTokenExpiration = process.env.JWT_TOKEN_EXPIRATION;
export const jwtRefreshTokenExpiration =
  process.env.JWT_REFRESH_TOKEN_EXPIRATION;

export const ADMIN_USER = process.env.ADMIN_USER || 'nghichtu09';

// payments
export const ATM_VALUE_ONE = +process.env.ATM_VALUE_ONE || 1.1; // số tiền nhỏ ơn 1.100.000
export const ATM_VALUE_SECOND = +process.env.ATM_VALUE_SECOND || 1.15; //# số tiền nhỏ ơn 2.000.000
export const ATM_VALUE_THIRD = +process.env.ATM_VALUE_THIRD || 1.2; //# số tiền nhỏ ơn 20.000.000

export const CARD_VALUE_ONE = +process.env.CARD_VALUE_ONE || 20;
export const CARD_VALUE_SECOND = +process.env.CARD_VALUE_SECOND || 40;
export const CARD_VALUE_THIRD = +process.env.CARD_VALUE_THIRD || 60;
export const CARD_VALUE_FOUR = +process.env.CARD_VALUE_FOUR || 100;
export const CARD_VALUE_FIVE = +process.env.CARD_VALUE_FIVE || 200;
export const CARD_VALUE_SIX = +process.env.CARD_VALUE_SIX || 400;
export const CARD_VALUE_SEVEND = +process.env.CARD_VALUE_SEVEND || 600;
export const CARD_VALUE_EIGHT = +process.env.CARD_VALUE_EIGHT || 1000;
export const CARD_VALUE_NINE = +process.env.CARD_VALUE_NINE || 2000;

export const PARTNERID = process.env.PARTNER_ID || '6471455261';
export const PARTNERKEY =
  process.env.PARTNER_KEY || '486b5afa44dc72a2c8cd991bc7f2a44e';
