import { config } from "dotenv";
config();

export const {
  PORT,
  DB_URI,
  API_PREFIX,
  S3_BUCKET_NAME,
  AWS_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  JWT_SECRET,
  BEARER_TOKEN,
  SALT,
  EXPIRES_IN,
  MAIL_USERNAME,
  MAIL_FROM_NAME,
  MAIL_HOST,
  MAIL_PASSWORD,
} = process.env;
