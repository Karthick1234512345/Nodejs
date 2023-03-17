const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();
// eslint-disable-next-line max-len
const sequelize = () => new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, { dialect: process.env.DIALECT });

module.exports = { sequelize };
