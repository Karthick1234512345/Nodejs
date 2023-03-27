const Sequelize = require('sequelize');

const { Op } = require('sequelize');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const logger = require('../services/logger');

const getAllUsers = async () => {
  try {
    const users = await model.users.findAll({
      where: {
        status: 'enabled',
        [Op.and]: [
          Sequelize.literal('LENGTH("firstName") > LENGTH("lastName")'),
          {
            Phonenumber: {
              [Op.ne]: null,
            },
          },
        ],
      },
      attributes: ['id', 'firstName', 'lastName', 'Email', 'accountType', 'status', 'Phonenumber'],
    });
    if (!users.length) {
      throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
    }
    logger.info(`${users.length} users found`);
    return users.map((user) => user.toJSON());
  } catch (error) {
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    logger.error(`Error occurred while getting users: ${error.message}`);
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};
module.exports = { getAllUsers };
