const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.DB_PORT || 1307,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'dbSecret',
};