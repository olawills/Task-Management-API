import * as dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 3000,
    ENV: process.env.APP_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
  },
  DB: {
    URL: process.env.DB_URL,
  },
};
