require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || 'secretkey',
    ELO_DEFAULT: 1200,
    ELO_K_FACTOR: 32,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};
