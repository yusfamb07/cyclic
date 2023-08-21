require('dotenv').config();
const config = {
    env: process.env.NODE_ENV || '0.0.0.0',
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    db_name : process.env.DATABASE,
    db_username : process.env.DATABASE_USER,
    db_password: process.env.DATABASE_PASSWORD,
    // db_host: process.env.POSTGRES_HOST,
    // db_prisma: process.env.POSTGRES_PRISMA_URL,
    URL_DOMAIN : process.env.URL_DOMAIN,
    URL_IMAGE : process.env.URL_IMAGE,
    URL_API : process.env.URL_API,
    UPLOAD_DIR : process.env.UPLOAD_DIR
  }
  
export default config